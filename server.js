const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { marked } = require('marked');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Sample blog posts data
let blogPosts = [
  {
    id: 1,
    title: "Welcome to My Blog",
    content: `# Welcome to My Blog

This is my first blog post written in Markdown! 

## Features

- **Markdown support** - Write posts in Markdown
- **Easy to use** - Simple and clean interface
- **Responsive design** - Works on all devices

\`\`\`javascript
console.log("Hello World!");
\`\`\`

Stay tuned for more posts!`,
    date: new Date().toISOString().split('T')[0],
    author: "Admin"
  },
  {
    id: 2,
    title: "Building Web Applications",
    content: `# Building Web Applications

Web development has come a long way. Here are some key points:

## What you'll need

1. HTML - Structure
2. CSS - Styling  
3. JavaScript - Interactivity
4. Backend - Server logic

> "The best way to learn is by doing."

[Learn more about web development](https://developer.mozilla.org/)`,
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    author: "Admin"
  }
];

// Sample contact form submissions
let contactSubmissions = [];

// Convertkit API configuration
const CONVERTKIT_API_URL = 'https://api.convertkit.com/v3';
const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY || 'your-convertkit-api-key';
const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID || 'your-form-id';

// Routes

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Blog posts list
app.get('/api/posts', (req, res) => {
  res.json(blogPosts);
});

// Get single blog post
app.get('/api/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = blogPosts.find(p => p.id === postId);
  
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

// Create new blog post
app.post('/api/posts', (req, res) => {
  const { title, content, author = 'Anonymous' } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  
  const newPost = {
    id: blogPosts.length + 1,
    title,
    content,
    date: new Date().toISOString().split('T')[0],
    author
  };
  
  blogPosts.push(newPost);
  res.status(201).json(newPost);
});

// Convert Markdown to HTML
app.post('/api/convert-markdown', (req, res) => {
  const { markdown } = req.body;
  
  if (!markdown) {
    return res.status(400).json({ error: 'Markdown content is required' });
  }
  
  try {
    const html = marked(markdown);
    res.json({ html });
  } catch (error) {
    res.status(500).json({ error: 'Failed to convert Markdown' });
  }
});

// Contact form submission
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  // Store locally
  const submission = {
    id: contactSubmissions.length + 1,
    name,
    email,
    message,
    date: new Date().toISOString()
  };
  
  contactSubmissions.push(submission);
  
  // Try to integrate with Convertkit (optional)
  try {
    if (CONVERTKIT_API_KEY !== 'your-convertkit-api-key') {
      const response = await axios.post(
        `${CONVERTKIT_API_URL}/forms/${CONVERTKIT_FORM_ID}/subscribe`,
        {
          api_key: CONVERTKIT_API_KEY,
          email: email,
          first_name: name
        }
      );
      
      console.log('Convertkit subscription successful:', response.data);
    }
  } catch (error) {
    console.log('Convertkit integration failed:', error.message);
    // Don't fail the request if Convertkit fails
  }
  
  res.json({ 
    success: true, 
    message: 'Message sent successfully!',
    submission 
  });
});

// Convertkit webhook endpoint
app.post('/api/convertkit-webhook', (req, res) => {
  console.log('Convertkit webhook received:', req.body);
  res.json({ success: true });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Visit http://localhost:${PORT} to see your website`);
});

module.exports = app;