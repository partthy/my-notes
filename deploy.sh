#!/bin/bash

# Build frontend
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Copy built files
echo "Frontend built successfully!"
echo "Files ready in frontend/dist"
