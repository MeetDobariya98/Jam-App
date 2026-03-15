import { useState, useEffect, useRef } from "react";
import { API_URLS } from "../../api";
import { useNavigate } from "react-router-dom";
import { 
  FaUsers, FaUserPlus, FaUserCheck, FaArrowLeft, FaShieldAlt, 
  FaImage, FaVideo, FaRegCommentDots, FaRegThumbsUp, FaShare, FaTimes 
} from "react-icons/fa";

const Community = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const currentUserId = storedUser.id || storedUser._id;

  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newComName, setNewComName] = useState("");
  const [newComDesc, setNewComDesc] = useState("");
  const [connectionStatuses, setConnectionStatuses] = useState({});

  // Feed State
  const [activeTab, setActiveTab] = useState("members"); // "members" or "feed"
  const [communityPosts, setCommunityPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [openComments, setOpenComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const fileInputRef = useRef(null);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URLS.communities.base);
      const data = await res.json();
      if (Array.isArray(data)) setCommunities(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunityPosts = async (comId) => {
    try {
      const res = await fetch(API_URLS.communities.getPosts(comId));
      const data = await res.json();
      if (Array.isArray(data)) setCommunityPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  useEffect(() => {
    if (selectedCommunity && activeTab === "feed") {
      fetchCommunityPosts(selectedCommunity._id);
    }
  }, [selectedCommunity, activeTab]);

  const handleJoinToggle = async (communityId) => {
    try {
      const res = await fetch(API_URLS.communities.join(communityId), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId })
      });
      if (res.ok) {
        const updatedCom = await res.json();
        if (selectedCommunity && selectedCommunity._id === communityId) {
          setSelectedCommunity(updatedCom);
        }
        fetchCommunities();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConnect = async (targetId) => {
    try {
      const res = await fetch(API_URLS.connections.follow(targetId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId })
      });
      if (res.ok) {
        setConnectionStatuses(prev => ({ ...prev, [targetId]: "requested" }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const createCommunity = async () => {
    if (!newComName.trim() || !newComDesc.trim()) return;
    try {
      const res = await fetch(API_URLS.communities.base, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newComName, description: newComDesc, adminId: currentUserId })
      });
      if (res.ok) {
        setShowCreateModal(false);
        setNewComName("");
        setNewComDesc("");
        fetchCommunities();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Community Feed Logic
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileType = file.type.split('/')[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedMedia({
        url: reader.result,
        type: fileType === 'video' ? 'video' : 'image'
      });
    };
    reader.readAsDataURL(file);
  };

  const handlePostSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!newPostContent.trim() && !selectedMedia) return;

    try {
      const res = await fetch(API_URLS.communities.createPost(selectedCommunity._id), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: currentUserId,
          content: newPostContent,
          media: selectedMedia ? [selectedMedia] : []
        })
      });

      if (res.ok) {
        setNewPostContent("");
        setSelectedMedia(null);
        fetchCommunityPosts(selectedCommunity._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const likePost = async (postId) => {
    try {
      await fetch(API_URLS.posts.like(postId), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId })
      });
      fetchCommunityPosts(selectedCommunity._id);
    } catch (err) {
      console.error(err);
    }
  };

  const submitComment = async (postId) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    try {
      const res = await fetch(API_URLS.posts.comment(postId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, text })
      });
      if (res.ok) {
        setCommentInputs(prev => ({ ...prev, [postId]: "" }));
        fetchCommunityPosts(selectedCommunity._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (selectedCommunity) {
    const isJoined = selectedCommunity.members?.some(m => (m._id || m) === currentUserId);
    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
            <button onClick={() => { setSelectedCommunity(null); setActiveTab("members"); }} className="text-gray-600 hover:text-purple-600 p-2">
              <FaArrowLeft className="text-xl" />
            </button>
            <h1 className="font-bold text-xl truncate">{selectedCommunity.name}</h1>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 mt-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-purple-600 to-indigo-700 p-8 flex flex-col justify-end">
              <h1 className="text-white text-3xl font-extrabold mb-2">{selectedCommunity.name}</h1>
              <p className="text-purple-100 font-medium">{selectedCommunity.members?.length || 0} members • Community</p>
            </div>
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">About</h2>
                  <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {selectedCommunity.description}
                  </p>
                </div>
                <div className="md:w-64 flex flex-col gap-3">
                  <button
                    onClick={() => handleJoinToggle(selectedCommunity._id)}
                    className={`w-full py-3 rounded-full font-bold transition shadow-md ${
                      isJoined 
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200" 
                      : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}
                  >
                    {isJoined ? "Leave Community" : "Join Community"}
                  </button>
                  <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
                    <FaShieldAlt className="text-purple-400" /> Admin: {selectedCommunity.admin?.name}
                  </p>
                </div>
              </div>

              <div className="mt-12">
                <div className="border-b mb-6 flex gap-8">
                  <button 
                    onClick={() => setActiveTab("members")}
                    className={`py-4 font-bold transition-all border-b-2 ${activeTab === "members" ? "border-purple-600 text-purple-600" : "border-transparent text-gray-500 hover:text-purple-600"}`}
                  >
                    Members
                  </button>
                  <button 
                    onClick={() => setActiveTab("feed")}
                    className={`py-4 font-bold transition-all border-b-2 ${activeTab === "feed" ? "border-purple-600 text-purple-600" : "border-transparent text-gray-500 hover:text-purple-600"}`}
                  >
                    Feed
                  </button>
                </div>

                {activeTab === "members" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedCommunity.members?.map(member => (
                      <div key={member._id} className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 hover:shadow-sm transition border border-transparent hover:border-purple-100">
                        <img
                          src={member.profilePhoto || "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"}
                          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer"
                          onClick={() => navigate(`/profile/${member._id}`)}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 truncate">{member.name} {member.lastname}</h3>
                          <p className="text-xs text-gray-500 truncate">{member.headline || "Artist"}</p>
                        </div>
                        {member._id !== currentUserId && (
                          <button
                            onClick={() => handleConnect(member._id)}
                            className={`p-2 rounded-full transition ${
                              connectionStatuses[member._id] === "requested"
                              ? "text-gray-400 cursor-default"
                              : "text-purple-600 hover:bg-purple-50"
                            }`}
                            title={connectionStatuses[member._id] === "requested" ? "Requested" : "Connect"}
                          >
                            {connectionStatuses[member._id] === "requested" ? <FaUserCheck /> : <FaUserPlus />}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-6 max-w-2xl mx-auto">
                    {/* Create Post in Community */}
                    {isJoined && (
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex gap-4">
                          <img src={storedUser.profilePhoto || "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"} className="w-10 h-10 rounded-full object-cover" />
                          <div className="flex-1">
                            <textarea 
                              className="w-full border-none outline-none resize-none bg-transparent" 
                              placeholder="Share with the community..." 
                              rows="2"
                              value={newPostContent}
                              onChange={(e) => setNewPostContent(e.target.value)}
                            />
                            {selectedMedia && (
                               <div className="relative mt-2 rounded-lg overflow-hidden bg-black max-h-64 flex items-center justify-center">
                                 <button onClick={() => setSelectedMedia(null)} className="absolute top-2 right-2 bg-gray-800 text-white p-1 rounded-full"><FaTimes /></button>
                                 {selectedMedia.type === 'video' ? <video src={selectedMedia.url} className="max-h-64" /> : <img src={selectedMedia.url} className="max-h-64" />}
                               </div>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-4 border-t pt-3">
                          <div className="flex gap-4">
                            <button onClick={() => fileInputRef.current.click()} className="text-gray-500 hover:text-purple-600 transition flex items-center gap-2">
                              <FaImage className="text-blue-500" /> Photo/Video
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                          </div>
                          <button 
                            onClick={handlePostSubmit} 
                            disabled={!newPostContent.trim() && !selectedMedia}
                            className="bg-purple-600 text-white px-6 py-2 rounded-full font-bold hover:bg-purple-700 transition"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Community Grid of Posts */}
                    {communityPosts.map(post => (
                      <div key={post._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 flex gap-3 items-center">
                           <img src={post.author?.profilePhoto} className="w-10 h-10 rounded-full object-cover" />
                           <div>
                             <h4 className="font-bold text-sm">{post.author?.name} {post.author?.lastname}</h4>
                             <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
                           </div>
                        </div>
                        <div className="px-4 pb-3">
                           <p className="text-sm text-gray-800">{post.content}</p>
                        </div>
                        {post.media && post.media.length > 0 && (
                          <div className="bg-black">
                            {post.media[0].type === 'video' ? <video src={post.media[0].url} controls className="w-full max-h-[500px]" /> : <img src={post.media[0].url} className="w-full max-h-[500px] object-contain" />}
                          </div>
                        )}
                        <div className="p-4 border-t flex gap-6">
                           <button onClick={() => likePost(post._id)} className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition">
                             <FaRegThumbsUp className={post.likes?.includes(currentUserId) ? "text-red-500" : ""} /> {post.likes?.length || 0}
                           </button>
                           <button onClick={() => setOpenComments(p => ({...p, [post._id]: !p[post._id]}))} className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition">
                             <FaRegCommentDots /> {post.comments?.length || 0}
                           </button>
                        </div>

                        {openComments[post._id] && (
                           <div className="bg-gray-50 p-4 border-t space-y-4">
                             {post.comments?.map((c, i) => (
                               <div key={i} className="flex gap-3">
                                 <img src={c.user?.profilePhoto} className="w-8 h-8 rounded-full object-cover mt-1" />
                                 <div className="bg-white p-3 rounded-xl border flex-1">
                                    <p className="text-xs font-bold">{c.user?.name} {c.user?.lastname}</p>
                                    <p className="text-sm">{c.text}</p>
                                 </div>
                               </div>
                             ))}
                             <div className="flex gap-3 items-center pt-2">
                                <input 
                                  className="flex-1 bg-white border rounded-full px-4 py-2 text-sm outline-none focus:border-purple-500" 
                                  placeholder="Add a comment..."
                                  value={commentInputs[post._id] || ""}
                                  onChange={(e) => setCommentInputs(p => ({...p, [post._id]: e.target.value}))}
                                  onKeyDown={(e) => e.key === 'Enter' && submitComment(post._id)}
                                />
                             </div>
                           </div>
                        )}
                      </div>
                    ))}
                    {communityPosts.length === 0 && (
                      <div className="text-center py-10 text-gray-400">No posts in this community yet.</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Communities</h1>
            <p className="text-gray-500 mt-1 font-medium">Join groups that match your creative pulse.</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 text-white px-8 py-3 rounded-full font-extrabold hover:bg-purple-700 transition shadow-lg hover:shadow-purple-200"
          >
            Start a Group
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((com) => {
              const isJoined = com.members?.some(m => (m._id || m) === currentUserId);
              return (
                <div key={com._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group cursor-pointer" onClick={() => setSelectedCommunity(com)}>
                  <div className="h-28 bg-gradient-to-br from-purple-500 to-indigo-600 p-6 flex flex-col justify-end">
                    <h2 className="text-white text-xl font-black truncate drop-shadow-sm">{com.name}</h2>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-gray-500 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">{com.description}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex -space-x-2">
                         {com.members?.slice(0, 3).map((m, i) => (
                           <img key={i} src={m.profilePhoto || "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                         ))}
                         {com.members?.length > 3 && (
                           <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-600">
                             +{com.members.length - 3}
                           </div>
                         )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleJoinToggle(com._id); }}
                        className={`text-sm font-black px-5 py-2 rounded-full transition ${
                          isJoined 
                          ? "bg-gray-100 text-gray-500" 
                          : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                        }`}
                      >
                        {isJoined ? "Leave" : "Join"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl scale-in">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Create Community</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Jazz Enthusiasts"
                    value={newComName}
                    onChange={(e) => setNewComName(e.target.value)}
                    className="w-full border-2 border-gray-50 rounded-2xl p-4 outline-none focus:border-purple-500 bg-gray-50 transition"
                  />
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">About</label>
                  <textarea
                    placeholder="What's this group for?"
                    value={newComDesc}
                    onChange={(e) => setNewComDesc(e.target.value)}
                    className="w-full border-2 border-gray-50 rounded-2xl p-4 outline-none focus:border-purple-500 bg-gray-50 transition h-32 resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-4 rounded-2xl font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={createCommunity}
                  className="flex-1 px-4 py-4 bg-purple-600 text-white rounded-2xl font-black shadow-lg shadow-purple-100 hover:bg-purple-700 transition"
                >
                  Launch
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;