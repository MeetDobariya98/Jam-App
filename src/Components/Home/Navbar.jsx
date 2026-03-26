import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBell, FaHome, FaUsers, FaSuitcase, FaUserCircle, FaCommentDots } from "react-icons/fa";
import { API_URLS } from "../../api";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const loadUnreadMessages = async () => {
    if (!currentUser?.id && !currentUser?._id) return;
    try {
      const res = await fetch(API_URLS.messages.conversations(currentUser.id || currentUser._id));
      const data = await res.json();
      if (Array.isArray(data)) {
        const unread = data.filter(c => !c.isRead).length;
        setUnreadMessages(unread);
      }
    } catch (error) {
      console.error("Message count fetch error:", error);
    }
  };

  const loadNotifications = async () => {
    if (!currentUser?.id && !currentUser?._id) return;
    try {
      const res = await fetch(API_URLS.notifications.base(currentUser.id || currentUser._id));
      const data = await res.json();
      if (Array.isArray(data)) setNotifications(data);
    } catch (error) {
      console.error("Notification fetch error:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
        loadNotifications();
        loadUnreadMessages();
        const interval = setInterval(() => {
            loadNotifications();
            loadUnreadMessages();
        }, 5000);
        return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleAcceptRequest = async (requesterId) => {
    try {
      await fetch(API_URLS.connections.accept(requesterId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id || currentUser._id })
      });
      loadNotifications(); 
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectRequest = async (requesterId) => {
    try {
      await fetch(API_URLS.connections.reject(requesterId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id || currentUser._id })
      });
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* ── TOP NAVBAR ── */}
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <Link to={isLoggedIn ? "/feed" : "/"}>
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-black text-xl w-10 h-10 flex items-center justify-center rounded-xl shadow-lg shadow-purple-200 cursor-pointer transform hover:scale-105 transition">
                J
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-4 text-gray-500 font-medium tracking-tight">
            {!isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link to="/" className="text-sm hover:text-purple-600 transition">Home</Link>
                <Link to="/signup" className="text-sm text-purple-600 px-5 py-2 rounded-full font-bold hover:bg-purple-50 transition border border-purple-100">Join now</Link>
                <Link to="/login" className="text-sm bg-purple-600 text-white px-5 py-2 rounded-full font-bold hover:bg-purple-700 transition shadow-md shadow-purple-100">Sign in</Link>
              </div>
            ) : (
              <>
                <Link to="/feed" className="flex flex-col items-center justify-center w-16 h-14 hover:text-purple-600 transition group relative">
                  <FaHome className="text-xl group-hover:-translate-y-0.5 transition" />
                  <span className="text-[11px] mt-1 opacity-0 group-hover:opacity-100 transition">Home</span>
                </Link>
                <Link to="/discover" className="flex flex-col items-center justify-center w-16 h-14 hover:text-purple-600 transition group relative">
                  <FaUsers className="text-xl group-hover:-translate-y-0.5 transition" />
                  <span className="text-[11px] mt-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">Network</span>
                </Link>
                <Link to="/communities" className="flex flex-col items-center justify-center w-16 h-14 hover:text-purple-600 transition group relative">
                  <FaSuitcase className="text-xl group-hover:-translate-y-0.5 transition" />
                  <span className="text-[11px] mt-1 opacity-0 group-hover:opacity-100 transition">Groups</span>
                </Link>
                <Link to="/messages" className="flex flex-col items-center justify-center w-16 h-14 hover:text-purple-600 transition group relative">
                  <div className="relative">
                    <FaCommentDots className="text-xl group-hover:-translate-y-0.5 transition" />
                    {unreadMessages > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 bg-red-500 text-white text-[9px] min-w-[16px] h-4 flex items-center justify-center rounded-full font-black border-2 border-white">
                        {unreadMessages}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] mt-1 opacity-0 group-hover:opacity-100 transition">Messages</span>
                </Link>
              </>
            )}
          </div>

          {/* Right Section: Notifications + Profile (Visible on Desktop, Profile only on Mobile) */}
          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <>
                {/* Desktop Notifications Button */}
                <div className="hidden md:flex relative flex-col items-center justify-center w-16 h-14 hover:text-purple-600 transition group cursor-pointer"
                     onClick={async () => {
                       const wasShowing = showNotifications;
                       setShowNotifications(!wasShowing);
                       if (!wasShowing) {
                         setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                         try {
                           await fetch(API_URLS.notifications.markRead(currentUser.id || currentUser._id), { method: "PUT" });
                         } catch (err) { console.error(err); }
                       }
                     }}>
                  <div className="relative">
                    <FaBell className="text-xl group-hover:-translate-y-0.5 transition" />
                    {notifications.filter(n => !n.isRead).length > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 bg-red-500 text-white text-[9px] min-w-[16px] h-4 flex items-center justify-center rounded-full font-black border-2 border-white">
                        {notifications.filter(n => !n.isRead).length}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition">Inbox</span>
                </div>

                {/* Profile Menu (Always visible) */}
                <div className="relative group flex flex-col items-center justify-center w-14 sm:w-16 h-14 cursor-pointer">
                  <Link to="/profile" className="flex flex-col items-center">
                    <img 
                      src={currentUser?.profilePhoto || "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"} 
                      alt="Me" 
                      className="w-8 h-8 md:w-7 md:h-7 rounded-full object-cover border-2 border-transparent group-hover:border-purple-200 transition ring-2 ring-gray-100 group-hover:ring-purple-100 shadow-sm"
                    />
                    <span className="hidden md:flex text-[11px] mt-1 text-gray-400 group-hover:text-purple-600 transition items-center gap-0.5">Me <span className="text-[8px] opacity-60">▼</span></span>
                  </Link>
                  
                  <div className="absolute right-0 top-[100%] pt-2 w-52 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-[60]">
                    <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden translate-y-2 group-hover:translate-y-0 transition-transform">
                      <div className="p-4 bg-gray-50/50">
                        <p className="font-bold text-sm text-gray-900 truncate">{currentUser?.name}</p>
                        <Link to="/profile" className="text-xs text-purple-600 font-semibold hover:underline mt-0.5 block">View Profile</Link>
                      </div>
                      <div className="p-1 border-t border-gray-50">
                        <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl font-semibold transition flex items-center gap-2">
                          <span className="text-xs">🚪</span> Sign out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!isLoggedIn && (
               <div className="flex md:hidden items-center gap-2">
                 <Link to="/login" className="text-xs bg-purple-600 text-white px-4 py-2 rounded-full font-bold shadow-lg shadow-purple-100">Sign in</Link>
               </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── FLOATING BOTTOM DOCK (Mobile Only) ── */}
      {isLoggedIn && (
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm">
          <div className="bg-white/70 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-3xl h-16 flex items-center justify-around px-2">
            <Link to="/feed" className="flex flex-col items-center justify-center w-12 h-12 text-gray-400 hover:text-purple-600 transition">
              <FaHome className="text-[22px]" />
            </Link>
            <Link to="/discover" className="flex flex-col items-center justify-center w-12 h-12 text-gray-400 hover:text-purple-600 transition">
              <FaUsers className="text-[22px]" />
            </Link>
            <Link to="/communities" className="flex flex-col items-center justify-center w-12 h-12 text-gray-400 hover:text-purple-600 transition">
              <FaSuitcase className="text-[22px]" />
            </Link>
            <Link to="/messages" className="flex flex-col items-center justify-center w-12 h-12 text-gray-400 hover:text-purple-600 transition relative">
              <FaCommentDots className="text-[22px]" />
              {unreadMessages > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-black border-2 border-white">
                  {unreadMessages}
                </span>
              )}
            </Link>
            <div className="flex flex-col items-center justify-center w-12 h-12 text-gray-400 hover:text-purple-600 transition relative cursor-pointer"
                 onClick={() => setShowNotifications(!showNotifications)}>
              <FaBell className="text-[20px]" />
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-black border-2 border-white">
                  {notifications.filter(n => !n.isRead).length}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {showNotifications && isLoggedIn && (
        <div className="absolute right-4 sm:right-24 top-14 w-80 max-h-96 overflow-y-auto bg-white border border-gray-300 shadow-xl rounded-lg z-50 p-2">
          <h3 className="font-bold text-gray-800 p-2 border-b">Notifications</h3>
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500 p-4 text-center">No new notifications</p>
          ) : (
            notifications.map((n) => (
              <div key={n._id} className="p-3 border-b hover:bg-gray-50 flex gap-3 items-start">
                <Link to={`/profile/${n.senderId?._id || n.senderId}`}>
                  <img 
                    src={n.senderId?.profilePhoto || "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"} 
                    className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                    alt=""
                  />
                </Link>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    <span className="font-bold">{n.senderId?.name || "Someone"}</span> {n.message}
                  </p>
                  
                  {n.type === "connection_request" && (
                    <div className="flex gap-2 mt-2">
                      <button 
                        onClick={() => handleAcceptRequest(n.senderId?._id || n.senderId)}
                        className="bg-purple-600 text-white text-xs px-4 py-1.5 rounded-full font-bold hover:bg-purple-700 transition-colors shadow-sm"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleRejectRequest(n.senderId?._id || n.senderId)}
                        className="text-gray-600 border border-gray-300 text-xs px-4 py-1.5 rounded-full font-bold hover:bg-gray-100 transition-colors"
                      >
                        Ignore
                      </button>
                      <Link 
                        to={`/profile/${n.senderId?._id || n.senderId}`}
                        className="text-purple-600 text-[10px] font-black uppercase tracking-wider hover:underline ml-auto flex items-center"
                        onClick={() => setShowNotifications(false)}
                      >
                        View Profile
                      </Link>
                    </div>
                  )}
                  <p className="text-[10px] text-gray-400 mt-1 font-medium">{new Date(n.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;