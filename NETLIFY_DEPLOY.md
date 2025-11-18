# Netlify Deployment Guide

This website is now configured for easy deployment on Netlify! Here's how to deploy it:

## 🚀 Quick Deploy

### Option 1: Netlify CLI (Recommended)

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy to Netlify:**
   ```bash
   netlify deploy --prod
   ```

### Option 2: Git Integration

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider
   - Select your repository
   - Netlify will auto-detect settings from `netlify.toml`

## 📁 Project Structure

```
/
├── netlify.toml           # Netlify configuration
├── netlify/functions/     # Serverless functions
│   └── api.js            # Main API handler
├── public/               # Static files
│   ├── index.html        # Landing page
│   ├── about.html        # About page
│   ├── faq.html         # FAQ page
│   ├── blog.html        # Blog page
│   ├── _redirects       # SPA routing rules
│   ├── css/            # Stylesheets
│   └── js/             # JavaScript files
├── server.js            # Local development server
└── package.json         # Dependencies
```

## ⚙️ Configuration

### netlify.toml
- Sets publish directory to `public`
- Configures Netlify Functions directory
- Enables SPA redirects
- Sets Node.js version

### Netlify Functions
All API endpoints are converted to Netlify Functions:
- `/api/posts` - Blog posts management
- `/api/convert-markdown` - Markdown to HTML conversion
- `/api/contact` - Contact form submissions
- `/health` - Health check

## 🔧 Environment Variables

For additional functionality, set these in Netlify dashboard:

1. Go to Site Settings → Environment Variables
2. Add the following if needed:

```
CONVERTKIT_API_KEY=your-convertkit-api-key
CONVERTKIT_FORM_ID=your-convertkit-form-id
```

## 📋 Features Available

✅ **Static Pages:**
- Landing page with hero section
- About page with markdown content
- FAQ page with comprehensive Q&A

✅ **Blog System:**
- Blog listing page
- Individual blog posts with markdown
- Sample blog posts included

✅ **Markdown Converter:**
- Real-time markdown to HTML conversion
- Support for all standard markdown syntax
- Copy HTML to clipboard

✅ **Contact Form:**
- Working contact form
- Form validation
- Success notifications

## 🌐 URL Structure

After deployment, your site will be available at:
- `https://yoursite.netlify.app/` - Landing page
- `https://yoursite.netlify.app/about` - About page
- `https://yoursite.netlify.app/faq` - FAQ page
- `https://yoursite.netlify.app/blog` - Blog page

## 🔄 API Endpoints

Your Netlify Functions will be available at:
- `https://yoursite.netlify.app/api/posts`
- `https://yoursite.netlify.app/api/convert-markdown`
- `https://yoursite.netlify.app/api/contact`
- `https://yoursite.netlify.app/health`

## 🚦 Custom Domain

1. In Netlify dashboard, go to Domain settings
2. Add your custom domain
3. Update DNS records as instructed
4. SSL will be automatically provisioned

## 🔍 Testing

After deployment, verify:
- [ ] All pages load correctly
- [ ] Navigation works between pages
- [ ] Blog posts display properly
- [ ] Markdown converter works
- [ ] Contact form submits successfully
- [ ] API endpoints respond correctly

## 🛠️ Local Development

For local testing before deployment:

```bash
# Install dependencies
npm install

# Start local server
npm start

# Or use development mode
npm run dev
```

Then visit http://localhost:3000

## 📈 Performance

Netlify provides:
- ✅ Global CDN
- ✅ Automatic SSL
- ✅ Fast page loads
- ✅ Serverless functions
- ✅ Form handling
- ✅ Analytics

## 🆘 Troubleshooting

**Issue: Pages not loading correctly**
- Check `_redirects` file is in public directory
- Verify netlify.toml configuration

**Issue: API not working**
- Ensure functions are in `netlify/functions` directory
- Check Netlify Functions logs in dashboard

**Issue: Build failing**
- Verify all dependencies are listed in package.json
- Check Node.js version compatibility

## 🎉 Success!

Your website is now ready for Netlify deployment with:
- ⚡ Serverless functions for API endpoints
- 📱 Responsive design for all devices
- 🔄 Client-side routing with SPA support
- 📝 Markdown support throughout
- 🚀 Production-ready configuration

Happy deploying! 🚀