'use client';


import { useState, useEffect } from 'react';

interface AskAIBubbleProps {
  postTitle: string;
  postBody: string;
  postSlug: string;
}


export default function AskAIBubble({ postTitle, postBody, postSlug }: AskAIBubbleProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const [showToolkit, setShowToolkit] = useState(false);

  useEffect(() => {
    if (isDismissed) return;
    let showTimeout: NodeJS.Timeout | null = null;
    let hideTimeout: NodeJS.Timeout | null = null;
    let interval: NodeJS.Timeout | null = null;

    const showAndHide = () => {
      setShowToolkit(true);
      hideTimeout = setTimeout(() => {
        setShowToolkit(false);
      }, 10000);
    };

    showTimeout = setTimeout(() => {
      showAndHide();
      interval = setInterval(() => {
        showAndHide();
      }, 60000);
    }, 10000);

    return () => {
      if (showTimeout) clearTimeout(showTimeout);
      if (hideTimeout) clearTimeout(hideTimeout);
      if (interval) clearInterval(interval);
      setShowToolkit(false);
    };
  }, [isDismissed]);

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
        const knowledgeBaseUrl = `https://indexmind.onrender.com/workspace?article=${encodeURIComponent(postSlug)}&title=${encodeURIComponent(postTitle)}`;
        window.open(knowledgeBaseUrl, '_blank', 'noopener,noreferrer');
        setIsDismissed(true);
      } else {
        alert('Failed to process article. Please try again.');
      }
    } catch (error) {
      alert('Failed to connect to AI service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleDismiss = () => {
    setIsDismissed(true);
    setShowToolkit(false);
  };

  if (isDismissed) return null;

  return (
    <>
      <style>{`
        .ask-ai-bubble {
          position: fixed;
          z-index: 50;
          right: 2rem;
          bottom: 6.5rem;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
        }
        .ask-ai-popup {
          background: var(--background);
          color: var(--accent-color);
          border: 1px solid var(--accent-color-strong);
        }
        .dark .ask-ai-popup {
          background: var(--background);
          color: var(--accent-color);
          border: 1px solid var(--accent-color-strong);
        }
        @media (max-width: 768px) {
          .ask-ai-bubble {
            left: 2rem;
            right: auto;
            bottom: 2rem;
          }
          .ask-ai-popup {
            left: 66px !important;
            right: auto !important;
            padding: 6px 12px !important;
            font-size: 12px !important;
            max-width: 200px !important;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-50%) translateX(10px); }
          to { opacity: 1; transform: translateY(-50%) translateX(0); }
        }
      `}</style>
      <div className="ask-ai-bubble">
      {/* Toolkit popup absolutely positioned above bubble */}
      {(showToolkit || isLoading) && (
        <div
          className={`ask-ai-popup${typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? ' dark' : ''}`}
          style={{
            position: 'absolute',
            right: 66,
            top: '50%',
            transform: 'translateY(-50%)',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            padding: '8px 16px',
            fontSize: 14,
            fontWeight: 500,
            whiteSpace: 'nowrap',
            zIndex: 100,
            animation: isLoading ? 'none' : 'fadeIn 0.3s ease-out',
            maxWidth: 'min(90vw, 320px)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            boxSizing: 'border-box',
          }}
        >
          {isLoading ? '⏳ Hold on...' : '💡 Ask AI about this article!'}
        </div>
      )}
      <button
        onClick={handleAskAI}
        disabled={isLoading}
        aria-label="Ask AI about this article"
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--accent-color)',
          color: 'var(--background)',
          border: '2px solid var(--accent-color-strong)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.7 : 1,
          transition: 'background 0.2s, box-shadow 0.2s',
          position: 'relative',
        }}
        onContextMenu={e => { e.preventDefault(); handleDismiss(); }}
        title="Ask AI about this article (right-click to dismiss)"
      >
        {isLoading ? (
          <svg className="animate-spin" style={{width: 28, height: 28}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg style={{width: 28, height: 28}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
    </>
  );
}
