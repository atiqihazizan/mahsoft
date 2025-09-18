#!/bin/bash

# Setup Git Repository
echo "Setting up Git repository..."

# Initialize git repository
git init

# Add remote origin
git remote add origin https://github.com/atiqihazizan/mahsoft.git

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Mahsoft project with Prisma and React"

# Set main branch
git branch -M main

# Push to remote
git push -u origin main

echo "Git setup completed!"

