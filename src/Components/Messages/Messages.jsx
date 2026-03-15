import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URLS } from "../../api";
import { FaPaperPlane, FaMusic, FaSearch, FaChevronLeft, FaCircle } from "react-icons/fa";

const Messages = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentUser, setCurrentUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(location.state?.selectedUser || null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [allConnections, setAllConnections] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setCurrentUser(parsed);
            setUserId(parsed.id || parsed._id);
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const loadData = async () => {
        if (!userId) return;
        try {
            // Load Conversations
            const convRes = await fetch(API_URLS.messages.conversations(userId));
            const convData = await convRes.json();
            if (Array.isArray(convData)) setConversations(convData);

            // Load all connections for searching new people to message
            const userRes = await fetch(API_URLS.users.profile(userId));
            const userData = await userRes.json();
            if (userData.connections) setAllConnections(userData.connections);

            setLoading(false);
        } catch (err) {
            console.error("Load messages error: ", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!userId) return;

        loadData();
        const interval = setInterval(loadData, 5000); 
        return () => clearInterval(interval);
    }, [userId]);

    const loadChatHistory = async (otherUserId) => {
        if (!userId) return;
        try {
            const res = await fetch(API_URLS.messages.history(userId, otherUserId));
            const data = await res.json();
            if (Array.isArray(data)) setMessages(data);
            
            // Mark read
            await fetch(API_URLS.messages.markRead(userId, otherUserId), { method: "PUT" });
            
            // Reload conversations to update unread status in sidebar
            const convRes = await fetch(API_URLS.messages.conversations(userId));
            const convData = await convRes.json();
            if (Array.isArray(convData)) setConversations(convData);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (selectedUser && userId) {
            loadChatHistory(selectedUser._id);
            const interval = setInterval(() => loadChatHistory(selectedUser._id), 3000);
            return () => clearInterval(interval);
        }
    }, [selectedUser, userId]);

    useEffect(scrollToBottom, [messages]);

    const filteredConnections = searchQuery.trim() === "" 
        ? [] 
        : allConnections.filter(conn => 
            conn.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            conn.lastname.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const startChat = (user) => {
        setSelectedUser(user);
        setSearchQuery("");
        loadChatHistory(user._id);
    };

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            const res = await fetch(API_URLS.messages.send, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sender: userId,
                    receiver: selectedUser._id,
                    text: newMessage
                })
            });
            if (res.ok) {
                setNewMessage("");
                loadChatHistory(selectedUser._id);
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-gray-900 text-purple-500 font-bold text-xl tracking-widest animate-pulse">SETTING UP STUDIO...</div>;

    return (
        <div className="h-[calc(100vh-64px)] bg-[#0f172a] flex overflow-hidden">
            {/* Conversations Sidebar */}
            <div className={`w-full md:w-80 border-r border-slate-800 flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-6 border-b border-slate-800 bg-slate-900/20">
                    <h2 className="text-xl font-black text-white flex items-center gap-2 mb-4">
                        <FaMusic className="text-purple-500" /> Studio Chat
                    </h2>
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-3 text-slate-500" />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Find connection..." 
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:border-purple-500 transition-all"
                        />
                        
                        {/* Search Results Dropdown */}
                        {searchQuery && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto custom-scrollbar">
                                {filteredConnections.length > 0 ? (
                                    filteredConnections.map(conn => (
                                        <div 
                                            key={conn._id}
                                            onClick={() => startChat(conn)}
                                            className="flex items-center gap-3 p-3 hover:bg-slate-700 cursor-pointer transition-colors border-b border-slate-700 last:border-0"
                                        >
                                            <img src={conn.profilePhoto || "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"} className="w-8 h-8 rounded-full border border-slate-600" alt="" />
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-white truncate">{conn.name} {conn.lastname}</p>
                                                <p className="text-[10px] text-slate-400 truncate">{conn.headline || "Artist"}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-xs text-slate-500 italic">No connections found.</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    <div className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Recent Sessions</div>
                    {conversations.length > 0 ? (
                        conversations.map(conv => (
                            <div 
                                key={conv.otherUserId}
                                onClick={() => { setSelectedUser(conv.user); loadChatHistory(conv.otherUserId); }}
                                className={`flex items-center gap-4 p-4 cursor-pointer transition-all border-l-4 ${selectedUser?._id === conv.otherUserId ? 'bg-purple-600/10 border-purple-500' : 'hover:bg-slate-800/50 border-transparent'}`}
                            >
                                <div className="relative">
                                    <img 
                                        src={conv.user.profilePhoto || "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"} 
                                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-700"
                                        alt=""
                                    />
                                    {!conv.isRead && (
                                        <FaCircle className="absolute -top-1 -right-1 text-red-500 text-[10px]" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="text-sm font-bold text-slate-100 truncate">{conv.user.name}</h3>
                                        <span className="text-[10px] text-slate-500">{new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className={`text-xs truncate ${!conv.isRead ? 'text-white font-bold' : 'text-slate-400'}`}>
                                        {conv.lastMessage}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 text-slate-500 text-sm italic p-6">
                            No active studio sessions. Connect with artists to start jamming!
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className={`flex-1 flex flex-col bg-[#0f172a] relative ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setSelectedUser(null)} className="md:hidden text-slate-400 p-2"><FaChevronLeft /></button>
                                <img 
                                    src={selectedUser.profilePhoto || "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"} 
                                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                                    alt=""
                                />
                                <div>
                                    <h3 className="text-sm font-bold text-white">{selectedUser.name} {selectedUser.lastname}</h3>
                                    <p className="text-[10px] text-purple-400 font-medium uppercase tracking-widest">{selectedUser.headline || "Artist"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            {messages.map((msg, idx) => (
                                <div 
                                    key={idx} 
                                    className={`flex ${msg.sender === userId ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[70%] p-4 rounded-2xl text-sm shadow-xl ${
                                        msg.sender === userId 
                                        ? 'bg-purple-600 text-white rounded-tr-none' 
                                        : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                                    }`}>
                                        <p className="leading-relaxed">{msg.text}</p>
                                        <span className={`text-[10px] mt-2 block opacity-50 ${msg.sender === userId ? 'text-right' : 'text-left'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-6 bg-slate-900/40 backdrop-blur-md border-t border-slate-800">
                            <form onSubmit={handleSendMessage} className="flex gap-3">
                                <input 
                                    type="text" 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your riff..." 
                                    className="flex-1 bg-slate-800 border-2 border-slate-700 rounded-2xl px-6 py-3 text-slate-100 focus:outline-none focus:border-purple-500 transition-all shadow-inner"
                                />
                                <button 
                                    type="submit"
                                    className="bg-purple-600 hover:bg-purple-500 text-white p-4 rounded-2xl transition-all shadow-lg shadow-purple-900/20 active:scale-95"
                                >
                                    <FaPaperPlane />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                        <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 border border-slate-700 shadow-2xl">
                            <FaMusic className="text-4xl text-purple-500 opacity-20" />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">Private Jam Session</h2>
                        <p className="text-slate-500 max-w-xs text-sm leading-relaxed">
                            Pick an artist from the sidebar to open a private line. Share ideas, schedule jams, and collaborate in the studio.
                        </p>
                    </div>
                )}
            </div>
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #334155;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #475569;
                }
            `}</style>
        </div>
    );
};

export default Messages;
