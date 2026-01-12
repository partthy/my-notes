# Bluehost Deployment Guide

## Prerequisites

1. Node.js enabled on your Bluehost account (via cPanel)
2. MongoDB Atlas connection string
3. Upstash Redis credentials

## Deployment Steps

### 1. Build Frontend from Root

```bash
npm run build
```

This will automatically install dependencies and build the frontend.

### 2. Prepare Files

Your `frontend/dist` folder now contains the production build.

### 3. Upload to Bluehost via FTP/File Manager

Upload these files to your domain directory (e.g., `public_html` or `your-domain.com`):

```
backend/
  ├── src/
  ├── package.json
  └── node_modules/ (or install on server)
frontend/
  └── dist/
.env (create on server)
```

### 4. Set Up Node.js Application in cPanel

1. Log in to **cPanel**
2. Go to **Setup Node.js App**
3. Click **Create Application**
4. Configure:

   - **Node.js version**: 18.x or latest
   - **Application mode**: Production
   - **Application root**: `/home/username/public_html` (or your path)
   - **Application URL**: Your domain
   - **Application startup file**: `backend/src/server.js`
   - **Environment variables**: Add:
     ```
     NODE_ENV=production
     PORT=5001 (or use provided port)
     MONGODB_URI=your_mongodb_connection_string
     UPSTASH_REDIS_REST_URL=your_upstash_url
     UPSTASH_REDIS_REST_TOKEN=your_upstash_token
     ```

5. Click **Create**

### 5. Install Backend Dependencies

In cPanel's Node.js App interface:

```bash
cd backend
npm install
```

Or use Terminal in cPanel:

```bash
cd /home/username/public_html/backend
npm install --production
```

### 6. Start/Restart Application

Click **Restart** button in the Node.js App interface.

### 7. Configure .htaccess (if needed)

Create `.htaccess` in your root directory:

```apache
RewriteEngine On
RewriteRule ^$ http://127.0.0.1:5001/ [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://127.0.0.1:5001/$1 [P,L]
```

## Troubleshooting

### Check Logs

- View application logs in cPanel Node.js App section
- Check error logs in cPanel Error Logs

### Common Issues

1. **Module not found**: Run `npm install` in backend directory
2. **Port already in use**: Change PORT in environment variables
3. **Database connection failed**: Verify MongoDB URI
4. **Static files not loading**: Ensure frontend/dist is uploaded correctly

## Updates

To update the app:

1. Build frontend locally: `npm run build`
2. Upload new `frontend/dist` files
3. Upload any backend changes
4. Restart the Node.js app in cPanel

## Alternative: Using Git

If Bluehost supports Git deployment:

1. Push code to GitHub
2. SSH into server
3. Clone repository
4. Follow steps 4-6 above
