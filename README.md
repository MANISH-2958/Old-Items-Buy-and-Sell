# TradeHub - Old Item Buy & Sell Marketplace

![TradeHub Platform](https://img.shields.io/badge/TradeHub-Marketplace-1a2036?style=for-the-badge) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

TradeHub is a comprehensive MERN-stack based marketplace application that allows users to easily buy and sell old items. Designed with a premium, high-contrast dark and yellow theme, the platform offers a sleek and intuitive user experience. 

## 🚀 Key Features

- **User Authentication**: Secure login and registration functionality to manage user sessions.
- **Product Listings**: Sellers can list their old items with images (via drag-and-drop), titles, descriptions, and categories.
- **Currency Selection**: Dynamic currency selection tailored for different geographical regions when listing products.
- **Browse & Search**: Buyers can seamlessly browse various categories, search for specific items, and view detailed product pages.
- **User Dashboard**: A dedicated dashboard for users to manage their own listings (edit/delete functionality).
- **Responsive Design**: Fully responsive layout ensuring a perfect experience across desktops, tablets, and mobile devices.
- **Modern UI/UX**: Premium styling featuring custom components, animated route transitions, and toast notifications.

## 🛠️ Technology Stack

**Frontend:**
- [React 19](https://react.dev/) (with React Hooks)
- [Vite 6](https://vitejs.dev/) - Next Generation Frontend Tooling
- [React Router DOM](https://reactrouter.com/) - For declarative routing
- [Axios](https://axios-http.com/) - Promise-based HTTP client for API requests
- [React Dropzone](https://react-dropzone.js.org/) - For handling image file uploads
- [React Hot Toast](https://react-hot-toast.com/) - For beautiful, customizable toast notifications
- [React Icons](https://react-icons.github.io/react-icons/) - For high-quality vector icons
- Vanilla CSS (for scoped and global custom styling)

**Backend Integration:**
- Proxy configuration in Vite to route `/api` and `/uploads` requests to a backend server running on `http://localhost:5000`. (Node.js/Express and MongoDB backend expected).

### 🔌 API Endpoints Used

The application relies on a backend API over the base URL `/api`. Axios is configured globally (`src/api/axios.js`) with request interceptors to seamlessly attach `Authorization` headers (Bearer tokens) and response interceptors to manage session expiration (auto-redirect to login on `401` errors).

**Authentication API (`/api/auth`)**
- `GET /auth/me`: Fetches the currently authenticated user's profile information.
- `POST /auth/login`: Authenticates a user using email and password, returning a JWT token.
- `POST /auth/register`: Registers a new user account.

**Items/Products API (`/api/items`)**
- `GET /items`: Fetches items. Supports robust query parameters (e.g., `?limit=8&sort=newest` or specific `category` and search params used in Browse).
- `GET /items/:id`: Fetches detailed information for a specific item.
- `POST /items`: Creates a new product listing. Seamlessly passes `multipart/form-data` payloads to support image uploads.
- `PUT /items/:id`: Updates an existing item (used for editing details or swiftly toggling `isSold` status).
- `DELETE /items/:id`: Permanently deletes a specific user-owned item.
- `GET /items/user/:user_id`: Fetches all items listed by a specific user (crucial for populating the User Dashboard).

### 🔍 Technical Implementation Details

- **State Management**: Authentication state is managed globally through the React Context API (`AuthContext`), persisting logged-in state and tokens securely into `localStorage`.
- **Protected Routing**: A specialized `<ProtectedRoute>` higher-order component ensures that only authenticated users can access the Sell page and Dashboard.
- **Form Handling & Uploads**: Combines native form data processing with `react-dropzone` for rich drag-and-drop file inputs. Images are neatly packaged as `FormData` to accommodate standard file-handling backends (e.g., Express + Multer).
- **Styling Architecture**: Driven efficiently through a globally managed design system via CSS custom properties (`index.css`), bringing the high-contrast 'amber and dark-nav' TradeHub aesthetics to life without requiring an external UI framework.

## 📁 Project Structure

```text
old-item/
├── public/                 # Static assets
├── src/                    
│   ├── components/         # Reusable UI components (Navbar, Footer, ProtectedRoute, etc.)
│   ├── context/            # React Contexts (e.g., AuthContext)
│   ├── pages/              # Application views/routes (Home, Browse, Login, SellItem, Dashboard, etc.)
│   ├── App.jsx             # Main Application component & Route definitions
│   ├── index.css           # Global stylesheet and design system variables
│   └── main.jsx            # Application entry point
├── eslint.config.js        # ESLint configuration
├── vite.config.js          # Vite and proxy configuration
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation
```

## ⚙️ Installation and Setup

To run this project locally, follow these steps:

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A running backend server on port `5000` (for API and uploads proxy)

### 1. Clone the repository
```bash
git clone <repository-url>
cd old-item
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```

The application will start, usually on `http://localhost:5173`. Any API calls to `/api` or `/uploads` will be automatically proxied to `http://localhost:5000`.

## 📜 Available Scripts

In the project directory, you can run:

- `npm run dev`: Starts the Vite development server with Hot Module Replacement (HMR).
- `npm run build`: Builds the app for production to the `dist` folder.
- `npm run preview`: Bootstraps a local web server to preview the production build.
- `npm run lint`: Runs ESLint to identify and report on patterns found in ECMAScript/JavaScript code.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

