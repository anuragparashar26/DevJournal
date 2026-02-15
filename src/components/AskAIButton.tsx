'use client';

import { useState } from 'react';

interface AskAIButtonProps {
  postTitle: string;
  postBody: string;
  postSlug: string;
}

export default function AskAIButton({ postTitle, postBody, postSlug }: AskAIButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAskAI = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('https://indexmind.onrender.com/upload-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: postBody,
          title: postTitle,
          slug: postSlug,
        }),
      });
      
      if (response.ok) {
        const knowledgeBaseUrl = `https://mindfetch.anuragparashar.tech/workspace?article=${encodeURIComponent(postSlug)}&title=${encodeURIComponent(postTitle)}`;
        window.open(knowledgeBaseUrl, '_blank', 'noopener,noreferrer');
      } else {
        alert('Failed to process article. Please try again.');
      }
    } catch (error) {
      alert('Failed to connect to AI service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="my-8 p-6 rounded-lg border"
      style={{
        background: 'var(--background, #fff)',
        borderColor: 'var(--accent-color-strong, #000000)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold" style={{color: 'var(--accent-color, #111111)'}}>
            Have questions about this article?
          </h3>
          <p className="text-sm" style={{color: 'var(--accent-color, #444)'}}>
            Chat with AI to get instant answers and deeper insights about this content.
          </p>
        </div>
        <button
          onClick={handleAskAI}
          disabled={isLoading}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--accent-color)',
            color: 'var(--background)',
            borderRadius: '0.5rem',
            border: '2px solid var(--accent-color-strong)',
            fontWeight: 500,
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s, box-shadow 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap',
          }}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>Ask AI</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
