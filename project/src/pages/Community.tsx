import React, { useState, useRef } from 'react';
import { Heart, MessageCircle, Share2, X, Camera, Trash2, Image, Send } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

interface Post {
  id: number;
  author: string;
  avatar: string;
  content: string;
  image: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  timestamp: string;
}

interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
}

const initialPosts: Post[] = [
  {
    id: 1,
    author: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
    content: "Meet Luna, our newest family member! Adopted her last week and she's already brought so much joy to our home. 🐾❤️",
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80',
    likes: 124,
    comments: 18,
    isLiked: false,
    timestamp: '2 hours ago'
  },
  {
    id: 2,
    author: 'Mike Peterson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80',
    content: 'One year ago today, we rescued Max. Swipe to see his amazing transformation! #AdoptDontShop',
    image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&q=80',
    likes: 89,
    comments: 12,
    isLiked: false,
    timestamp: '3 hours ago'
  }
];

const sampleComments: Comment[] = [
  {
    id: 1,
    author: 'Emily Chen',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80',
    content: 'Such a beautiful dog! Congratulations on your new family member! 🎉',
    timestamp: '1 hour ago'
  },
  {
    id: 2,
    author: 'John Smith',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80',
    content: 'Luna looks so happy! Wishing you many wonderful memories together ❤️',
    timestamp: '2 hours ago'
  }
];

export default function Community() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [showComments, setShowComments] = useState(false);
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState('');
  const [postComments, setPostComments] = useState<{ [key: number]: Comment[] }>({
    1: sampleComments,
    2: []
  });
  const [newPost, setNewPost] = useState({
    content: '',
    image: ''
  });
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const userType = localStorage.getItem('userType');
  const isAdmin = userType === 'admin';

  const handleDeletePost = (postId: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(post => post.id !== postId));
      setPostComments(prev => {
        const newComments = { ...prev };
        delete newComments[postId];
        return newComments;
      });
    }
  };

  const handleDeleteComment = (postId: number, commentId: number) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      setPostComments(prev => ({
        ...prev,
        [postId]: prev[postId].filter(comment => comment.id !== commentId)
      }));
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return { ...post, comments: post.comments - 1 };
        }
        return post;
      }));
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !activePost) return;

    const newCommentObj: Comment = {
      id: Date.now(),
      author: isAdmin ? 'Admin' : userType === 'center' ? 'Adoption Center' : 'Pet Parent',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
      content: newComment,
      timestamp: 'Just now'
    };

    setPostComments(prev => ({
      ...prev,
      [activePost.id]: [newCommentObj, ...(prev[activePost.id] || [])]
    }));

    setPosts(posts.map(post => {
      if (post.id === activePost.id) {
        return { ...post, comments: post.comments + 1 };
      }
      return post;
    }));

    setNewComment('');
  };

  const handleLike = (postId: number) => {
    if (!isAdmin) {
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked
          };
        }
        return post;
      }));
    }
  };

  const handleComment = (post: Post) => {
    setActivePost(post);
    setShowComments(true);
    setTimeout(() => {
      commentInputRef.current?.focus();
    }, 100);
  };

  const handleShare = (post: Post) => {
    if (!isAdmin) {
      alert('Share functionality coming soon!');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.content.trim()) return;

    const newPostObj: Post = {
      id: Date.now(),
      author: userType === 'center' ? 'Adoption Center' : 'Pet Parent',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
      content: newPost.content,
      image: previewImage || '',
      likes: 0,
      comments: 0,
      isLiked: false,
      timestamp: 'Just now'
    };

    setPosts([newPostObj, ...posts]);
    setNewPost({ content: '', image: '' });
    setPreviewImage(null);
    setShowNewPostModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Create Post Button */}
        {!isAdmin && (
          <button
            onClick={() => setShowNewPostModal(true)}
            className="w-full bg-white rounded-lg shadow-md p-4 mb-6 text-left text-gray-500 hover:bg-gray-50 transition duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <Camera size={20} />
              </div>
              <span>Share your pet story...</span>
            </div>
          </button>
        )}

        {/* Posts List */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full" />
                    <div>
                      <h3 className="font-semibold">{post.author}</h3>
                      <p className="text-sm text-gray-500">{post.timestamp}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-500 hover:text-red-600"
                      title="Delete post"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
                <p className="mb-4">{post.content}</p>
                {post.image && (
                  <img src={post.image} alt="" className="w-full h-64 object-cover rounded-lg mb-4" />
                )}
                <div className="flex items-center gap-6 text-gray-600">
                  {isAdmin ? (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Heart size={20} />
                      <span>{post.likes} likes</span>
                    </div>
                  ) : (
                    <button
                      className={`flex items-center gap-2 hover:text-indigo-600 transition-colors ${
                        post.isLiked ? 'text-indigo-600' : ''
                      }`}
                      onClick={() => handleLike(post.id)}
                    >
                      <Heart size={20} fill={post.isLiked ? 'currentColor' : 'none'} />
                      <span>{post.likes}</span>
                    </button>
                  )}
                  <button
                    className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
                    onClick={() => handleComment(post)}
                  >
                    <MessageCircle size={20} />
                    <span>{post.comments}</span>
                  </button>
                  {!isAdmin && (
                    <button
                      className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
                      onClick={() => handleShare(post)}
                    >
                      <Share2 size={20} />
                      Share
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Post Modal */}
        {showNewPostModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-xl font-semibold">Create Post</h3>
                <button
                  onClick={() => {
                    setShowNewPostModal(false);
                    setNewPost({ content: '', image: '' });
                    setPreviewImage(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleCreatePost} className="p-6">
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Share your pet story..."
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
                  rows={4}
                  required
                />
                {previewImage && (
                  <div className="relative mb-4">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setPreviewImage(null)}
                      className="absolute top-2 right-2 bg-gray-800 text-white p-1 rounded-full hover:bg-gray-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200"
                  >
                    <Image size={20} />
                    Add Photo
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center justify-center gap-2"
                  >
                    <Send size={20} />
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Comments Modal */}
        {showComments && activePost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-xl font-semibold">Comments</h3>
                <button
                  onClick={() => setShowComments(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[60vh]">
                {(postComments[activePost.id] || []).map((comment) => (
                  <div key={comment.id} className="flex gap-3 mb-4">
                    <img
                      src={comment.avatar}
                      alt={comment.author}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{comment.author}</span>
                          <span className="text-sm text-gray-500">{comment.timestamp}</span>
                        </div>
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteComment(activePost.id, comment.id)}
                            className="text-red-500 hover:text-red-600"
                            title="Delete comment"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t">
                <form onSubmit={handleSubmitComment} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    ref={commentInputRef}
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
                  >
                    Post
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}