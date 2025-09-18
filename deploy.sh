#!/bin/bash

# Mahsoft Deployment Script untuk Cloud
# Path: /var/www/mahsoft/html/v3
# SSH: mahsites

set -e  # Exit on any error

echo "🚀 Memulakan deployment Mahsoft ke cloud..."

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Konfigurasi
SERVER="mahsites"
REMOTE_PATH="/var/www/mahsoft/html/v3"
LOCAL_PATH="$(pwd)"
PROJECT_NAME="mahsoft-v1"

echo -e "${BLUE}📋 Konfigurasi Deployment:${NC}"
echo "  Server: $SERVER"
echo "  Remote Path: $REMOTE_PATH"
echo "  Local Path: $LOCAL_PATH"
echo ""

# Fungsi untuk check command
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 tidak ditemui. Sila install $1 terlebih dahulu.${NC}"
        exit 1
    fi
}

# Check prerequisites
echo -e "${YELLOW}🔍 Memeriksa prerequisites...${NC}"
check_command "ssh"
check_command "rsync"
check_command "node"
check_command "npm"

# Check jika .env file wujud
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  File .env tidak ditemui. Menggunakan env.example...${NC}"
    if [ -f "env.example" ]; then
        cp env.example .env
        echo -e "${GREEN}✅ File .env telah dibuat dari env.example${NC}"
    else
        echo -e "${RED}❌ File env.example juga tidak ditemui!${NC}"
        exit 1
    fi
fi

# Build frontend
echo -e "${YELLOW}🏗️  Membina frontend...${NC}"
cd frontend
npm install
npm run build:public
cd ..

# Check jika build berjaya
if [ ! -d "public" ] || [ ! -f "public/index.html" ]; then
    echo -e "${RED}❌ Frontend build gagal! Folder public tidak ditemui.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend build berjaya${NC}"

# Create deployment package
echo -e "${YELLOW}📦 Menyediakan package deployment...${NC}"

# Create temporary directory
TEMP_DIR="/tmp/mahsoft-deploy-$(date +%s)"
mkdir -p "$TEMP_DIR"

# Copy files yang diperlukan
echo "  📁 Menyalin fail-fail projek..."
rsync -av --exclude='node_modules' \
          --exclude='.git' \
          --exclude='.env' \
          --exclude='backup' \
          --exclude='frontend/node_modules' \
          --exclude='frontend/dist' \
          --exclude='*.log' \
          --exclude='.DS_Store' \
          --exclude='Thumbs.db' \
          "$LOCAL_PATH/" "$TEMP_DIR/"

# Copy .env untuk production (jika wujud)
if [ -f ".env.production" ]; then
    cp .env.production "$TEMP_DIR/.env"
    echo "  📄 Menggunakan .env.production"
else
    echo "  📄 Menggunakan .env (sila kemaskini untuk production)"
fi

echo -e "${GREEN}✅ Package deployment siap${NC}"

# Deploy ke server
echo -e "${YELLOW}🚀 Deploying ke server $SERVER...${NC}"

# Create remote directory jika tidak wujud
ssh $SERVER "mkdir -p $REMOTE_PATH"

# Upload files
echo "  📤 Mengupload fail-fail..."
rsync -av --delete "$TEMP_DIR/" "$SERVER:$REMOTE_PATH/"

# Install dependencies di server
echo -e "${YELLOW}📦 Menginstall dependencies di server...${NC}"
ssh $SERVER "cd $REMOTE_PATH && npm install --production"

# Setup database di server
echo -e "${YELLOW}🗄️  Setup database di server...${NC}"
ssh $SERVER "cd $REMOTE_PATH && npx prisma generate"
ssh $SERVER "cd $REMOTE_PATH && npx prisma db push"

# Setup PM2 untuk process management
echo -e "${YELLOW}⚙️  Setup PM2 process management...${NC}"
ssh $SERVER "cd $REMOTE_PATH && npm install -g pm2 || true"
ssh $SERVER "cd $REMOTE_PATH && pm2 delete mahsoft-api || true"
ssh $SERVER "cd $REMOTE_PATH && pm2 start server.js --name mahsoft-api --env production"
ssh $SERVER "pm2 save"
ssh $SERVER "pm2 startup || true"

# Cleanup
echo -e "${YELLOW}🧹 Membersihkan fail sementara...${NC}"
rm -rf "$TEMP_DIR"

# Check status
echo -e "${YELLOW}🔍 Memeriksa status deployment...${NC}"
ssh $SERVER "cd $REMOTE_PATH && pm2 status mahsoft-api"

echo ""
echo -e "${GREEN}🎉 Deployment selesai!${NC}"
echo -e "${BLUE}📋 Maklumat Server:${NC}"
echo "  Server: $SERVER"
echo "  Path: $REMOTE_PATH"
echo "  Process: mahsoft-api (PM2)"
echo ""
echo -e "${YELLOW}🔧 Langkah seterusnya:${NC}"
echo "  1. SSH ke server: ssh $SERVER"
echo "  2. Check logs: pm2 logs mahsoft-api"
echo "  3. Restart jika perlu: pm2 restart mahsoft-api"
echo "  4. Setup reverse proxy (Nginx/Apache) jika perlu"
echo "  5. Setup SSL certificate jika perlu"
echo ""
echo -e "${GREEN}✅ Deployment berjaya!${NC}"
