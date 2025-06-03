#!/bin/bash
# 🚀 Quick Push Script for BookStore CRUD App
# Usage: ./push.sh "Your commit message"

if [ -z "$1" ]; then
    echo "❌ Please provide a commit message"
    echo "Usage: ./push.sh \"Your commit message\""
    exit 1
fi

echo "🔄 Adding all changes..."
git add .

echo "📝 Committing with message: $1"
git commit -m "$1"

echo "🚀 Pushing to GitHub..."
git push origin main

echo "✅ Successfully pushed to GitHub!"
echo "🌐 View your repo: https://github.com/sufeqz/bookstore-crud-app"
