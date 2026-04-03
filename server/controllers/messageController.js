const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send a message
// @route   POST /api/messages

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, itemId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ message: 'Receiver and content are required' });
    }

    const message = new Message({
      sender: req.user.id,
      receiver: receiverId,
      item: itemId || null,
      content
    });

    await message.save();

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all conversations for the logged in user
// @route   GET /api/messages

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all messages where the user is either sender or receiver
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .populate('item', 'title images')
      .sort({ createdAt: -1 });

    // Group by conversation (the other user + item)
    // A conversation is identified by the other user and optionally the item
    const conversationsMap = new Map();

    messages.forEach(msg => {
      // Determine the "other" user in the conversation
      const otherUser = msg.sender._id.toString() === userId ? msg.receiver : msg.sender;
      if (!otherUser) return; // safety check

      const itemId = msg.item ? msg.item._id.toString() : 'no-item';

      // Creating a unique key for the conversation thread
      const key = `${otherUser._id.toString()}-${itemId}`;

      if (!conversationsMap.has(key)) {
        conversationsMap.set(key, {
          otherUser,
          item: msg.item,
          lastMessage: msg,
          unreadCount: (msg.receiver._id.toString() === userId && !msg.isRead) ? 1 : 0
        });
      } else {
        const existingConv = conversationsMap.get(key);
        if (msg.receiver._id.toString() === userId && !msg.isRead) {
          existingConv.unreadCount += 1;
        }
      }
    });

    // Convert map to array and sort by latest message
    const conversations = Array.from(conversationsMap.values());

    res.status(200).json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get thread with a specific user (and optionally an item)
// @route   GET /api/messages/thread/:otherUserId/:itemId?

exports.getThread = async (req, res) => {
  try {
    const { otherUserId, itemId } = req.params;
    const userId = req.user.id;

    const query = {
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    };

    if (itemId && itemId !== 'no-item') {
      query.item = itemId;
    } else {
      query.item = null;
    }

    const messages = await Message.find(query)
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: 1 });

    // Mark all received messages as read
    const unreadMessagesIds = messages
      .filter(msg => msg.receiver._id.toString() === userId && !msg.isRead)
      .map(msg => msg._id);

    if (unreadMessagesIds.length > 0) {
      await Message.updateMany(
        { _id: { $in: unreadMessagesIds } },
        { $set: { isRead: true } }
      );
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
