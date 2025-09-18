#!/bin/bash

echo "=== Mahsoft Project Deployment ==="
echo "Setting up Git repository and deploying to GitHub..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
else
    echo "Git repository already initialized"
fi

# Add remote origin
echo "Adding remote origin..."
git remote add origin https://github.com/atiqihazizan/mahsoft.git 2>/dev/null || echo "Remote already exists"

# Add all files including backup
echo "Adding all files to Git..."
git add .

# Create initial commit
echo "Creating initial commit..."
git commit -m "Initial commit: Mahsoft project with Prisma and React

- Complete invoice, receipt, and quote management system
- Prisma ORM with PostgreSQL database
- React frontend with Vite
- Print preview functionality
- Backup files included
- Complete setup documentation"

# Set main branch
echo "Setting main branch..."
git branch -M main

# Push to remote
echo "Pushing to GitHub..."
git push -u origin main

echo "=== Deployment completed successfully! ==="
echo "Repository: https://github.com/atiqihazizan/mahsoft.git"

