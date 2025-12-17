import React, { useMemo } from 'react';
import '../styles.css';

export default function StatusLine({ markdown }) {
  // Calculate word count and character count
  const { wordCount, charCount } = useMemo(() => {
    const text = markdown || '';
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = text.trim() === '' ? 0 : words.length;
    const charCount = text.length;
    
    return { wordCount, charCount };
  }, [markdown]);

  return (
    <div className="status-line">
      <div className="status-line-content">
        <div className="status-line-right">
          <span className="status-item">{wordCount} words</span>
          <span className="status-separator">|</span>
          <span className="status-item">{charCount} chars</span>
        </div>
      </div>
    </div>
  );
}

