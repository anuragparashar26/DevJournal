"use client";

import { useState, useEffect } from 'react';

interface Comment {
  _id: string;
  author: string;
  content: string;
  timestamp: string;
}

interface CommentsAndUpvotesProps {
  postSlug: string;
}

export default function CommentsAndUpvotes({ postSlug }: CommentsAndUpvotesProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [message, setMessage] = useState('');

  // Comment form state
  const [formData, setFormData] = useState({
    author: '',
    email: '',
    content: '',
  });

  useEffect(() => {
    fetchComments();
    fetchUpvotes();
  }, [postSlug]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?postSlug=${postSlug}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpvotes = async () => {
    try {
      const response = await fetch(`/api/upvotes?postSlug=${postSlug}`);
      if (response.ok) {
        const data = await response.json();
        setUpvoteCount(data.upvoteCount || 0);
        setHasUpvoted(data.hasUpvoted || false);
      }
    } catch (error) {
      console.error('Failed to fetch upvotes:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postSlug, ...formData }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setFormData({ author: '', email: '', content: '' });
        setShowCommentForm(false);
      } else {
        setMessage(data.error || 'Failed to submit comment');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async () => {
    if (hasUpvoted) return;

    try {
      const response = await fetch('/api/upvotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postSlug }),
      });

      const data = await response.json();

      if (response.ok) {
        setUpvoteCount(data.upvoteCount);
        setHasUpvoted(true);
      } else {
        setMessage(data.error || 'Failed to upvote');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-300 rounded w-32 mb-4"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 space-y-6 w-full max-w-none overflow-x-hidden">
      {/* Upvote */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleUpvote}
          disabled={hasUpvoted}
          className={`text-sm px-3 py-1 rounded font-medium border border-[var(--accent)] transition-colors ${
            hasUpvoted
              ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] cursor-default'
              : 'bg-transparent text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white'
          }`}
        >
          {hasUpvoted ? `▲ Upvoted ${upvoteCount}` : `▲ Upvote ${upvoteCount}`}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className="p-3 text-sm bg-[var(--accent)] text-white rounded break-words">
          {message}
        </div>
      )}

      {/* Comments Section */}
      <div className="w-full overflow-x-auto">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="font-medium">Comments ({comments.length})</h3>
          {!showCommentForm && (
            <button
              onClick={() => setShowCommentForm(true)}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Add comment
            </button>
          )}
        </div>

        {/* Comment Form */}
        {showCommentForm && (
          <form onSubmit={handleSubmitComment} className="mb-6 p-4 bg-[var(--background)] dark:bg-[var(--background)] rounded w-full border border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-[var(--background)] dark:bg-[var(--background)]"
                />
                <input
                  type="email"
                  placeholder="Email (won't be posted)"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-[var(--background)] dark:bg-[var(--background)]"
                />
              </div>
              <textarea
                placeholder="Your comment..."
                required
                rows={3}
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-[var(--background)] dark:bg-[var(--background)] resize-none"
              />
              <div className="flex gap-2 flex-wrap">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium rounded bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCommentForm(false)}
                  className="px-4 py-2 text-sm font-medium rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Comments List */}
        {comments.length > 0 ? (
          <div className="space-y-4 w-full">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 w-full"
              >
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <span className="font-medium text-sm">{comment.author}</span>
                    <span className="text-xs text-gray-500">
                      {formatPostedTime(comment.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words overflow-wrap-anywhere">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}

function formatPostedTime(timestamp: string): string {
  const now = new Date();
  const posted = new Date(timestamp);
  const diff = Math.floor((now.getTime() - posted.getTime()) / 1000);

  if (isNaN(diff) || diff < 0) return posted.toLocaleString();

  let relative: string;
  if (diff < 60) relative = "just now";
  else if (diff < 3600) relative = `${Math.floor(diff / 60)} minute${Math.floor(diff / 60) === 1 ? "" : "s"} ago`;
  else if (diff < 86400) relative = `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) === 1 ? "" : "s"} ago`;
  else if (diff < 2592000) relative = `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) === 1 ? "" : "s"} ago`;
  else relative = posted.toLocaleDateString();

  return `${relative} (${posted.toLocaleString()})`;
}
