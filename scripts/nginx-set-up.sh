#!/bin/bash
# ============================================================
# Nginx setup script for sprite-shop-pixelism
# Run with: sudo bash nginx-setup.sh
# (PROD ONLY - run after EC2 setup and app deployment)
# ============================================================

echo "Installing Nginx..."
sudo apt update
sudo apt install nginx -y

echo "Creating Nginx config..."

sudo rm -f /etc/nginx/sites-enabled/default
sudo tee /etc/nginx/sites-available/pixelism > /dev/null <<EOF
server {
    server_name pixelism.duckdns.org;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API — giữ nguyên /api/ prefix
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Actuator (health check)
    location /actuator/ {
        proxy_pass http://localhost:8080/actuator/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # OAuth2 authorization (click Google/GitHub button)
    location /oauth2/ {
        proxy_pass http://localhost:8080/oauth2/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # OAuth2 callback (Google/GitHub redirect về)
    location /login/oauth2/ {
        proxy_pass http://localhost:8080/login/oauth2/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/pixelism.duckdns.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pixelism.duckdns.org/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    listen 80;
    server_name pixelism.duckdns.org;
    return 308 https://$host$request_uri;
}
EOF

sudo ln -sf /etc/nginx/sites-available/pixelism /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

echo "Nginx setup completed!"
