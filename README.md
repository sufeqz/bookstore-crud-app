# 📚 BookStore CRUD Application

A full-stack CRUD (Create, Read, Update, Delete) application for managing books with user authentication.

## 🛠️ **Tech Stack**

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## 🚀 **Features**

- ✅ User authentication (signup/login)
- ✅ JWT-based authorization
- ✅ CRUD operations for books
- ✅ Category management
- ✅ Protected routes
- ✅ Responsive design
- ✅ Real-time form validation

## 📋 **Prerequisites**

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

## 🔧 **Installation & Setup**

### 1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd crud
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
\`\`\`

### 3. Database Setup
Create a PostgreSQL database named \`crud\` and update the \`.env\` file:

\`\`\`env
DATABASE_URL="postgresql://username:password@localhost:5432/crud?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
PORT=8000
NODE_ENV=development
\`\`\`

### 4. Run Database Migrations
\`\`\`bash
npx prisma migrate dev
npx prisma generate
node prisma/seed.js
\`\`\`

### 5. Start Backend Server
\`\`\`bash
npm start
# Server runs on http://localhost:8000
\`\`\`

### 6. Frontend Setup
\`\`\`bash
cd ../frontend
npm install
npm start
# App runs on http://localhost:3000
\`\`\`

## 📊 **API Endpoints**

### Authentication
- \`POST /api/signup\` - User registration
- \`POST /api/login\` - User login

### Books (Protected)
- \`GET /api/books\` - Get all user's books
- \`GET /api/books/:id\` - Get specific book
- \`POST /api/books\` - Create new book
- \`PUT /api/books/:id\` - Update book
- \`DELETE /api/books/:id\` - Delete book

### Categories
- \`GET /api/categories\` - Get all categories
- \`POST /api/categories\` - Create new category (protected)

## 🗄️ **Database Schema**

### Users
- \`id\` (Primary Key)
- \`email\` (Unique)
- \`name\`
- \`password\` (Hashed)
- \`createdAt\`
- \`updatedAt\`

### Books
- \`id\` (Primary Key)
- \`title\`
- \`author\`
- \`description\`
- \`price\`
- \`userId\` (Foreign Key)
- \`categoryId\` (Foreign Key)
- \`createdAt\`
- \`updatedAt\`

### Categories
- \`id\` (Primary Key)
- \`name\` (Unique)
- \`description\`
- \`createdAt\`
- \`updatedAt\`

## 🔒 **Security Features**

- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- Input validation
- CORS configuration

## 🚦 **Usage**

1. **Register** a new account or **login** with existing credentials
2. **View** your personal book collection on the dashboard
3. **Add** new books with title, author, description, price, and category
4. **Edit** or **delete** existing books
5. **Browse** books by categories

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📝 **License**

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 **Author**

- **Sufee** - Full Stack Developer

## 🎯 **Future Enhancements**

- [ ] Search and filter functionality
- [ ] Book cover image uploads
- [ ] Reading status tracking
- [ ] Book reviews and ratings
- [ ] Export data to CSV/PDF
- [ ] Dark mode theme
- [ ] Mobile app version
