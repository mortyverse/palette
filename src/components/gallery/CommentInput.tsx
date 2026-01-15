'use client';

import { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CommentInputProps {
  onSubmit: (content: string) => Promise<void>;
  disabled?: boolean;
}

export function CommentInput({ onSubmit, disabled }: CommentInputProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        placeholder="Leave a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={disabled || isSubmitting}
        className="flex-1 px-4 py-3 border border-[var(--palette-border)] rounded-lg text-[var(--palette-text)] focus:outline-none focus:border-[var(--palette-gold)] disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      <Button
        type="submit"
        variant="primary"
        disabled={disabled || isSubmitting || !content.trim()}
        className="flex items-center gap-2"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        Post
      </Button>
    </form>
  );
}
