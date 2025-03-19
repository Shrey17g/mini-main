import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, X, Camera, Trash2, Image, Send, Plus } from 'lucide-react';
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
  const userId = localStorage.getItem('adminId'); // Will work for admin ID too

  const fetchPosts = async () => {
    try {
      const response = await fetch(`http://localhost/mini%20main/project/src/backend/get_posts.php?user_id=${userId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      // Keep showing initial posts on error
      setPosts(initialPosts);
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const response = await fetch('http://localhost/mini%20main/project/src/backend/delete_post.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId })
      });
      const data = await response.json();
      if (data.success) {
        // Refresh posts after deletion
        fetchPosts();
      }
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const fetchComments = async (postId: number) => {
    try {
      const response = await fetch(`http://localhost/mini%20main/project/src/backend/get_comments.php?postId=${postId}`);
      const data = await response.json();
      if (data.success) {
        setPostComments(prev => ({
          ...prev,
          [postId]: data.comments
        }));
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
    // Check if we have an active post and fetch its comments
    if (activePost) {
      fetchComments(activePost.id);
    }
  };

  const handleDeleteComment = async (postId: number, commentId: number) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      const response = await fetch('http://localhost/mini%20main/project/src/backend/delete_comment.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: commentId })
      });
      const data = await response.json();
      if (data.success) {
        // Fetch both comments and posts to update comment count
        await Promise.all([
          fetchComments(postId),
          fetchPosts()
        ]);
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !activePost) return;
  
    try {
      const response = await fetch('http://localhost/mini%20main/project/src/backend/add_comment.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: activePost.id,
          user_id: userId,
          content: newComment
        })
      });
  
      const data = await response.json();
      if (data.success) {
        // Fetch both comments and posts to update comment count
        await Promise.all([
          fetchComments(activePost.id),
          fetchPosts()
        ]);
        setNewComment('');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleLike = async (postId: number) => {
    // Optimistically update UI
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked 
            }
          : post
      )
    );
  
    try {
      const response = await fetch('http://localhost/mini%20main/project/src/backend/toggle_like.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
          user_id: userId
        })
      });
  
      const data = await response.json();
      if (!data.success) {
        // Revert changes if request failed
        fetchPosts();
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      // Revert changes on error
      fetchPosts();
    }
  };

  const handleComment = async (post: Post) => {
    setActivePost(post);
    setShowComments(true);
    try {
      const response = await fetch(`http://localhost/mini%20main/project/src/backend/get_comments.php?postId=${post.id}`);
      const data = await response.json();
      if (data.success) {
        setPostComments(prev => ({
          ...prev,
          [post.id]: data.comments
        }));
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
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

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.content.trim()) return;

    try {
      const formData = new FormData();
      formData.append('content', newPost.content);
      formData.append('user_id', userId || '0');
      
      // Changed image handling
      if (fileInputRef.current?.files?.[0]) {
        formData.append('image', fileInputRef.current.files[0]);
      }

      const response = await fetch('http://localhost/mini%20main/project/src/backend/add_post.php', {
        method: 'POST',
        body: formData // Send as FormData instead of JSON
      });

      const data = await response.json();
      if (data.success) {
        fetchPosts();
        setNewPost({ content: '', image: '' });
        setPreviewImage(null);
        setShowNewPostModal(false);
      }
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  // Replace the existing useEffect with a simpler version
  useEffect(() => {
    fetchPosts();
  }, []); // Only fetch once on mount

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Create Post Button - Fixed at top */}
        <div className="sticky top-0 z-10 bg-gray-50 pb-4">
          <button
            onClick={() => setShowNewPostModal(true)}
            className="w-full bg-white rounded-lg shadow-md p-6 text-left text-gray-500 hover:bg-gray-50 transition duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <Camera size={24} />
              </div>
              <span className="text-lg">Share your pet story...</span>
            </div>
          </button>
        </div>

        {/* Scrollable Posts Container */}
        <div className="space-y-8 overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">  {/* Increased padding */}
                <div className="flex items-center justify-between mb-6">  {/* Increased margin */}
                  <div className="flex items-center gap-4">  {/* Increased gap */}
                    <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full" /> {/* Larger avatar */}
                    <div>
                      <h3 className="text-lg font-semibold">{post.author}</h3>  {/* Larger text */}
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
                <p className="mb-6 text-lg">{post.content}</p>  {/* Larger text and margin */}
                {post.image && (
                  <img 
                    src={post.image} 
                    alt="" 
                    className="w-full h-[500px] object-cover rounded-lg mb-6"
                  />
                )}
                <div className="flex items-center gap-6 text-gray-600">
                  <button
                    className={`flex items-center gap-2 hover:text-indigo-600 transition-colors ${
                      post.isLiked ? 'text-indigo-600' : ''
                    }`}
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart size={20} fill={post.isLiked ? 'currentColor' : 'none'} />
                    <span>{post.likes}</span>
                  </button>
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
            <div className="bg-white rounded-xl w-[500px] overflow-hidden">
              {/* Header - Fixed */}
              <div className="p-4 border-b flex justify-between items-center bg-white sticky top-0 z-10">
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

              {/* Wrap entire content in form */}
              <form onSubmit={handleCreatePost}>
                {/* Scrollable Container */}
                <div className="h-[300px] overflow-y-auto overflow-x-hidden p-6">
                  <div className="space-y-4">
                    <textarea
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      placeholder="Share your pet story..."
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        h-[150px] min-h-[150px] max-h-[150px] overflow-y-scroll resize-none scrollbar scrollbar-thumb-gray-400 scrollbar-track-gray-100"
                      required
                    />
                    {previewImage && (
                      <div className="relative">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-[200px] object-cover rounded-lg"
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
                  </div>
                </div>

                {/* Footer Controls - Fixed */}
                <div className="p-4 border-t bg-white sticky bottom-0">
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
      <button
        onClick={() => setShowNewPostModal(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}