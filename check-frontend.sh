#!/usr/bin/env zsh
# Frontend Health Check Script

echo "🔍 Running Frontend Health Check..."
echo "=================================="

# Check if both servers are running
echo "\n📡 Checking if servers are running..."

# Check frontend (port 3000)
if lsof -i:3000 > /dev/null 2>&1; then
    echo "✅ Frontend server is running on port 3000"
else
    echo "❌ Frontend server is NOT running on port 3000"
    echo "   Run: cd frontend && npm start"
fi

# Check backend (port 8000)
if lsof -i:8000 > /dev/null 2>&1; then
    echo "✅ Backend server is running on port 8000"
else
    echo "❌ Backend server is NOT running on port 8000"
    echo "   Run: cd backend && npm start"
fi

# Check if we can reach the frontend
echo "\n🌐 Testing frontend accessibility..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is accessible at http://localhost:3000"
else
    echo "❌ Frontend is not accessible"
fi

# Check if we can reach the backend API
echo "\n🔌 Testing backend API accessibility..."
if curl -s http://localhost:8000/api > /dev/null; then
    echo "✅ Backend API is accessible at http://localhost:8000/api"
else
    echo "❌ Backend API is not accessible"
fi

echo "\n📋 Summary:"
echo "==========="
echo "Frontend URL: http://localhost:3000"
echo "Backend API: http://localhost:8000/api"
echo ""
echo "🚀 Your CRUD application should be fully functional!"
echo ""
echo "Test the following features:"
echo "- User registration and login"
echo "- Create, read, update, delete books"
echo "- Create, read, update, delete categories"
echo "- Search and pagination"
echo ""
echo "Happy coding! 🎉"
