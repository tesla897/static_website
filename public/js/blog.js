// Blog functionality
document.addEventListener('DOMContentLoaded', function() {
    loadBlogPosts();
});

// Sample blog posts data (in a real app, this would come from an API)
const blogPosts = [
    {
        id: 1,
        title: "Getting Started with Web Development",
        content: `# Getting Started with Web Development

Welcome to my first blog post! Today I'll share some insights about getting started with web development.

## What You'll Need

To begin your journey in web development, you'll need:

### 1. **HTML (HyperText Markup Language)**
HTML is the backbone of every web page. It provides the structure and content.

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>My First Webpage</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>This is my first webpage.</p>
</body>
</html>
\`\`\`

### 2. **CSS (Cascading Style Sheets)**
CSS brings your web pages to life with colors, layouts, and animations.

> **Pro Tip:** Start with the basics - fonts, colors, and spacing.

### 3. **JavaScript**
JavaScript adds interactivity and dynamic behavior to your websites.

\`\`\`javascript
function greetUser(name) {
    return \`Hello, \${name}! Welcome to my website.\`;
}

console.log(greetUser('Developer'));
\`\`\`

## Recommended Learning Path

1. **Start with HTML** - Learn the structure
2. **Add CSS** - Make it beautiful
3. **Learn JavaScript** - Add interactivity
4. **Practice** - Build small projects
5. **Keep Learning** - Technology evolves!

## Resources

- [MDN Web Docs](https://developer.mozilla.org/) - Excellent documentation
- [freeCodeCamp](https://www.freecodecamp.org/) - Free interactive tutorials
- [CSS-Tricks](https://css-tricks.com/) - CSS tips and tricks

## Final Thoughts

Remember, **practice makes perfect**. Don't be afraid to experiment and break things - that's how you learn!

> "The only way to learn web development is by building websites."

Thanks for reading, and happy coding! 🚀`,
        excerpt: "Learn the fundamentals of web development with this comprehensive guide covering HTML, CSS, and JavaScript basics.",
        date: "2025-11-15",
        author: "Web Developer"
    },
    {
        id: 2,
        title: "Building Responsive Websites with CSS Grid",
        content: `# Building Responsive Websites with CSS Grid

CSS Grid is a powerful layout system that makes creating responsive designs much easier than before.

## What is CSS Grid?

CSS Grid is a two-dimensional layout system that allows you to arrange content in rows and columns.

\`\`\`css
.grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
}

.grid-item {
    background: #f0f0f0;
    padding: 20px;
    border-radius: 8px;
}
\`\`\`

## Basic Grid Properties

### Grid Container
- \`display: grid\`
- \`grid-template-columns\`
- \`grid-template-rows\`
- \`gap\`

### Grid Items
- \`grid-column\`
- \`grid-row\`

## Responsive Design Example

\`\`\`css
@media (max-width: 768px) {
    .grid-container {
        grid-template-columns: 1fr;
    }
}
\`\`\`

> **Note:** Always consider mobile users first!

## Browser Support

CSS Grid is supported in all modern browsers:
- Chrome 57+
- Firefox 52+
- Safari 10.1+
- Edge 16+

## Conclusion

CSS Grid makes complex layouts much simpler. Start using it in your projects today!

*Happy coding!* 💻`,
        excerpt: "Discover how CSS Grid can simplify your responsive web design workflow with practical examples and best practices.",
        date: "2025-11-12",
        author: "Frontend Developer"
    },
    {
        id: 3,
        title: "JavaScript Promises: A Beginner's Guide",
        content: `# JavaScript Promises: A Beginner's Guide

Understanding promises is crucial for modern JavaScript development. Let's break it down!

## What is a Promise?

A Promise is an object representing the eventual completion or failure of an asynchronous operation.

\`\`\`javascript
const myPromise = new Promise((resolve, reject) => {
    // Async operation here
    const success = true;
    
    if (success) {
        resolve("Operation completed successfully!");
    } else {
        reject("Operation failed!");
    }
});
\`\`\`

## Promise States

A promise can be in one of three states:
- **Pending** - Initial state
- **Fulfilled** - Operation completed successfully
- **Rejected** - Operation failed

## Using Promises

### The \`then()\` Method
\`\`\`javascript
myPromise
    .then(result => {
        console.log(result); // "Operation completed successfully!"
    })
    .catch(error => {
        console.error(error); // "Operation failed!"
    });
\`\`\`

### Async/Await (Modern Approach)
\`\`\`javascript
async function fetchData() {
    try {
        const result = await myPromise;
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}
\`\`\`

## Real-World Example: Fetching Data

\`\`\`javascript
async function getUserData(userId) {
    try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        throw error;
    }
}
\`\`\`

## Best Practices

1. **Always handle errors** - Use \`.catch()\` or try/catch
2. **Chain promises properly** - Return promises in \`.then()\`
3. **Use async/await** for better readability

## Conclusion

Promises are fundamental to asynchronous JavaScript. Master them, and you'll write much cleaner code!

> "Promises are the path to asynchronous enlightenment." 🌟`,
        excerpt: "Learn the fundamentals of JavaScript promises, including syntax, states, and real-world usage patterns for better async code.",
        date: "2025-11-10",
        author: "JavaScript Developer"
    }
];

async function loadBlogPosts() {
    const blogPostsContainer = document.getElementById('blog-posts');
    const template = document.getElementById('blog-post-template');
    
    if (!blogPostsContainer || !template) return;
    
    // Show loading state
    blogPostsContainer.innerHTML = '<div class="loading-posts">Loading posts...</div>';
    
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Clear loading state
        blogPostsContainer.innerHTML = '';
        
        // Create blog post cards
        blogPosts.forEach(post => {
            const postCard = template.cloneNode(true);
            postCard.style.display = 'block';
            postCard.id = `post-${post.id}`;
            
            // Populate post data
            postCard.querySelector('.blog-post-title').textContent = post.title;
            postCard.querySelector('.blog-post-date').textContent = formatDate(post.date);
            postCard.querySelector('.blog-post-author').textContent = `By ${post.author}`;
            postCard.querySelector('.blog-post-excerpt').innerHTML = `<p>${post.excerpt}</p>`;
            
            // Add click handler for read more
            postCard.querySelector('.read-more-btn').addEventListener('click', () => {
                showFullPost(post);
            });
            
            // Add click handler for markdown converter
            postCard.querySelector('.markdown-converter-link').addEventListener('click', () => {
                scrollToMarkdownConverter();
            });
            
            blogPostsContainer.appendChild(postCard);
        });
        
    } catch (error) {
        console.error('Error loading blog posts:', error);
        blogPostsContainer.innerHTML = '<p class="error">Failed to load blog posts. Please try again later.</p>';
    }
}

function showFullPost(post) {
    // Create modal or new page for full post
    const modal = document.createElement('div');
    modal.className = 'post-modal';
    modal.innerHTML = `
        <div class="post-modal-content">
            <div class="post-modal-header">
                <h2>${post.title}</h2>
                <span class="close-modal">&times;</span>
            </div>
            <div class="post-modal-meta">
                <span>${formatDate(post.date)}</span>
                <span>By ${post.author}</span>
            </div>
            <div class="post-modal-body markdown-content">
                ${convertMarkdownToHtml(post.content)}
            </div>
            <div class="post-modal-footer">
                <button class="btn btn-secondary close-modal">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle modal close
    modal.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Convert markdown to HTML
    convertMarkdownToHtmlInElement(modal.querySelector('.post-modal-body'));
}

function scrollToMarkdownConverter() {
    const converter = document.querySelector('.converter-section');
    if (converter) {
        converter.scrollIntoView({ behavior: 'smooth' });
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function convertMarkdownToHtml(markdown) {
    // Simple markdown to HTML conversion
    // In a real app, you'd use a proper markdown library
    return markdown
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        .replace(/`([^`]+)`/gim, '<code>$1</code>')
        .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
        .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/\n\n/gim, '</p><p>')
        .replace(/^(.*)$/gim, '<p>$1</p>')
        .replace(/<p><\/p>/gim, '')
        .replace(/<p>(<li>.*?<\/li>)<\/p>/gim, '<ul>$1</ul>')
        .replace(/<p>(<h[1-6]>.*?<\/h[1-6]>)<\/p>/gim, '$1')
        .replace(/<p>(<blockquote>.*?<\/blockquote>)<\/p>/gim, '$1')
        .replace(/<p>(<pre>.*?<\/pre>)<\/p>/gim, '$1');
}

function convertMarkdownToHtmlInElement(element) {
    const markdown = element.textContent;
    element.innerHTML = convertMarkdownToHtml(markdown);
}