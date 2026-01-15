'use client';

import { Comment } from '@/types/gallery';
import { formatDistanceToNow } from '@/lib/utils/date';

interface CommentListProps {
  comments: Comment[];
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--palette-muted)]">
        No comments yet. Be the first to share your thoughts!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  const isMentor = comment.authorRole === 'mentor';

  return (
    <article
      className={`relative p-4 rounded-lg ${
        isMentor
          ? 'bg-blue-50 border border-blue-200'
          : 'bg-gray-50 border border-gray-100'
      }`}
    >
      {isMentor && (
        <div className="absolute -top-2 left-4 bg-blue-600 text-white px-2 py-0.5 text-xs font-bold rounded">
          Mentor Feedback
        </div>
      )}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className={`font-bold text-sm ${isMentor ? 'text-blue-800' : 'text-gray-900'}`}>
            {comment.authorName}
          </span>
          {isMentor && (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
              Mentor
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500">
          {formatDistanceToNow(comment.createdAt)}
        </span>
      </div>
      <p className={`text-sm leading-relaxed ${isMentor ? 'text-blue-900' : 'text-gray-700'}`}>
        {comment.content}
      </p>
    </article>
  );
}
