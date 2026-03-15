import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaImage, FaVideo, FaRegCommentDots, FaRegThumbsUp, FaShare, FaTimes } from "react-icons/fa";
import { API_URLS } from "../../api";

const Feed = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [selectedMedia, setSelectedMedia] = useState(null); // { url: base64, type: 'image'|'video' }
  const [currentUser, setCurrentUser] = useState(null);
  
  // Commenting State
  const [openComments, setOpenComments] = useState({}); // { postId: boolean }
  const [commentInputs, setCommentInputs] = useState({}); // { postId: string }
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setCurrentUser(JSON.parse(storedUser));
    fetchFeed();
  }, [navigate]);

  const fetchFeed = async () => {
    try {
      const res = await fetch(API_URLS.posts.feed);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type.split('/')[0]; // 'image' or 'video'
    
    // Size check (e.g., 20MB limit for client side)
    if (file.size > 20 * 1024 * 1024) {
      alert("File is too large! Please upload a file smaller than 20MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedMedia({
        url: reader.result,
        type: fileType === 'video' ? 'video' : 'image'
      });
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = (acceptType) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = acceptType;
      fileInputRef.current.click();
    }
  };

  const clearMedia = () => {
    setSelectedMedia(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim() && !selectedMedia) return;

    try {
      const mediaArray = selectedMedia ? [selectedMedia] : [];
      
      const res = await fetch(API_URLS.posts.base, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: currentUser.id || currentUser._id,
          content: newPost,
          media: mediaArray
        })
      });

      if (res.ok) {
        setNewPost("");
        clearMedia();
        fetchFeed(); // refresh feed
      } else {
        alert("Failed to create post. File might be too large.");
      }
    } catch (err) {
      console.error("Posting error: ", err);
      alert("An error occurred while posting.");
    }
  };

  const likePost = async (postId) => {
    try {
      await fetch(API_URLS.posts.like(postId), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id || currentUser._id })
      });
      fetchFeed();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCommentSection = (postId) => {
    setOpenComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentChange = (postId, text) => {
    setCommentInputs(prev => ({ ...prev, [postId]: text }));
  };

  const submitComment = async (postId) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    try {
      const res = await fetch(API_URLS.posts.comment(postId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id || currentUser._id, text })
      });
      if (res.ok) {
        setCommentInputs(prev => ({ ...prev, [postId]: "" }));
        fetchFeed(); // Refresh the feed to get new comments
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = (postId) => {
    const url = `${window.location.origin}/feed`; 
    if (navigator.share) {
      navigator.share({
        title: 'Check out this post on Jam!',
        text: 'I found this cool post on Jam.',
        url: url,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      alert("Post link copied to clipboard!");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`${API_URLS.posts.base}/${postId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id || currentUser._id })
      });

      if (res.ok) {
        fetchFeed();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete post");
      }
    } catch (err) {
      console.error("Delete error: ", err);
      alert("An error occurred while deleting.");
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FB] py-10 px-4 flex justify-center">
      <div className="w-full max-w-xl flex flex-col gap-6">

        {/* CREATE POST BOX */}
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 p-5 sm:p-6 hover:shadow-xl hover:shadow-purple-50 transition-all duration-300 group">
          <div className="flex gap-5">
            <img 
              src={currentUser.profilePhoto || "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"} 
              alt="Profile" 
              className="w-12 h-12 rounded-xl object-cover ring-4 ring-purple-50 group-hover:ring-purple-100 transition-all"
            />
            <div className="flex-1">
              <textarea 
                className="w-full border-none p-2 outline-none resize-none text-gray-800 text-base placeholder-gray-400 bg-transparent font-medium"
                rows="2"
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              ></textarea>
              
              {selectedMedia && (
                <div className="relative mt-4 rounded-3xl overflow-hidden bg-black max-h-[500px] flex items-center justify-center shadow-2xl border-4 border-white">
                  <button 
                    onClick={clearMedia}
                    className="absolute top-4 right-4 bg-gray-900/80 text-white p-2.5 rounded-full hover:bg-black transition-all z-10 shadow-lg"
                  >
                    <FaTimes />
                  </button>
                  {selectedMedia.type === 'video' ? (
                    <video src={selectedMedia.url} controls className="max-h-[500px] w-full object-contain" />
                  ) : (
                    <img src={selectedMedia.url} alt="Preview" className="max-h-[500px] w-full object-contain" />
                  )}
                </div>
              )}
            </div>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />
            
          <div className="flex justify-between items-center mt-6 pt-5 border-t border-gray-50">
            <div className="flex gap-2">
              <button 
                onClick={() => triggerFileInput("image/*")}
                className="group/btn flex items-center gap-2.5 px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-all"
              >
                <div className="bg-blue-50 p-2 rounded-lg group-hover/btn:bg-blue-100 transition-colors">
                  <FaImage className="text-blue-500 text-lg" />
                </div>
                <span className="hidden sm:inline font-black text-[10px] uppercase tracking-widest text-gray-400 group-hover/btn:text-blue-600">Photo</span>
              </button>
              <button 
                onClick={() => triggerFileInput("video/*")}
                className="group/btn flex items-center gap-2.5 px-4 py-2.5 rounded-xl hover:bg-pink-50 transition-all"
              >
                <div className="bg-pink-50 p-2 rounded-lg group-hover/btn:bg-pink-100 transition-colors">
                  <FaVideo className="text-pink-500 text-lg" />
                </div>
                <span className="hidden sm:inline font-black text-[10px] uppercase tracking-widest text-gray-400 group-hover/btn:text-pink-600">Video</span>
              </button>
            </div>
            
            <button 
              onClick={handlePostSubmit}
              disabled={!newPost.trim() && !selectedMedia}
              className={`px-6 py-2.5 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl transition-all ${(!newPost.trim() && !selectedMedia) ? 'bg-gray-100 text-gray-300' : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-100 transform active:scale-95 hover:scale-105'}`}
            >
              Share
            </button>
          </div>
        </div>

        {/* FEED POSTS */}
        <div className="flex flex-col gap-6 mt-2 pb-20">
          {posts.map(post => (
            <article key={post._id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group/card hover:shadow-2xl hover:shadow-purple-50 transition-all duration-500">
              {/* Post Header */}
              <div className="p-4 px-5 flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <Link to={`/profile/${post.author._id}`} className="relative group/avatar">
                    <img 
                      src={post.author.profilePhoto || "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"} 
                      alt={post.author.name} 
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 group-hover/avatar:ring-purple-200 transition-all shadow-sm"
                    />
                  </Link>
                  <div className="flex flex-col">
                    <Link to={`/profile/${post.author._id}`} className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors text-sm leading-tight">
                      {post.author.name} {post.author.lastname}
                    </Link>
                    <span className="text-gray-400 text-[10px] font-medium mt-0.5 flex items-center gap-1">
                      {new Date(post.createdAt).toLocaleDateString(undefined, { month:'short', day:'numeric' })}
                      <span className="w-0.5 h-0.5 bg-gray-300 rounded-full"></span>
                      Musician
                    </span>
                  </div>
                </div>
                {(post.author._id === (currentUser.id || currentUser._id) || post.author === (currentUser.id || currentUser._id)) && (
                  <div className="relative group">
                    <button className="text-gray-400 hover:text-purple-600 p-2 transition-all hover:bg-purple-50 rounded-lg">
                      <span className="text-xl">⋯</span>
                    </button>
                    <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1 hidden group-hover:block z-50 animate-in fade-in zoom-in duration-200">
                      <button 
                        onClick={() => handleDeletePost(post._id)}
                        className="w-full text-left px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <FaTimes className="text-xs" /> Delete Post
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Post Content (Below Header, Above Media - LinkedIn Style) */}
              {post.content && (
                <div className="px-5 pb-3">
                  <p className="text-gray-800 text-[14px] leading-relaxed font-normal whitespace-pre-wrap">{post.content}</p>
                </div>
              )}

              {/* Post Media (Instagram Style Rendering) */}
              {post.media && post.media.length > 0 && (
                <div className="bg-gray-50 border-y border-gray-50 overflow-hidden relative group/media">
                  {post.media[0].type === 'video' ? (
                    <video src={post.media[0].url} controls className="w-full h-auto max-h-[600px] object-contain" />
                  ) : (
                    <img src={post.media[0].url} alt="Post media" className="w-full h-auto max-h-[600px] object-contain mx-auto" />
                  )}
                </div>
              )}

              {/* Interaction Bar (LinkedIn/Instagram Hybrid) */}
              <div className="px-4 py-2 flex items-center border-b border-gray-50/50">
                <div className="flex flex-1 gap-1">
                  <button 
                    onClick={() => likePost(post._id)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all group/btn ${post.likes?.includes(currentUser.id || currentUser._id) ? 'text-red-500' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <FaRegThumbsUp className={`text-xl ${post.likes?.includes(currentUser.id || currentUser._id) ? 'fill-current' : ''}`} />
                    <span className="text-[13px] font-medium">{post.likes?.length || ""}</span>
                  </button>
                  <button 
                    onClick={() => toggleCommentSection(post._id)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    <FaRegCommentDots className="text-xl" />
                    <span className="text-[13px] font-medium">{post.comments?.length || ""}</span>
                  </button>
                  <button 
                    onClick={() => handleShare(post._id)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    <FaShare className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Comment Section (Collapsible) */}
              {openComments[post._id] && (
                <div className="p-8 pt-0 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="bg-[#F8F9FB] rounded-[2rem] p-6">
                    {/* Display existing comments */}
                    {post.comments && post.comments.length > 0 && (
                      <div className="max-h-80 overflow-y-auto space-y-4 mb-4 pr-1 custom-scrollbar">
                        {post.comments.map((c, i) => (
                          <div key={i} className="flex gap-3 group/comment relative">
                            {/* Connection Line */}
                            {i !== post.comments.length - 1 && (
                              <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-100/50" />
                            )}
                            <img 
                              src={c.user?.profilePhoto || "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"} 
                              alt={c.user?.name || "User"} 
                              className="w-8 h-8 rounded-full mt-0.5 object-cover ring-2 ring-white shadow-sm z-10"
                            />
                            <div className="flex-1">
                              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100/50">
                                <span className="font-bold text-[13px] text-gray-900 mb-0.5 block">{c.user?.name} {c.user?.lastname}</span>
                                <p className="text-gray-700 text-[13.5px] leading-relaxed">{c.text}</p>
                              </div>
                              <div className="flex gap-4 mt-1.5 px-1 text-[10px] font-bold text-gray-400">
                                <button className="hover:text-purple-600 transition">Like</button>
                                <button className="hover:text-purple-600 transition">Reply</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add a comment input */}
                    <div className="flex gap-3 items-center pt-2">
                      <img 
                        src={currentUser?.profilePhoto || "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"} 
                        alt="Current User" 
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-md flex-shrink-0"
                      />
                      <div className="flex-1 relative group/input">
                        <input 
                          type="text"
                          placeholder="Add a comment..."
                          className="w-full bg-white border border-gray-200 rounded-full px-5 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-600 transition-all pr-20 shadow-sm"
                          value={commentInputs[post._id] || ""}
                          onChange={(e) => handleCommentChange(post._id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') submitComment(post._id);
                          }}
                        />
                        <button 
                          onClick={() => submitComment(post._id)}
                          disabled={!commentInputs[post._id]?.trim()}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-purple-600 text-white font-bold text-[11px] px-4 py-1.5 rounded-full hover:bg-purple-700 disabled:opacity-30 disabled:grayscale transition-all shadow-md"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </article>
          ))}
          
          {posts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 shadow-inner">
              <div className="text-6xl mb-6 grayscale opacity-20">📭</div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Your feed is quiet</h3>
              <p className="mt-2 text-gray-400 font-medium italic">Follow more artists to see what they're up to!</p>
              <Link to="/discover" className="mt-8 inline-block bg-purple-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-100 hover:scale-105 transition-transform">Explore Artists</Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Feed;
