# Static Website with Node.js, Express, and Modern Web Technologies

A complete static website solution built with Node.js, Express, HTML, CSS, and JavaScript featuring a blog system, Markdown converter, contact form, and Convertkit integration.

## 🌟 Features

### 1. **Simple Webpage**
- Responsive design with modern CSS
- Smooth scrolling navigation
- Mobile-friendly hamburger menu
- Professional hero section
- Loading states and toast notifications

### 2. **Blog Post Template System**
- Create, read, update, and delete blog posts
- Markdown-powered content creation
- Real-time preview
- Sample blog posts included
- Search and filter functionality
- Reading mode for full post view

### 3. **Markdown to HTML Converter**
- Real-time Markdown conversion
- Support for all standard Markdown syntax:
  - Headers, bold, italic, strikethrough
  - Lists (ordered and unordered)
  - Links and images
  - Code blocks with syntax highlighting
  - Tables
  - Blockquotes
  - Horizontal rules
- Copy HTML to clipboard
- Download converted HTML as file
- Character and word count statistics

### 4. **Convertkit Integration**
- API integration for email marketing
- Newsletter subscription support
- Webhook endpoints for external triggers
- Graceful fallback if API is unavailable
- Environment variable configuration

### 5. **Contact Form**
- Form validation and error handling
- Real-time character counter
- Auto-resizing textareas
- Success/error notifications
- Alternative contact methods fallback
- Local storage of submissions
- Convertkit integration for lead capture

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or download the project:**
```bash
# If you have the files, navigate to the project directory
cd static-website-node
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm start
```

4. **Open your browser:**
Navigate to `http://localhost:3000`

### Development Mode
For development with auto-restart:
```bash
npm run dev
```

## 📁 Project Structure

```
static-website-node/
├── package.json              # Project dependencies and scripts
├── server.js                 # Express server with API routes
├── README.md                 # This file
└── public/                   # Static files served by Express
    ├── index.html           # Main webpage
    ├── css/                 # Stylesheets
    │   ├── style.css        # Main styles
    │   ├── blog.css         # Blog-specific styles
    │   └── markdown.css     # Markdown converter styles
    └── js/                  # JavaScript files
        ├── main.js          # General functionality
        ├── blog.js          # Blog system logic
        ├── markdown-converter.js # Markdown conversion
        └── contact.js       # Contact form handling
```

## 🛠️ API Endpoints

### Blog Posts
- `GET /api/posts` - Get all blog posts
- `GET /api/posts/:id` - Get specific blog post
- `POST /api/posts` - Create new blog post
- `PUT /api/posts/:id` - Update blog post
- `DELETE /api/posts/:id` - Delete blog post

### Markdown Conversion
- `POST /api/convert-markdown` - Convert Markdown to HTML

### Contact Form
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get contact submissions (admin)

### Convertkit Integration
- `POST /api/convertkit-webhook` - Webhook for Convertkit
- `POST /api/newsletter` - Newsletter subscription

### Health Check
- `GET /health` - Server health status

## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the project root:

```env
# Convertkit API Configuration
CONVERTKIT_API_KEY=your-convertkit-api-key
CONVERTKIT_FORM_ID=your-convertkit-form-id

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Convertkit Setup
1. Sign up for Convertkit account
2. Create a form or sequence
3. Get your API key and Form ID from Convertkit dashboard
4. Add them to your `.env` file

## 📝 Usage Guide

### Creating Blog Posts

1. **Using the Blog Interface:**
   - Click "Create Your First Post" or "Edit" on existing posts
   - Fill in title and author
   - Write content in Markdown
   - Preview in real-time
   - Click "Create Post"

2. **Sample Markdown for Blog Posts:**
```markdown
# Your Post Title

## Introduction
Write your content in **Markdown** format.

### Features
- Easy to write
- Readable syntax
- Converted to HTML

> This is a blockquote for emphasis.

\`\`\`javascript
console.log("Code blocks with syntax highlighting");
\`\`\`

[Links](https://example.com) and **bold text** work great!
```

### Using the Markdown Converter

1. **Real-time Conversion:**
   - Type Markdown in the left panel
   - See HTML output on the right
   - Use "Load Sample" for examples

2. **Supported Syntax:**
   - Headers: `# ## ###`
   - Bold: `**text**` or `__text__`
   - Italic: `*text*` or `_text_`
   - Code: `` `code` ``
   - Code blocks: ```` ``` ````
   - Links: `[text](url)`
   - Images: `![alt](url)`
   - Lists: `- item` or `1. item`
   - Blockquotes: `> quote`

### Contact Form Features

1. **Form Validation:**
   - Name: minimum 2 characters
   - Email: valid email format
   - Message: minimum 10 characters

2. **Enhanced Features:**
   - Character counter (max 1000)
   - Auto-resizing textarea
   - Success/error notifications
   - Alternative contact methods if form fails

## 🎨 Customization

### Styling
- Modify CSS files in `public/css/`
- Colors, fonts, and layouts can be easily changed
- Responsive design adapts to mobile devices

### Content
- Update sample blog posts in `server.js`
- Modify contact information in `public/index.html`
- Change website title and branding

### Functionality
- Add new API routes in `server.js`
- Extend JavaScript functionality in `public/js/`
- Integrate additional services via environment variables

## 🔧 Development

### Adding New Features
1. **Backend API:** Add routes to `server.js`
2. **Frontend:** Create new JavaScript files in `public/js/`
3. **Styling:** Add CSS rules to appropriate files in `public/css/`
4. **HTML:** Update `public/index.html` with new sections

### Debugging
- Server logs appear in terminal
- Browser console shows JavaScript errors
- Use `npm run dev` for auto-restart during development

### Testing
```bash
# Test API endpoints
curl http://localhost:3000/api/posts
curl http://localhost:3000/health

# Test contact form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello!"}'
```

## 📦 Dependencies

### Production
- **express** - Web framework
- **marked** - Markdown parser
- **body-parser** - Request body parsing
- **cors** - Cross-origin resource sharing
- **axios** - HTTP client for API calls

### Development
- **nodemon** - Auto-restart development server

## 🚀 Deployment

### Environment Setup
1. Set production environment variables
2. Use `NODE_ENV=production`
3. Configure PORT for your platform

### Platform Deployment
- **Heroku:** `git push heroku main`
- **Vercel:** Connect to your Git repository
- **Railway:** Deploy via Git integration
- **DigitalOcean App Platform:** Connect GitHub repo

### Build Optimization
- No build step required (static files served directly)
- All dependencies are Node.js compatible
- Can be deployed to any platform supporting Node.js

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Make changes and test thoroughly
4. Commit changes: `git commit -am 'Add feature'`
5. Push to branch: `git push origin feature-name`
6. Submit pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🆘 Support

- Check the console for error messages
- Verify all dependencies are installed
- Ensure port 3000 is available
- Check environment variables are set correctly

## 🔮 Future Enhancements

- User authentication system
- File upload for images
- SEO optimization
- RSS feed generation
- Search functionality
- Comment system
- Social media integration
- Analytics dashboard
- PWA capabilities
- Multi-language support

---

**Built with ❤️ using Node.js, Express, and modern web technologies.**