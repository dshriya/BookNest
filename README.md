# BookNest

BookNest is a sophisticated book library web application that serves as your personal reading sanctuary. Built with modern technologies, it offers an immersive experience for book lovers to discover, track, and manage their reading journey.

## Features

- **Advanced Book Search**: Powered by Google Books API with refined search algorithms
- **User Authentication**: Secure login/signup system with JWT
- **Personal Library Management**: 
  - Like and save books to your collection
  - Add books to your reading nest
  - Manage your reading preferences
- **Personalized Profile**:
  - Customizable user profiles
  - Bio and profile picture support
  - Password management
- **Responsive Design**: Seamless experience across all devices

## Tech Stack

### Frontend
- **React.js**: Core framework for building the user interface
- **Material-UI**: Comprehensive component library for modern design
- **React Router**: Handling application routing
- **TypeScript**: Type-safe development
- **Axios**: HTTP client for API requests

### Backend
- **Node.js & Express**: Server framework
- **MongoDB**: NoSQL database using Mongoose ODM
- **JWT**: Secure authentication
- **Google Books API**: Book data and search functionality

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Google Books API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/booknest.git
cd booknest
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:

Create `.env` files in both `backend` and `frontend` directories:

**Backend `.env`:**
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_BOOKS_API_KEY=your_google_api_key
FRONTEND_URL=http://localhost:3000
```

4. Start the application:

```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm start
```

The application will be available at http://localhost:3000

## Project Structure

```
booknest/
├── backend/
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── middleware/    # Custom middleware
│   ├── utils/         # Utility functions
│   └── server.js      # Main server file
├── frontend/
│   ├── public/        # Static files
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Page components
│       ├── services/    # API services
│       └── utils/       # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.

