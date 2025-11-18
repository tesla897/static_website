// Markdown to HTML Converter
document.addEventListener('DOMContentLoaded', function() {
    // Add sample markdown if input is empty
    const markdownInput = document.getElementById('markdown-input');
    if (markdownInput && !markdownInput.value.trim()) {
        loadSampleMarkdown();
    }
});

async function convertMarkdown() {
    const markdownInput = document.getElementById('markdown-input');
    const htmlOutput = document.getElementById('html-output');
    
    if (!markdownInput || !htmlOutput) return;
    
    const markdown = markdownInput.value.trim();
    
    if (!markdown) {
        showToast('Please enter some markdown content to convert', 'error');
        return;
    }
    
    showLoading();
    
    try {
        // Send request to server for markdown conversion
        const response = await fetch('/api/convert-markdown', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ markdown })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        htmlOutput.innerHTML = data.html;
        
        showToast('Markdown converted successfully!');
        
    } catch (error) {
        console.error('Conversion error:', error);
        
        // Fallback to client-side conversion
        htmlOutput.innerHTML = convertMarkdownClientSide(markdown);
        showToast('Converted using client-side parser');
    } finally {
        hideLoading();
    }
}

function convertMarkdownClientSide(markdown) {
    // Client-side markdown conversion as fallback
    return markdown
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
        .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
        .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        .replace(/~~(.*?)~~/gim, '<del>$1</del>')
        .replace(/`([^`]+)`/gim, '<code>$1</code>')
        .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
        .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank">$1</a>')
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;">')
        .replace(/^---$/gim, '<hr>')
        .replace(/\n\n/gim, '</p><p>')
        .replace(/^(?!<[hl]|<p|<li|<blockquote|<pre|<code|<img|<a)/gim, '<p>')
        .replace(/(<li>.*?<\/li>)/gims, '<ul>$1</ul>')
        .replace(/(<p><\/p>)/gim, '')
        .replace(/^(<p>.*<\/p>)$/gim, '$1');
}

function clearMarkdown() {
    const markdownInput = document.getElementById('markdown-input');
    const htmlOutput = document.getElementById('html-output');
    
    if (markdownInput) {
        markdownInput.value = '';
    }
    
    if (htmlOutput) {
        htmlOutput.innerHTML = '<p>Converted HTML will appear here...</p>';
    }
    
    showToast('Cleared markdown input and output');
}

function loadSampleMarkdown() {
    const sampleMarkdown = `# Markdown Converter Sample

This is a **sample markdown** text to demonstrate the conversion functionality.

## Features Supported

- **Bold** and *italic* text
- ~~Strikethrough~~ text
- \`Inline code\` and code blocks
- [Links](https://example.com)
- ![Images](https://via.placeholder.com/150)

### Code Example

\`\`\`javascript
function greetUser(name) {
    return \`Hello, \${name}!\`;
}

console.log(greetUser('World'));
\`\`\`

### Lists

#### Unordered List
- Item 1
- Item 2
- Item 3

#### Ordered List
1. First step
2. Second step
3. Third step

> **Important:** This is a blockquote that can contain important notes or quotes.

---

## Table Example

| Feature | Support | Notes |
|---------|---------|-------|
| Headers | ✅ Yes | All levels |
| Bold/Italic | ✅ Yes | Standard syntax |
| Code | ✅ Yes | Inline and blocks |
| Links | ✅ Yes | External links |
| Images | ✅ Yes | Responsive images |

### Blockquote

> "The best way to predict the future is to create it."
> 
> - Peter Drucker

**Ready to convert your own markdown?** Simply type your content in the input area and click "Convert to HTML"!`;
    
    const markdownInput = document.getElementById('markdown-input');
    if (markdownInput) {
        markdownInput.value = sampleMarkdown;
        showToast('Sample markdown loaded');
    }
}

function copyHtmlOutput() {
    const htmlOutput = document.getElementById('html-output');
    
    if (!htmlOutput) {
        showToast('No HTML output to copy', 'error');
        return;
    }
    
    const html = htmlOutput.innerHTML;
    
    // Create a temporary textarea for copying
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = html;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    tempTextarea.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        document.execCommand('copy');
        showToast('HTML copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy: ', err);
        showToast('Failed to copy HTML', 'error');
    }
    
    document.body.removeChild(tempTextarea);
}

// Character count for markdown input
function updateCharacterCount() {
    const markdownInput = document.getElementById('markdown-input');
    const htmlOutput = document.getElementById('html-output');
    
    if (!markdownInput || !htmlOutput) return;
    
    const markdown = markdownInput.value;
    const charCount = markdown.length;
    const wordCount = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
    
    // Update character count display if it exists
    let countDisplay = document.getElementById('character-count');
    if (!countDisplay) {
        countDisplay = document.createElement('div');
        countDisplay.id = 'character-count';
        countDisplay.className = 'character-count';
        markdownInput.parentNode.insertBefore(countDisplay, markdownInput.nextSibling);
    }
    
    countDisplay.innerHTML = `<small>${charCount} characters • ${wordCount} words</small>`;
    
    // Auto-convert if content is not empty
    if (markdown.trim() && markdown !== '') {
        // Debounce conversion to avoid too many requests
        clearTimeout(this.convertTimeout);
        this.convertTimeout = setTimeout(() => {
            convertMarkdown();
        }, 1000);
    }
}

// Add character count listener
document.addEventListener('DOMContentLoaded', function() {
    const markdownInput = document.getElementById('markdown-input');
    if (markdownInput) {
        markdownInput.addEventListener('input', updateCharacterCount);
        updateCharacterCount(); // Initial count
    }
});