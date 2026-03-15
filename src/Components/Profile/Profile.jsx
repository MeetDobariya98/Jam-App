import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URLS } from "../../api";
import { 
  FaMusic, FaMapMarkerAlt, FaEdit, FaUserPlus, FaUserCheck, 
  FaUserClock, FaCamera, FaTimes, FaCheck, FaRegCommentDots, FaRegThumbsUp,
  FaChartLine, FaNewspaper
} from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [currentUser, setCurrentUser] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("none");
  const [userPosts, setUserPosts] = useState([]);

  // Editing States
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [showConnectionsModal, setShowConnectionsModal] = useState(false);
  
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!token || !storedUser) {
        navigate("/login");
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);

      const targetId = id || parsedUser.id || parsedUser._id;

      const res = await fetch(API_URLS.users.profile(targetId));
      if (!res.ok) throw new Error("Could not fetch profile");
      
      const data = await res.json();
      setProfileUser(data);
      setEditData(data); // Pre-fill edit data

      // Fetch connection status if viewing someone else
      if (targetId !== (parsedUser.id || parsedUser._id)) {
        const statusRes = await fetch(API_URLS.connections.status(targetId), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: parsedUser.id || parsedUser._id })
        });
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          setConnectionStatus(statusData.status);
        }
      }

      // Fetch user posts
      const postsRes = await fetch(API_URLS.posts.userPosts(targetId));
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setUserPosts(postsData);
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id, navigate]);

  const handleConnect = async () => {
    try {
      const res = await fetch(API_URLS.connections.follow(profileUser._id), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id || currentUser._id })
      });
      if (res.ok) {
        setConnectionStatus("requested");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (fieldsToUpdate) => {
    try {
      const res = await fetch(API_URLS.users.updateProfile(profileUser._id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fieldsToUpdate)
      });
      if (res.ok) {
        const updated = await res.json();
        setProfileUser(updated);
        // Update local storage if it's our own profile
        if (!id || id === (currentUser?.id || currentUser?._id)) {
             localStorage.setItem("user", JSON.stringify({ ...currentUser, ...updated }));
        }
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePhotoUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      handleUpdate({ [type]: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!profileUser) return <div className="min-h-screen flex items-center justify-center">User not found</div>;

  const isOwnProfile = !id || id === (currentUser?.id || currentUser?._id);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6 px-4">
      <div className="w-full max-w-4xl space-y-4">
        
        {/* HERO SECTION */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden relative border border-gray-200">
          {/* Cover Photo */}
          <div className="h-48 w-full bg-gradient-to-r from-purple-600 to-indigo-700 relative">
            {profileUser.coverPhoto && (
              <img src={profileUser.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
            )}
            {isOwnProfile && (
              <button 
                onClick={() => coverInputRef.current.click()}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 rounded-full transition shadow-lg"
              >
                <FaCamera />
              </button>
            )}
            <input type="file" ref={coverInputRef} className="hidden" onChange={(e) => handlePhotoUpload(e, 'coverPhoto')} />
          </div>
          
          {/* Profile Photo */}
          <div className="px-8 pb-8 relative">
            <div className="relative inline-block -mt-20 border-[6px] border-white rounded-full bg-white shadow-xl">
              <img 
                src={profileUser.profilePhoto || "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"} 
                alt="Profile" 
                className="w-36 h-36 rounded-full object-cover"
              />
              {isOwnProfile && (
                <button 
                   onClick={() => profileInputRef.current.click()}
                   className="absolute bottom-2 right-2 bg-purple-600 text-white p-2.5 rounded-full border-4 border-white hover:bg-purple-700 transition shadow-lg"
                >
                  <FaCamera size={14} />
                </button>
              )}
              <input type="file" ref={profileInputRef} className="hidden" onChange={(e) => handlePhotoUpload(e, 'profilePhoto')} />
            </div>
            
            <div className="mt-4 flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">{profileUser.name} {profileUser.lastname}</h1>
                    {isOwnProfile && <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-purple-600 transition"><FaEdit /></button>}
                </div>
                <p className="text-xl text-gray-600 font-medium">{profileUser.headline || `${profileUser.instrument} Musician`}</p>
                
                {/* BIO SECTION */}
                <p className="text-gray-500 max-w-lg italic">
                  {profileUser.bio || "No bio added yet."}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-400 font-medium mt-4">
                  <span className="flex items-center gap-1.5"><FaMapMarkerAlt className="text-purple-400" /> {profileUser.city}, {profileUser.state}</span>
                  <button 
                    onClick={() => setShowConnectionsModal(true)}
                    className="text-purple-600 font-bold hover:underline cursor-pointer"
                  >
                    {profileUser.connections?.length || 0} connections
                  </button>
                </div>
              </div>
              
              <div className="flex gap-2 w-full md:w-auto">
                {isOwnProfile ? (
                  <div className="flex gap-2 w-full">
                    <button className="flex-1 md:flex-none bg-purple-600 text-white px-8 py-2.5 font-bold rounded-full hover:bg-purple-700 transition shadow-md shadow-purple-100">
                      Add Section
                    </button>
                    <button onClick={logout} className="flex-1 md:flex-none border-2 border-red-100 text-red-500 px-8 py-2.5 font-bold rounded-full hover:bg-red-50 transition">
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 w-full">
                    {connectionStatus === "none" && (
                      <button onClick={handleConnect} className="flex-1 md:flex-none bg-purple-600 flex items-center justify-center gap-2 text-white px-8 py-2.5 font-bold rounded-full hover:bg-purple-700 transition shadow-md">
                        <FaUserPlus /> Connect
                      </button>
                    )}
                    {connectionStatus === "requested" && (
                      <button className="flex-1 md:flex-none bg-gray-100 flex items-center justify-center gap-2 text-gray-500 px-8 py-2.5 font-bold rounded-full">
                        <FaUserClock /> Requested
                      </button>
                    )}
                    {connectionStatus === "connected" && (
                      <button className="flex-1 md:flex-none border-2 border-purple-600 text-purple-600 flex items-center justify-center gap-2 px-8 py-2.5 font-bold rounded-full">
                        <FaUserCheck /> Connected
                      </button>
                    )}
                    <button 
                      onClick={() => navigate("/messages", { state: { selectedUser: profileUser } })}
                      className="flex-1 md:flex-none border-2 border-purple-600 text-purple-600 px-8 py-2.5 font-bold rounded-full hover:bg-purple-50 transition"
                    >
                      Message
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ABOUT SECTION */}
        <div className="bg-white rounded-2xl shadow-sm p-8 relative border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">About</h2>
            {isOwnProfile && <button onClick={() => { setIsEditing(true); setEditData(profileUser); }} className="text-gray-400 hover:text-purple-600 transition p-2 rounded-full hover:bg-gray-50"><FaEdit /></button>}
          </div>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap font-medium">
            {profileUser.about || "Share your creative journey here..."}
          </p>
        </div>

        {/* POSTS FEED SECTION */}
        <div className="bg-white rounded-2xl shadow-sm p-8 relative border border-gray-200">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <FaNewspaper className="text-purple-600 text-xl" />
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Recent Posts</h2>
            </div>
            {isOwnProfile && (
              <button 
                onClick={() => navigate("/feed")} 
                className="bg-purple-600 text-white font-bold px-6 py-2 rounded-full hover:bg-purple-700 transition shadow-lg shadow-purple-100"
              >
                Create Post
              </button>
            )}
          </div>
          
          <div className="space-y-6">
            {userPosts.length > 0 ? (
              userPosts.slice(0, 3).map(post => (
                <div key={post._id} className="border-b border-gray-50 pb-6 last:border-0 hover:bg-gray-50/50 transition p-4 rounded-xl">
                  <p className="text-gray-400 text-xs font-bold mb-3 uppercase tracking-wider">{profileUser.name} • {new Date(post.createdAt).toLocaleDateString()}</p>
                  
                  <div className="flex gap-6 cursor-pointer" onClick={() => navigate("/feed")}>
                    {post.media && post.media.length > 0 ? (
                      <div className="w-20 h-20 bg-gray-100 flex-shrink-0 rounded-xl overflow-hidden shadow-inner">
                        {post.media[0].type === 'video' ? (
                          <video src={post.media[0].url} className="w-full h-full object-cover" />
                        ) : (
                          <img src={post.media[0].url} className="w-full h-full object-cover" alt="Post preview" />
                        )}
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-gray-50 text-gray-300 flex items-center justify-center rounded-xl border border-dashed border-gray-200">
                        <FaRegCommentDots size={24} />
                      </div>
                    )}
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-gray-800 font-medium line-clamp-2 leading-relaxed">{post.content || "Media post"}</p>
                      <div className="flex items-center gap-5 mt-3 text-xs font-bold text-gray-400">
                        <span className="flex items-center gap-1.5 hover:text-red-500 transition"><FaRegThumbsUp /> {post.likes?.length || 0}</span>
                        <span className="flex items-center gap-1.5 hover:text-purple-600 transition"><FaRegCommentDots /> {post.comments?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed">
                  <p className="text-gray-400 font-medium italic">You haven't posted anything yet.</p>
              </div>
            )}
            
            {userPosts.length > 3 && (
              <button 
                onClick={() => navigate("/feed")}
                className="w-full py-4 text-center text-purple-600 font-black hover:text-purple-700 transition flex items-center justify-center gap-2 mt-4 bg-purple-50/30 rounded-xl"
              >
                View all posts ➔
              </button>
            )}
          </div>
        </div>

        {/* SKILLS SECTION (Moved below Posts for better flow) */}
        <div className="bg-white rounded-2xl shadow-sm p-8 relative border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <FaMusic className="text-purple-600 text-xl" />
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Skills & Expertise</h2>
            </div>
            {isOwnProfile && <button className="text-gray-400 hover:text-purple-600 transition p-2 rounded-full hover:bg-gray-50"><FaEdit /></button>}
          </div>
          <div className="flex flex-wrap gap-2">
            {profileUser.skills && profileUser.skills.length > 0 ? (
              profileUser.skills.map((skill, idx) => (
                <span key={idx} className="px-4 py-2 bg-purple-50 font-bold text-purple-700 rounded-xl border border-purple-100 transition hover:bg-purple-100 cursor-default">
                  {skill}
                </span>
              ))
            ) : (
              <span className="px-4 py-2 bg-purple-50 font-bold text-purple-700 rounded-xl border border-purple-100">
                {profileUser.instrument}
              </span>
            )}
          </div>
        </div>

      </div>

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-2xl font-black text-gray-900">Edit Profile</h2>
               <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600"><FaTimes size={20} /></button>
            </div>
            
            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">First Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl outline-none focus:border-purple-500 transition font-medium"
                    value={editData.name || ""}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl outline-none focus:border-purple-500 transition font-medium"
                    value={editData.lastname || ""}
                    onChange={(e) => setEditData({...editData, lastname: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Headline</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl outline-none focus:border-purple-500 transition font-medium"
                  value={editData.headline || ""}
                  onChange={(e) => setEditData({...editData, headline: e.target.value})}
                />
              </div>

              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Bio (Short Intro)</label>
                <input 
                  type="text" 
                  maxLength="160"
                  className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl outline-none focus:border-purple-500 transition font-medium"
                  value={editData.bio || ""}
                  onChange={(e) => setEditData({...editData, bio: e.target.value})}
                  placeholder="Tell people what you pulse with..."
                />
              </div>

              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">About</label>
                <textarea 
                  className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl outline-none focus:border-purple-500 transition font-medium h-32 resize-none"
                  value={editData.about || ""}
                  onChange={(e) => setEditData({...editData, about: e.target.value})}
                  placeholder="Go deeper into your story..."
                />
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button 
                onClick={() => setIsEditing(false)} 
                className="flex-1 py-4 font-bold text-gray-400 hover:bg-gray-50 rounded-2xl transition"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleUpdate(editData)} 
                className="flex-1 bg-purple-600 text-white py-4 font-black rounded-2xl shadow-lg hover:bg-purple-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONNECTIONS MODAL */}
      {showConnectionsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl scale-in max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Connections</h2>
                <button onClick={() => setShowConnectionsModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes size={18} /></button>
            </div>
            
            <div className="overflow-y-auto flex-1 pr-2 space-y-4">
                {profileUser.connections && profileUser.connections.length > 0 ? (
                  profileUser.connections.map(conn => (
                    <div 
                      key={conn._id} 
                      onClick={() => { setShowConnectionsModal(false); navigate(`/profile/${conn._id}`); }}
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition cursor-pointer border border-transparent hover:border-gray-100"
                    >
                      <img 
                        src={conn.profilePhoto || "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"} 
                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                        alt={conn.name}
                      />
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{conn.name} {conn.lastname}</h3>
                        <p className="text-xs text-gray-500 truncate">{conn.headline || "Artist"}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-400 font-medium italic">
                    No connections yet.
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;