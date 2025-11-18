// Markdown Converter functionality

document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for real-time conversion
    const markdownInput = document.getElementById('markdown-input');
    if (markdownInput) {
        markdownInput.addEventListener('input', debounce(convertMarkdown, 500));
    }
});

// Convert Markdown to HTML
async function convertMarkdown() {
    const markdownInput = document.getElementById('markdown-input');
    const htmlOutput = document.getElementById('html-output');
    
    if (!markdownInput || !htmlOutput) return;
    
    const markdown = markdownInput.value.trim();
    
    if (!markdown) {
        htmlOutput.innerHTML = '<p style="color: #6c757d;">Enter some Markdown to convert...</p>';
        return;
    }
    
    try {
        showLoading();
        
        const response = await apiCall('/api/convert-markdown', {
            method: 'POST',
            body: JSON.stringify({ markdown: markdown })
        });
        
        htmlOutput.innerHTML = response.html;
        htmlOutput.scrollTop = 0; // Scroll to top of output
        
        // Add copy functionality to code blocks
        addCopyButtonsToCodeBlocks();
        
    } catch (error) {
        console.error('Failed to convert Markdown:', error);
        htmlOutput.innerHTML = `
            <div style="padding: 20px; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; color: #721c24;">
                <strong>Conversion Error:</strong> Failed to convert Markdown to HTML. Please check your syntax.
            </div>
        `;
        showToast('Failed to convert Markdown', 'error');
    } finally {
        hideLoading();
    }
}

// Clear Markdown input and output
function clearMarkdown() {
    const markdownInput = document.getElementById('markdown-input');
    const htmlOutput = document.getElementById('html-output');
    
    if (markdownInput) {
        markdownInput.value = '';
    }
    
    if (htmlOutput) {
        htmlOutput.innerHTML = '<p style="color: #6c757d;">Converted HTML will appear here...</p>';
    }
}

// Load sample Markdown
function loadSampleMarkdown() {
    const sampleMarkdown = `# Markdown Converter Demo

Welcome to the **Markdown to HTML converter**! This tool helps you convert Markdown text into properly formatted HTML.

## Features

- **Real-time conversion** - See results as you type
- **Support for all standard Markdown syntax**
- **Code syntax highlighting**
- **Table support**
- **Image and link support**

### Basic Syntax Examples

#### Text Formatting
- **Bold text** using \`**text**\`
- *Italic text* using \`*text*\`
- ~~Strikethrough~~ using \`~~text~~\`
- \`Inline code\` using backticks

#### Lists

**Unordered list:**
- Item 1
- Item 2
  - Nested item 2a
  - Nested item 2b
- Item 3

**Ordered list:**
1. First step
2. Second step
3. Third step

#### Links and Images

Here's a [link to Markdown documentation](https://www.markdownguide.org/).

#### Blockquotes

> "The best way to learn Markdown is by using it."
> 
> This is a multi-line blockquote.

#### Code Blocks

Here's some JavaScript code:

\`\`\`javascript
function convertMarkdown(text) {
    // Convert Markdown to HTML
    return text
        .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
        .replace(/\\*(.*?)\\*/g, '<em>$1</em>')
        .replace(/\\n/g, '<br>');
}
\`\`\`

#### Tables

| Feature | Supported | Notes |
|---------|-----------|-------|
| Headers | ✅ | Yes |
| Lists | ✅ | Yes |
| Links | ✅ | Yes |
| Images | ✅ | Yes |
| Tables | ✅ | Yes |

#### Horizontal Rule

---

#### Inline HTML

You can also use <strong>HTML</strong> tags directly in your Markdown.

## Try it out!

Edit the Markdown on the left and see the HTML output on the right in real-time!`;

    const markdownInput = document.getElementById('markdown-input');
    if (markdownInput) {
        markdownInput.value = sampleMarkdown;
        convertMarkdown();
    }
}

// Add copy buttons to code blocks
function addCopyButtonsToCodeBlocks() {
    const codeBlocks = document.querySelectorAll('#html-output pre code');
    codeBlocks.forEach(codeBlock => {
        if (!codeBlock.parentElement.querySelector('.copy-button')) {
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.innerHTML = '<i class="fas fa-copy"></i>';
            copyButton.title = 'Copy code';
            copyButton.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(52, 152, 219, 0.8);
                color: white;
                border: none;
                border-radius: 4px;
                padding: 5px 10px;
                cursor: pointer;
                font-size: 12px;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            const preElement = codeBlock.parentElement;
            preElement.style.position = 'relative';
            preElement.appendChild(copyButton);
            
            // Show button on hover
            preElement.addEventListener('mouseenter', () => {
                copyButton.style.opacity = '1';
            });
            
            preElement.addEventListener('mouseleave', () => {
                copyButton.style.opacity = '0';
            });
            
            // Copy functionality
            copyButton.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(codeBlock.textContent);
                    copyButton.innerHTML = '<i class="fas fa-check"></i>';
                    showToast('Code copied to clipboard!');
                    
                    setTimeout(() => {
                        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy code:', err);
                    showToast('Failed to copy code', 'error');
                }
            });
        }
    });
}

// Download converted HTML
function downloadHTML() {
    const htmlOutput = document.getElementById('html-output');
    if (!htmlOutput || !htmlOutput.innerHTML.trim()) {
        showToast('No HTML to download', 'error');
        return;
    }
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Converted HTML</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1, h2, h3, h4, h5, h6 { color: #2c3e50; }
        a { color: #3498db; text-decoration: none; }
        a:hover { text-decoration: underline; }
        code { background-color: #f8f9fa; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace; }
        pre { background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px; overflow-x: auto; }
        blockquote { border-left: 4px solid #3498db; padding-left: 20px; margin: 20px 0; font-style: italic; color: #6c757d; background-color: #f8f9fa; padding: 15px 20px; border-radius: 5px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #bdc3c7; padding: 12px; text-align: left; }
        th { background-color: #ecf0f1; font-weight: 600; }
    </style>
</head>
<body>
${htmlOutput.innerHTML}
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'converted-html.html';
    link.click();
    URL.revokeObjectURL(url);
    
    showToast('HTML file downloaded!');
}

// Copy HTML to clipboard
async function copyHTML() {
    const htmlOutput = document.getElementById('html-output');
    if (!htmlOutput || !htmlOutput.innerHTML.trim()) {
        showToast('No HTML to copy', 'error');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(htmlOutput.innerHTML);
        showToast('HTML copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy HTML:', err);
        showToast('Failed to copy HTML', 'error');
    }
}

// Get Markdown statistics
function getMarkdownStats() {
    const markdownInput = document.getElementById('markdown-input');
    if (!markdownInput) return null;
    
    const content = markdownInput.value;
    const lines = content.split('\n').length;
    const characters = content.length;
    const words = content.split(/\s+/).filter(word => word.length > 0).length;
    
    // Count different Markdown elements
    const headers = (content.match(/^#+\s/gm) || []).length;
    const links = (content.match(/\[.*?\]\(.*?\)/g) || []).length;
    const codeBlocks = (content.match(/```[\s\S]*?```/g) || []).length;
    const images = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
    
    return {
        lines,
        characters,
        words,
        headers,
        links,
        codeBlocks,
        images
    };
}

// Display Markdown statistics
function showMarkdownStats() {
    const stats = getMarkdownStats();
    if (!stats) return;
    
    const statsHTML = `
        <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
            <h3 style="margin-top: 0;">Markdown Statistics</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                <div><strong>Lines:</strong> ${stats.lines}</div>
                <div><strong>Words:</strong> ${stats.words}</div>
                <div><strong>Characters:</strong> ${stats.characters}</div>
                <div><strong>Headers:</strong> ${stats.headers}</div>
                <div><strong>Links:</strong> ${stats.links}</div>
                <div><strong>Code Blocks:</strong> ${stats.codeBlocks}</div>
                <div><strong>Images:</strong> ${stats.images}</div>
            </div>
        </div>
    `;
    
    // Create modal to display stats
    const modal = document.createElement('div');
    modal.className = 'stats-modal';
    modal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 2000;">
            <div style="max-width: 500px; margin: 20px;">
                ${statsHTML}
                <button onclick="this.closest('.stats-modal').remove()" style="margin-top: 15px; padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto remove after 10 seconds
    setTimeout(() => {
        if (modal.parentElement) {
            modal.remove();
        }
    }, 10000);
}

// Export functions for use in HTML onclick handlers
window.convertMarkdown = convertMarkdown;
window.clearMarkdown = clearMarkdown;
window.loadSampleMarkdown = loadSampleMarkdown;
window.downloadHTML = downloadHTML;
window.copyHTML = copyHTML;
window.showMarkdownStats = showMarkdownStats;