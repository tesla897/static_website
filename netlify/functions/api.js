// Netlify Function to replace server.js endpoints
// This handles all the API routes from your Node.js server

const { marked } = require('marked');

// In-memory data storage (for demo purposes)
// In production, you would use a proper database
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

// Contact form submissions storage
let contactSubmissions = [];

exports.handler = async (event, context) => {
  // Set CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  const path = event.path;
  const method = event.httpMethod;

  try {
    // Blog Posts API
    if (path === '/api/posts') {
      if (method === 'GET') {
        // Return all blog posts
        return {
          statusCode: 200,
          headers: {
            ...headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(blogPosts)
        };
      }

      if (method === 'POST') {
        // Create new blog post
        const { title, content, author = 'Anonymous' } = JSON.parse(event.body);
        
        if (!title || !content) {
          return {
            statusCode: 400,
            headers: {
              ...headers,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Title and content are required' })
          };
        }
        
        const newPost = {
          id: blogPosts.length + 1,
          title,
          content,
          date: new Date().toISOString().split('T')[0],
          author
        };
        
        blogPosts.push(newPost);
        
        return {
          statusCode: 201,
          headers: {
            ...headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newPost)
        };
      }
    }

    // Single blog post by ID
    if (path.startsWith('/api/posts/') && method === 'GET') {
      const postId = parseInt(path.split('/').pop());
      const post = blogPosts.find(p => p.id === postId);
      
      if (post) {
        return {
          statusCode: 200,
          headers: {
            ...headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(post)
        };
      } else {
        return {
          statusCode: 404,
          headers: {
            ...headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ error: 'Post not found' })
        };
      }
    }

    // Markdown to HTML conversion
    if (path === '/api/convert-markdown' && method === 'POST') {
      const { markdown } = JSON.parse(event.body);
      
      if (!markdown) {
        return {
          statusCode: 400,
          headers: {
            ...headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ error: 'Markdown content is required' })
        };
      }
      
      const html = marked(markdown);
      
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ html })
      };
    }

    // Contact form submission
    if (path === '/api/contact' && method === 'POST') {
      const { name, email, message } = JSON.parse(event.body);
      
      if (!name || !email || !message) {
        return {
          statusCode: 400,
          headers: {
            ...headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ error: 'All fields are required' })
        };
      }
      
      // Store locally (for demo)
      const submission = {
        id: contactSubmissions.length + 1,
        name,
        email,
        message,
        date: new Date().toISOString()
      };
      
      contactSubmissions.push(submission);
      
      // Convertkit integration (optional - add your API keys here)
      const convertkitApiKey = process.env.CONVERTKIT_API_KEY;
      const convertkitFormId = process.env.CONVERTKIT_FORM_ID;
      
      if (convertkitApiKey && convertkitFormId) {
        try {
          const axios = require('axios');
          await axios.post(
            `https://api.convertkit.com/v3/forms/${convertkitFormId}/subscribe`,
            {
              api_key: convertkitApiKey,
              email: email,
              first_name: name
            }
          );
        } catch (error) {
          console.log('Convertkit integration failed:', error.message);
          // Don't fail the request if Convertkit fails
        }
      }
      
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          success: true, 
          message: 'Message sent successfully!',
          submission 
        })
      };
    }

    // Health check endpoint
    if (path === '/health' && method === 'GET') {
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: 'OK', 
          timestamp: new Date().toISOString(),
          platform: 'Netlify Functions'
        })
      };
    }

    // Convertkit webhook
    if (path === '/api/convertkit-webhook' && method === 'POST') {
      console.log('Convertkit webhook received:', JSON.parse(event.body));
      
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ success: true })
      };
    }

    // 404 for unmatched routes
    return {
      statusCode: 404,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Not found' })
    };

  } catch (error) {
    console.error('Function error:', error);
    
    return {
      statusCode: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};