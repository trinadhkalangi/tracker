import React, { useState } from 'react';
import { ExpertQA, ForumPost, ForumComment } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Modal from './common/Modal';
import Input from './common/Input';

interface CommunityProps {
  expertQAs: ExpertQA[];
  forumPosts: ForumPost[];
  addForumPost: (post: Omit<ForumPost, 'id' | 'comments'>) => void;
  addForumComment: (postId: string, comment: Omit<ForumComment, 'id'>) => void;
  currentUser: string;
}

const Community: React.FC<CommunityProps> = ({ expertQAs, forumPosts, addForumPost, addForumComment, currentUser }) => {
  const [openQA, setOpenQA] = useState<string | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.title.trim() && newPost.content.trim()) {
      addForumPost({
        ...newPost,
        author: currentUser, // In a real app, this would be the logged-in user's name
        date: new Date().toISOString(),
      });
      setIsPostModalOpen(false);
      setNewPost({ title: '', content: '' });
    }
  };
  
  const handleCommentSubmit = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (comment.trim()) {
      addForumComment(postId, {
        author: currentUser,
        date: new Date().toISOString(),
        content: comment,
      });
      setComment('');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Community & Support</h1>

      <Card>
        <h2 className="text-xl font-bold mb-4">Expert Q&A</h2>
        <div className="space-y-2">
          {expertQAs.map(qa => (
            <div key={qa.id} className="border-b border-gray-200 last:border-b-0">
              <button
                onClick={() => setOpenQA(openQA === qa.id ? null : qa.id)}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-pink-50/50 rounded-t-lg"
              >
                <span className="font-semibold text-gray-800">{qa.question}</span>
                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${openQA === qa.id ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openQA === qa.id && (
                <div className="p-4 bg-pink-50/30 rounded-b-lg">
                  <p className="text-gray-700">{qa.answer}</p>
                  <p className="text-sm text-right italic text-pink-600 mt-2">- {qa.expertName}, {qa.expertTitle}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
      
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Community Forum</h2>
          <Button onClick={() => setIsPostModalOpen(true)}>New Post</Button>
        </div>
        <div className="space-y-4">
          {forumPosts.map(post => (
            <div key={post.id} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg text-pink-800">{post.title}</h3>
              <p className="text-xs text-gray-500 mb-2">By {post.author} on {new Date(post.date).toLocaleDateString()}</p>
              <p className="text-gray-700">{post.content}</p>
              <button
                onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                className="text-sm font-semibold text-pink-600 hover:underline mt-2"
              >
                {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
              </button>

              {expandedPost === post.id && (
                <div className="mt-4 border-t pt-4 space-y-3">
                  {post.comments.map(c => (
                    <div key={c.id} className="bg-white p-3 rounded">
                      <p className="text-gray-700">{c.content}</p>
                      <p className="text-xs text-gray-400 text-right mt-1">- {c.author}, {new Date(c.date).toLocaleDateString()}</p>
                    </div>
                  ))}
                   <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="flex space-x-2 pt-2">
                       <input 
                         type="text" 
                         value={comment}
                         onChange={(e) => setComment(e.target.value)}
                         placeholder="Write a comment..."
                         className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                        />
                       <Button type="submit" variant="secondary">Reply</Button>
                   </form>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Modal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} title="Create a New Post">
        <form onSubmit={handlePostSubmit} className="space-y-4">
          <Input label="Title" type="text" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} required />
          <div>
            <label className="mb-1 font-semibold text-gray-700">Content</label>
            <textarea
              value={newPost.content}
              onChange={e => setNewPost({...newPost, content: e.target.value})}
              rows={5}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Share your thoughts or ask a question..."
            />
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit">Post</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Community;
