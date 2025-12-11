import React, { useState, useRef, useEffect } from 'react';
import { getMarkdownHtml } from './utils/markdownParser';
import { handleBulletKeyDown } from './utils/bulletHandler';
import './styles.css';

function MarkdownEditor({ markdown, onChange }) {
  const [editorWidth, setEditorWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const textareaRef = useRef(null);
  const previewRef = useRef(null);
  const containerRef = useRef(null);
  const isScrollingRef = useRef(false);

  // Auto-increment bullet handler
  const onKeyDown = (e) => {
    handleBulletKeyDown(e, markdown, onChange);
  };

  // Resize handlers
  const startResize = (e) => {
    console.log('Resize started');
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const doResize = (e) => {
    if (!isResizing || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
    const clampedWidth = Math.max(25, Math.min(75, newWidth));
    
    console.log('Resizing...', clampedWidth);
    setEditorWidth(clampedWidth);
  };

  const stopResize = () => {
    console.log('Resize stopped');
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  // Auto-scroll preview pane to match editor scroll position
  const handleEditorScroll = () => {
    if (!textareaRef.current || !previewRef.current || isScrollingRef.current) {
      return;
    }

    const textarea = textareaRef.current;
    const preview = previewRef.current;

    // Calculate scroll ratio (handle edge case where content doesn't overflow)
    const textareaScrollable = textarea.scrollHeight - textarea.clientHeight;
    if (textareaScrollable <= 0) {
      // If editor doesn't scroll, keep preview at top
      if (preview.scrollTop !== 0) {
        isScrollingRef.current = true;
        preview.scrollTop = 0;
        requestAnimationFrame(() => {
          isScrollingRef.current = false;
        });
      }
      return;
    }

    const scrollRatio = textarea.scrollTop / textareaScrollable;
    
    // Apply scroll to preview
    const previewScrollable = preview.scrollHeight - preview.clientHeight;
    if (previewScrollable > 0) {
      const targetScroll = scrollRatio * previewScrollable;
      // Only update if there's a meaningful difference to avoid jitter
      if (Math.abs(preview.scrollTop - targetScroll) > 1) {
        isScrollingRef.current = true;
        preview.scrollTop = targetScroll;
        // Reset flag after scroll is applied
        requestAnimationFrame(() => {
          isScrollingRef.current = false;
        });
      }
    } else if (preview.scrollTop !== 0) {
      // If preview doesn't scroll but has scroll position, reset to top
      isScrollingRef.current = true;
      preview.scrollTop = 0;
      requestAnimationFrame(() => {
        isScrollingRef.current = false;
      });
    }
  };

  // Handle preview scroll to prevent feedback loop
  const handlePreviewScroll = () => {
    // This prevents the preview scroll from triggering editor scroll
    // We only want editor -> preview sync, not the reverse
  };

  // Event listeners
  useEffect(() => {
    if (isResizing) {
      const handleMouseMove = (e) => doResize(e);
      const handleMouseUp = () => stopResize();
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  // Set up scroll event listener for auto-scrolling
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.addEventListener('scroll', handleEditorScroll, { passive: true });
    
    return () => {
      textarea.removeEventListener('scroll', handleEditorScroll);
    };
  }, []); // Only set up once, not on markdown changes

  // Sync scroll position when markdown content changes (prevents reset on re-render)
  useEffect(() => {
    // Use double requestAnimationFrame to ensure DOM has fully updated after HTML render
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!textareaRef.current || !previewRef.current || isScrollingRef.current) return;
        
        const textarea = textareaRef.current;
        const preview = previewRef.current;

        // Calculate scroll ratio from editor
        const textareaScrollable = textarea.scrollHeight - textarea.clientHeight;
        if (textareaScrollable <= 0) {
          // If editor doesn't scroll, keep preview at top
          if (preview.scrollTop !== 0) {
            isScrollingRef.current = true;
            preview.scrollTop = 0;
            requestAnimationFrame(() => {
              isScrollingRef.current = false;
            });
          }
          return;
        }

        const scrollRatio = textarea.scrollTop / textareaScrollable;
        
        // Apply scroll to preview after content update
        const previewScrollable = preview.scrollHeight - preview.clientHeight;
        if (previewScrollable > 0) {
          const targetScroll = scrollRatio * previewScrollable;
          // Always sync after content update to prevent reset
          isScrollingRef.current = true;
          preview.scrollTop = targetScroll;
          // Reset flag after scroll is applied
          requestAnimationFrame(() => {
            isScrollingRef.current = false;
          });
        } else if (preview.scrollTop !== 0) {
          // If preview doesn't scroll but has scroll position, reset to top
          isScrollingRef.current = true;
          preview.scrollTop = 0;
          requestAnimationFrame(() => {
            isScrollingRef.current = false;
          });
        }
      });
    });
  }, [markdown]); // Sync when markdown changes

  // Get markdown HTML
  const html = getMarkdownHtml(markdown);

  return (
      <div 
        ref={containerRef}
        className="markdown-editor-container"
        style={{ 
          display: 'flex', 
          flex: 1, 
          minHeight: 0,
          position: 'relative',
          width: '100%'
        }}
      >
        <div style={{ 
          width: `${editorWidth}%`,
          minWidth: '200px',
          maxWidth: '75%'
        }}>
          <textarea
            className="markdown-input"
            value={markdown}
            onChange={e => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            ref={textareaRef}
            style={{ 
              width: '100%',
              height: '100%',
              resize: 'none',
              border: 'none',
              outline: 'none'
            }}
           
          />
        </div>
        
        <div 
          className="resize-handle"
          onMouseDown={startResize}
        />
        
        <div style={{ 
          width: `${100 - editorWidth}%`,
          minWidth: '200px',
          maxWidth: '75%'
        }}>
          <div 
            ref={previewRef}
            className="markdown-preview" 
            dangerouslySetInnerHTML={{ __html: html }}
            onScroll={handlePreviewScroll}
            style={{ 
              width: '100%',
              height: '100%'
            }}
          />
        </div>
      </div>
  );
}

export default MarkdownEditor; 