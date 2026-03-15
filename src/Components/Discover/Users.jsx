import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URLS } from "../../api";
import { FaMusic, FaMapMarkerAlt, FaUserPlus, FaUserClock, FaUserCheck } from "react-icons/fa";

const Users = () => {
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  const currentUserId = currentUser.id || currentUser._id;
  const [allUsers, setAllUsers] = useState([]);
  const [connectionsMap, setConnectionsMap] = useState({}); // Stores status for each user ID
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("discover"); // discover, connections, pending

  const fetchUsersAndStatus = async () => {
    try {
      if (!currentUserId) return;

      // 1. Fetch all users
      const usersRes = await fetch(API_URLS.users.all);
      const users = await usersRes.json();
      
      let finalUsers = [];
      if (Array.isArray(users)) {
        finalUsers = users.filter((u) => u._id !== currentUserId);
      }
      setAllUsers(finalUsers);

      // 2. We skip fetching individual status for N users here to avoid N requests.
      const currProfileRes = await fetch(API_URLS.users.profile(currentUserId));
      const currProfile = await currProfileRes.json();

      const map = {};
      if (currProfile && currProfile.connections && Array.isArray(currProfile.connections)) {
        currProfile.connections.forEach(req => {
            const reqId = typeof req === 'string' ? req : req._id;
            if (reqId) map[reqId] = "connected";
        });
      }
      if (currProfile && currProfile.pendingRequests && Array.isArray(currProfile.pendingRequests)) {
        currProfile.pendingRequests.forEach(req => {
            const reqId = typeof req === 'string' ? req : req._id;
            if (reqId) map[reqId] = "pending_received";
        });
      }
      
      // Load sent requests
      const sentRes = await fetch(API_URLS.notifications.sent(currentUserId));
      const sentData = await sentRes.json();
      if (Array.isArray(sentData)) {
        sentData.forEach((req) => {
            if (req.receiverId) map[req.receiverId] = "requested";
        });
      }

      setConnectionsMap(map);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchUsersAndStatus();
  }, []);

  const sendRequest = async (targetId) => {
    try {
      const res = await fetch(API_URLS.connections.follow(targetId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId })
      });
      if (res.ok) {
        setConnectionsMap(prev => ({ ...prev, [targetId]: "requested" }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccept = async (requesterId) => {
    try {
      const res = await fetch(API_URLS.connections.accept(requesterId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId })
      });
      if (res.ok) {
        setConnectionsMap(prev => ({ ...prev, [requesterId]: "connected" }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (requesterId) => {
    try {
      const res = await fetch(API_URLS.connections.reject(requesterId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId })
      });
      if (res.ok) {
        setConnectionsMap(prev => {
          const newMap = { ...prev };
          delete newMap[requesterId];
          return newMap;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const displayedUsers = allUsers.filter(u => {
    // Search filter
    const matchesSearch = `${u.name} ${u.lastname}`.toLowerCase().includes(search.toLowerCase()) || 
                          u.instrument?.toLowerCase().includes(search.toLowerCase()) ||
                          u.city?.toLowerCase().includes(search.toLowerCase()) ||
                          u.state?.toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;

    // Tab filter
    if (activeTab === "connections") return connectionsMap[u._id] === "connected";
    if (activeTab === "pending") return connectionsMap[u._id] === "pending_received";
    
    // Discover tab shows everyone, but you might want to hide already connected people in a real app
    return true; 
  });

  return (
    <div className="min-h-screen bg-[#F8F9FB] py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        
        {/* LEFT SIDEBAR: MANAGE NETWORK */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden sticky top-24">
            <div className="p-5 border-b border-gray-50 bg-gray-50/30">
              <h2 className="font-black text-xs uppercase tracking-widest text-gray-400">Manage Network</h2>
            </div>
            <nav className="p-2">
              {[
                { id: "discover", label: "Discover", icon: "🌐" },
                { id: "connections", label: "Connections", icon: "🤝", count: Object.values(connectionsMap).filter(v => v === "connected").length },
                { id: "pending", label: "Requests", icon: "📩", count: Object.values(connectionsMap).filter(v => v === "pending_received").length },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
                    activeTab === tab.id 
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-100 font-bold" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-purple-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-lg transition-transform duration-200 group-hover:scale-110 ${activeTab === tab.id ? "" : "grayscale opacity-70"}`}>
                      {tab.icon}
                    </span>
                    <span className="text-sm">{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                      activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* MAIN FEED */}
        <div className="flex-1">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight capitalize leading-tight">
                {activeTab === "discover" ? "Discover Artists" : `My ${activeTab}`}
              </h1>
              <p className="text-gray-400 text-sm mt-1 font-medium italic">Explore talented musicians from around the world</p>
            </div>

            <div className="relative w-full sm:w-72">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input 
                type="text"
                placeholder="Search artists..."
                className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-11 pr-4 focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedUsers.length > 0 ? displayedUsers.map((user) => (
                <div key={user._id} className="group bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-purple-100 transition-all duration-300 relative flex flex-col">
                  {/* Header Decoration */}
                  <div className="h-20 bg-gradient-to-br from-purple-500 to-indigo-600 relative overflow-hidden">
                    {user.coverPhoto && <img src={user.coverPhoto} className="w-full h-full object-cover" alt="" />}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  {/* User Content */}
                  <div className="px-4 pb-4 flex flex-col items-center flex-1">
                    <Link to={`/profile/${user._id}`} className="relative -mt-10 mb-3 block group/avatar">
                      <img 
                        src={user.profilePhoto || "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"} 
                        alt={user.name} 
                        className="w-20 h-20 rounded-[1.5rem] object-cover ring-4 ring-white bg-white group-hover/avatar:scale-105 transition-transform shadow-xl shadow-gray-200"
                      />
                    </Link>
                    
                    <Link to={`/profile/${user._id}`}>
                      <h3 className="font-black text-gray-900 text-base hover:text-purple-600 transition-colors text-center leading-tight">
                        {user.name} {user.lastname}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center gap-1 mt-1 font-bold text-[10px] text-purple-600 uppercase tracking-widest">
                      <FaMusic className="text-[8px]" /> {user.headline || user.instrument || "Musician"}
                    </div>
                    
                    <p className="text-gray-400 text-[11px] font-medium flex items-center gap-1 mt-2 mb-5">
                      <FaMapMarkerAlt className="text-purple-300" /> {user.city}, {user.state}
                    </p>
                    
                    <div className="w-full mt-auto">
                      {connectionsMap[user._id] === "connected" ? (
                        <button className="w-full bg-green-50 text-green-600 rounded-2xl py-2.5 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transform active:scale-95 transition">
                          <FaUserCheck className="text-sm" /> Connected
                        </button>
                      ) : connectionsMap[user._id] === "pending_received" ? (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleAccept(user._id)}
                            className="flex-1 bg-purple-600 text-white rounded-2xl py-2.5 font-black text-[10px] uppercase tracking-widest hover:bg-purple-700 shadow-lg shadow-purple-100 transform active:scale-95 transition"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => handleReject(user._id)}
                            className="flex-1 bg-gray-50 text-gray-400 border border-gray-100 rounded-2xl py-2.5 font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transform active:scale-95 transition"
                          >
                            Ignore
                          </button>
                        </div>
                      ) : connectionsMap[user._id] === "requested" ? (
                        <button className="w-full bg-gray-50 text-gray-400 italic rounded-2xl py-2.5 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 cursor-default border border-gray-100">
                          <FaUserClock className="text-sm" /> Pending
                        </button>
                      ) : (
                        <button 
                          onClick={() => sendRequest(user._id)}
                          className="w-full bg-white border-2 border-purple-600 text-purple-600 rounded-2xl py-2.5 font-black text-[10px] uppercase tracking-widest hover:bg-purple-600 hover:text-white transform active:scale-95 transition shadow-sm hover:shadow-xl hover:shadow-purple-100 flex items-center justify-center gap-2"
                        >
                          <FaUserPlus className="text-sm" /> Connect
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full bg-white border-2 border-dashed border-gray-100 rounded-[2rem] p-20 flex flex-col items-center text-center">
                  <span className="text-5xl mb-4 grayscale opacity-20">🎸</span>
                  <p className="font-bold text-gray-400 text-lg">
                    {search ? `No artists matching "${search}"` : `No ${activeTab} to show just yet.`}
                  </p>
                  {search && <button onClick={() => setSearch("")} className="mt-4 text-purple-600 font-bold hover:underline">Clear Search</button>}
                </div>
              )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Users;