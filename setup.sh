#!/bin/bash
# Quick Setup Guide for Investment Portfolio React App

echo "================================================"
echo "Investment Portfolio Management System Setup"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "================================================"
echo "Setup Complete!"
echo "================================================"
echo ""
echo "Available commands:"
echo ""
echo "  npm run dev        - Start development server"
echo "  npm run build      - Build for production"
echo "  npm run preview    - Preview production build"
echo ""
echo "To start developing:"
echo "  npm run dev"
echo ""
echo "App will open at: http://localhost:3000"
echo ""
