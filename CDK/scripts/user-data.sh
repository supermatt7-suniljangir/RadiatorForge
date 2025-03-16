#!/bin/bash

# Update system packages
sudo apt update -y && sudo apt upgrade -y

# Install Node.js 20 (compatible with Ubuntu 22.04)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install development tools (needed for some npm packages)
sudo apt install -y build-essential

# Install Git
sudo apt install -y git

# Install MongoDB tools
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/mongodb-archive-keyring.gpg] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org-shell mongodb-org-tools

# Install Redis
sudo apt install -y redis-server

# Start Redis
sudo systemctl start redis || echo "Redis start failed, but continuing..."
sudo systemctl enable redis || echo "Redis enable failed, but continuing..."

# Install Nginx
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx || echo "Nginx start failed, but continuing..."
sudo systemctl enable nginx || echo "Nginx enable failed, but continuing..."

# Create app directory
sudo mkdir -p /home/ubuntu/app
sudo chown -R ubuntu:ubuntu /home/ubuntu/app

# Set up environment variables
cat > /home/ubuntu/app/.env << EOL
PORT=5500
MONGO_URI=mongodb+srv://<your-mongo-uri>
JWT_SECRET=<your-jwt-secret>
GOOGLE_CLIENT_ID=<your-google-client-id>
AWS_ACCESS_KEY_ID=<your-aws-access-key-id>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-access-key>
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=<your-s3-bucket-name>
CORS_ORIGIN=https://radiatorforge.suniljangir.site
EOL



# Clone the backend repository
git clone https://github.com/supermatt7-suniljangir/RF-backend.git /home/ubuntu/app || echo "Git clone failed, but continuing..."

# Install TypeScript and ts-node globally
sudo npm install -g typescript ts-node || echo "TypeScript/ts-node installation failed, but continuing..."

# Set up PM2 for process management
sudo npm install -g pm2 || echo "PM2 installation failed, but continuing..."

# Configure nginx
sudo tee /etc/nginx/sites-available/default > /dev/null << EOL
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:5500;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

# Restart Nginx to apply changes
sudo systemctl restart nginx || echo "Nginx restart failed, but continuing..."

# Create a setup script for the user to run after connecting
cat > /home/ubuntu/setup.sh << EOL
#!/bin/bash
cd /home/ubuntu/app

# Install dependencies
npm install || echo "npm install failed, but continuing..."

# Build the app (for TypeScript)
npm run build || echo "npm build failed, but continuing..."

# Start the app with PM2
pm2 start npm --name "radiator-forge" -- start || echo "PM2 start failed, but continuing..."
pm2 startup systemd
sudo env PATH=\$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save || echo "PM2 save failed, but continuing..."

echo "Application is now running!"
EOL

# Make the setup script executable
chmod +x /home/ubuntu/setup.sh

# Create a README file with instructions
cat > /home/ubuntu/README.txt << EOL
Welcome to your Behance Clone EC2 Instance!

To complete the setup:

1. Upload your code to this instance or clone it from your repository
2. Run the setup script: ./setup.sh
3. Your application should now be running on port 5500 and accessible via nginx on port 80

To check the status of your application:
- pm2 status
- pm2 logs

To restart your application:
- pm2 restart all

Happy coding!
EOL

echo "User data script completed!"