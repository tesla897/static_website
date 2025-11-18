// Blog functionality
let currentPosts = [];
let currentReadingPost = null;

document.addEventListener('DOMContentLoaded', function() {
    loadBlogPosts();
});

// Load and display blog posts
async function loadBlogPosts() {
    try {
        showLoading();
        const response = await apiCall('/api/posts');
        currentPosts = response;
        displayBlogPosts(response);
    } catch (error) {
        console.error('Failed to load blog posts:', error);
        showToast('Failed to load blog posts', 'error');
        displayEmptyBlog();
    } finally {
        hideLoading();
    }
}

// Display blog posts in the grid
function displayBlogPosts(posts) {
    const blogPostsContainer = document.getElementById('blog-posts');
    
    if (!blogPostsContainer) return;
    
    if (!posts || posts.length === 0) {
        displayEmptyBlog();
        return;
    }
    
    blogPostsContainer.innerHTML = '';
    
    posts.forEach(post => {
        const postElement = createBlogPostElement(post);
        blogPostsContainer.appendChild(postElement);
    });
}

// Create individual blog post element
function createBlogPostElement(post) {
    const postElement = document.createElement('div');
    postElement.className = 'blog-post';
    postElement.innerHTML = `
        <div class="blog-post-header">
            <h3 class="blog-post-title">${escapeHtml(post.title)}</h3>
            <div class="blog-post-meta">
                <span class="blog-post-date">${formatDate(post.date)}</span>
                <span class="blog-post-author">by ${escapeHtml(post.author)}</span>
            </div>
        </div>
        <div class="blog-post-content markdown-content">
                ${post.content.substring(0, 300)}${post.content.length > 300 ? '...' : ''}
        </div>
        <div class="blog-post-actions">
            <button class="btn btn-sm btn-outline" onclick="readFullPost(${post.id})">
                <i class="fas fa-book-open"></i> Read More
            </button>
            <button class="btn btn-sm btn-primary" onclick="showMarkdownEditor(${post.id})">
                <i class="fas fa-edit"></i> Edit
            </button>
        </div>
    `;
    
    return postElement;
}

// Display empty blog state
function displayEmptyBlog() {
    const blogPostsContainer = document.getElementById('blog-posts');
    if (blogPostsContainer) {
        blogPostsContainer.innerHTML = `
            <div class="blog-empty">
                <i class="fas fa-blog"></i>
                <h3>No blog posts yet</h3>
                <p>Start writing your first blog post using the Markdown converter below!</p>
                <button class="btn btn-primary" onclick="scrollToSection('converter')">
                    Create Your First Post
                </button>
            </div>
        `;
    }
}

// Read full blog post
function readFullPost(postId) {
    const post = currentPosts.find(p => p.id === postId);
    if (!post) {
        showToast('Post not found', 'error');
        return;
    }
    
    currentReadingPost = post;
    
    // Create reading mode view
    const blogPostsContainer = document.getElementById('blog-posts');
    blogPostsContainer.innerHTML = `
        <a href="#" class="back-to-blog" onclick="backToBlogList()">
            <i class="fas fa-arrow-left"></i> Back to Blog List
        </a>
        
        <article class="blog-post reading-mode">
            <div class="blog-post-header">
                <h1 class="blog-post-title">${escapeHtml(post.title)}</h1>
                <div class="blog-post-meta">
                    <span class="blog-post-date">${formatDate(post.date)}</span>
                    <span class="blog-post-author">by ${escapeHtml(post.author)}</span>
                </div>
            </div>
            <div class="blog-post-content markdown-content">
                ${post.content}
            </div>
            <div class="blog-post-actions">
                <button class="btn btn-outline" onclick="showMarkdownEditor(${post.id}, true)">
                    <i class="fas fa-edit"></i> Edit This Post
                </button>
                <button class="btn btn-secondary" onclick="copyPostContent(${post.id})">
                    <i class="fas fa-copy"></i> Copy Content
                </button>
            </div>
        </article>
    `;
    
    // Smooth scroll to blog section
    scrollToSection('blog');
}

// Back to blog list view
function backToBlogList() {
    currentReadingPost = null;
    displayBlogPosts(currentPosts);
}

// Show Markdown editor for creating/editing posts
function showMarkdownEditor(postId = null, isEditMode = false) {
    const post = postId ? currentPosts.find(p => p.id === postId) : null;
    
    // Create modal for markdown editor
    const modal = document.createElement('div');
    modal.className = 'markdown-editor-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}</h3>
                <button class="modal-close" onclick="closeMarkdownEditor()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="post-title">Title</label>
                    <input type="text" id="post-title" value="${post ? escapeHtml(post.title) : ''}" 
                           placeholder="Enter post title..." required>
                </div>
                <div class="form-group">
                    <label for="post-author">Author</label>
                    <input type="text" id="post-author" value="${post ? escapeHtml(post.author) : 'Admin'}" 
                           placeholder="Author name..." required>
                </div>
                <div class="converter-container">
                    <div class="converter-input">
                        <h3>Markdown Content</h3>
                        <textarea id="post-markdown" placeholder="Write your blog post in Markdown...">${post ? post.content : ''}</textarea>
                        <div class="converter-actions">
                            <button class="btn btn-primary" onclick="previewPostMarkdown()">
                                <i class="fas fa-eye"></i> Preview
                            </button>
                            <button class="btn btn-outline" onclick="loadSampleBlogMarkdown()">
                                <i class="fas fa-file-alt"></i> Load Sample
                            </button>
                        </div>
                    </div>
                    <div class="converter-output">
                        <h3>Preview</h3>
                        <div id="post-preview" class="html-output markdown-content">
                            <p>Preview will appear here...</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeMarkdownEditor()">Cancel</button>
                <button class="btn btn-primary" onclick="saveBlogPost(${post ? post.id : 'null'})">
                    <i class="fas fa-save"></i> ${isEditMode ? 'Update' : 'Create'} Post
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    const modalStyles = `
        .markdown-editor-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            padding: 20px;
        }
        
        .modal-content {
            background-color: white;
            border-radius: 10px;
            max-width: 90vw;
            max-height: 90vh;
            width: 100%;
            display: flex;
            flex-direction: column;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #e9ecef;
        }
        
        .modal-header h3 {
            margin: 0;
            color: #2c3e50;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #6c757d;
            padding: 5px;
        }
        
        .modal-close:hover {
            color: #333;
        }
        
        .modal-body {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        }
        
        .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            padding: 20px;
            border-top: 1px solid #e9ecef;
            background-color: #f8f9fa;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
        }
        
        .form-group input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e9ecef;
            border-radius: 5px;
            font-size: 1rem;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #3498db;
        }
        
        #post-markdown {
            width: 100%;
            min-height: 300px;
            padding: 15px;
            border: 1px solid #e9ecef;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            resize: vertical;
        }
        
        #post-preview {
            min-height: 300px;
            padding: 15px;
            border: 1px solid #e9ecef;
            border-radius: 5px;
            background-color: #f8f9fa;
            overflow-y: auto;
        }
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'modal-styles';
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Scroll to editor
    setTimeout(() => {
        modal.scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

// Close Markdown editor
function closeMarkdownEditor() {
    const modal = document.querySelector('.markdown-editor-modal');
    if (modal) {
        modal.remove();
    }
}

// Preview post markdown
async function previewPostMarkdown() {
    const markdownContent = document.getElementById('post-markdown').value;
    const previewElement = document.getElementById('post-preview');
    
    if (!markdownContent.trim()) {
        previewElement.innerHTML = '<p style="color: #6c757d;">Enter some Markdown to see preview...</p>';
        return;
    }
    
    try {
        const response = await apiCall('/api/convert-markdown', {
            method: 'POST',
            body: JSON.stringify({ markdown: markdownContent })
        });
        
        previewElement.innerHTML = response.html;
    } catch (error) {
        console.error('Failed to preview markdown:', error);
        previewElement.innerHTML = '<p style="color: #e74c3c;">Failed to generate preview</p>';
    }
}

// Load sample blog markdown
function loadSampleBlogMarkdown() {
    const sampleMarkdown = `# Welcome to My New Blog Post!

This is a sample blog post to get you started with Markdown.

## What you can do with Markdown

- **Bold text** for emphasis
- *Italic text* for subtle emphasis
- \`Code snippets\` for technical content
- [Links](https://example.com) for references

### Code Examples

Here's some JavaScript code:

\`\`\`javascript
function greetUser(name) {
    return \`Hello, \${name}! Welcome to my blog.\`;
}

console.log(greatUser('Reader'));
\`\`\`

### Blockquotes

> "The best way to learn is by doing. Start writing your own blog posts today!"

### Lists

My favorite programming languages:
1. JavaScript
2. Python  
3. Java
4. TypeScript

### Images

You can also add images to make your posts more engaging!

Happy writing! 🚀`;

    const markdownTextarea = document.getElementById('post-markdown');
    if (markdownTextarea) {
        markdownTextarea.value = sampleMarkdown;
        previewPostMarkdown();
    }
}

// Save blog post
async function saveBlogPost(postId = null) {
    const title = document.getElementById('post-title').value.trim();
    const author = document.getElementById('post-author').value.trim() || 'Admin';
    const content = document.getElementById('post-markdown').value.trim();
    
    if (!title || !content) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    try {
        showLoading();
        
        const method = postId ? 'PUT' : 'POST';
        const url = postId ? `/api/posts/${postId}` : '/api/posts';
        
        const response = await apiCall(url, {
            method: method,
            body: JSON.stringify({ title, author, content })
        });
        
        showToast(postId ? 'Post updated successfully!' : 'Post created successfully!');
        closeMarkdownEditor();
        
        // Reload blog posts
        await loadBlogPosts();
        
    } catch (error) {
        console.error('Failed to save post:', error);
        showToast('Failed to save post', 'error');
    } finally {
        hideLoading();
    }
}

// Copy post content
function copyPostContent(postId) {
    const post = currentPosts.find(p => p.id === postId);
    if (post) {
        copyToClipboard(post.content);
    }
}

// Delete blog post (bonus functionality)
async function deleteBlogPost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) {
        return;
    }
    
    try {
        showLoading();
        
        await apiCall(`/api/posts/${postId}`, {
            method: 'DELETE'
        });
        
        showToast('Post deleted successfully!');
        await loadBlogPosts();
        
    } catch (error) {
        console.error('Failed to delete post:', error);
        showToast('Failed to delete post', 'error');
    } finally {
        hideLoading();
    }
}