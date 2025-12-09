#!/bin/bash

# Berkeley Goggles - Development Setup Script

echo "🚀 Setting up Berkeley Goggles development environment..."

# Check Node.js version
NODE_VERSION=$(node --version 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "❌ Node.js is not installed. Please install Node.js >= 18.0.0"
    exit 1
fi

echo "✅ Node.js version: $NODE_VERSION"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup environment files
echo "🔧 Setting up environment files..."

# Backend environment
if [ ! -f "backend/.env" ]; then
    cp backend/.env.development backend/.env
    echo "✅ Created backend/.env from development template"
else
    echo "⚠️  backend/.env already exists, skipping..."
fi

# Web environment
if [ ! -f "web/.env.local" ]; then
    cp web/.env.example web/.env.local
    echo "✅ Created web/.env.local from template"
else
    echo "⚠️  web/.env.local already exists, skipping..."
fi

# Setup database
echo "🗄️  Setting up database..."
cd backend

# Generate Prisma client
npm run db:generate

# Create database (SQLite for development)
npm run db:push

echo "✅ Database setup complete"

cd ..

echo "🎉 Development setup complete!"
echo ""
echo "To start development servers:"
echo "  npm run dev"
echo ""
echo "To start individual services:"
echo "  npm run dev:backend  # Backend API (port 3001)"
echo "  npm run dev:web      # Frontend (port 5173)"
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:3001"
echo "API Health: http://localhost:3001/health"