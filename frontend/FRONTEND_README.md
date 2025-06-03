# Book Management System - Frontend

A modern React frontend for the Book Management System with full CRUD functionality.

## Features

- 🔐 **Authentication System**
  - User registration and login
  - JWT token-based authentication
  - Protected routes for authenticated users

- 📚 **Book Management**
  - View all books with search and filtering
  - Add new books with category assignment
  - Edit existing book details
  - Delete books with confirmation

- 🏷️ **Category Management**
  - Create and manage book categories
  - Edit category names and descriptions
  - Delete categories (if not in use)

- 📊 **Dashboard**
  - Overview of total books and categories
  - Recent books display
  - Quick navigation to main features

## Tech Stack

- **React 18** - Frontend framework
- **React Router 6** - Client-side routing
- **Axios** - HTTP client for API calls
- **Context API** - State management for authentication
- **CSS3** - Modern styling with responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on `http://localhost:8000`

## Installation

1. Clone the repository and navigate to the frontend directory:
   ```bash
   cd /path/to/crud/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── BookForm.js     # Book creation/editing form
│   ├── BookList.js     # Book listing component
│   ├── CategoryForm.js # Category creation/editing form
│   ├── CategoryList.js # Category listing component
│   ├── Navigation.js   # Main navigation component
│   └── ProtectedRoute.js # Route protection wrapper
├── context/            # React Context providers
│   └── AuthContext.js  # Authentication context
├── pages/              # Main page components
│   ├── Dashboard.js    # Dashboard overview
│   ├── Books.js        # Books management page
│   └── Categories.js   # Categories management page
├── services/           # API service layer
│   ├── api.js          # Axios configuration
│   ├── authService.js  # Authentication API calls
│   ├── bookService.js  # Book CRUD operations
│   └── categoryService.js # Category CRUD operations
└── utils/              # Utility functions
```

## Usage

### Authentication
1. Register a new account or login with existing credentials
2. The app automatically redirects to the dashboard upon successful login
3. JWT tokens are stored in localStorage for session persistence

### Managing Books
1. Navigate to the "Books" section
2. Use the search bar to find specific books by title or author
3. Filter books by category using the dropdown
4. Click "Add New Book" to create a new book entry
5. Use the edit (✏️) button to modify existing books
6. Use the delete (🗑️) button to remove books

### Managing Categories
1. Navigate to the "Categories" section
2. View all available categories
3. Click "Add New Category" to create a new category
4. Edit existing categories using the edit button
5. Delete unused categories (categories with books cannot be deleted)

### Dashboard
- View quick statistics about your library
- See recent books added to your collection
- Quick access buttons to main sections

## API Integration

The frontend communicates with the backend API at `http://localhost:8000` using:

- `POST /api/signup` - User registration
- `POST /api/login` - User authentication
- `GET /api/books` - Fetch all books
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book
- `GET /api/categories` - Fetch all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

## Responsive Design

The application is fully responsive and works on:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile phones (< 768px)

## Error Handling

- Network errors are handled gracefully with user-friendly messages
- Form validation provides immediate feedback
- Authentication errors redirect to login page
- Loading states are shown during API calls

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Development

To contribute to this project:

1. Follow the existing code structure and naming conventions
2. Add proper error handling for new features
3. Ensure responsive design for all new components
4. Test with the backend API before submitting changes

## Build for Production

```bash
npm run build
```

This creates optimized production files in the `build/` directory.

## License

This project is part of a CRUD application demo.
