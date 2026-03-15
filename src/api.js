const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API_URLS = {
  auth: {
    login: `${API_BASE_URL}/api/login`,
    signup: `${API_BASE_URL}/api/signup`,
    forgotPassword: `${API_BASE_URL}/api/forgot-password`,
    verifyOtp: `${API_BASE_URL}/api/verify-otp`,
    resetPassword: `${API_BASE_URL}/api/reset-password`,
  },
  posts: {
    base: `${API_BASE_URL}/api/posts`,
    feed: `${API_BASE_URL}/api/posts/feed`,
    userPosts: (userId) => `${API_BASE_URL}/api/posts/user/${userId}`,
    like: (postId) => `${API_BASE_URL}/api/posts/${postId}/like`,
    comment: (postId) => `${API_BASE_URL}/api/posts/${postId}/comment`,
  },
  admin: {
    login: `${API_BASE_URL}/api/admin-auth/login`,
    stats: `${API_BASE_URL}/api/admin/stats`,
    users: `${API_BASE_URL}/api/admin/users`,
    posts: `${API_BASE_URL}/api/admin/posts`,
    communities: `${API_BASE_URL}/api/admin/communities`,
    reports: `${API_BASE_URL}/api/admin/reports`,
    activity: `${API_BASE_URL}/api/admin/activity`,
    block: (userId) => `${API_BASE_URL}/api/admin/users/${userId}/block`,
    unblock: (userId) => `${API_BASE_URL}/api/admin/users/${userId}/unblock`,
    deleteUser: (userId) => `${API_BASE_URL}/api/admin/users/${userId}`,
    deletePost: (postId) => `${API_BASE_URL}/api/admin/posts/${postId}`,
    deleteCommunity: (comId) => `${API_BASE_URL}/api/admin/communities/${comId}`,
    resolveReport: (reportId) => `${API_BASE_URL}/api/admin/reports/${reportId}/resolve`,
  },
  users: {
    all: `${API_BASE_URL}/api/users`,
    profile: (userId) => `${API_BASE_URL}/api/users/${userId}`,
    updateProfile: (userId) => `${API_BASE_URL}/api/users/update-profile/${userId}`,
  },
  communities: {
    base: `${API_BASE_URL}/api/communities`,
    getPosts: (comId) => `${API_BASE_URL}/api/communities/${comId}/posts`,
    join: (comId) => `${API_BASE_URL}/api/communities/${comId}/join`,
    createPost: (comId) => `${API_BASE_URL}/api/communities/${comId}/post`,
  },
  messages: {
    base: `${API_BASE_URL}/api/messages`,
    conversations: (userId) => `${API_BASE_URL}/api/messages/conversations/${userId}`,
    history: (senderId, receiverId) => `${API_BASE_URL}/api/messages/history/${senderId}/${receiverId}`,
    send: `${API_BASE_URL}/api/messages/send`,
    markRead: (senderId, receiverId) => `${API_BASE_URL}/api/messages/mark-read/${senderId}/${receiverId}`,
  },
  connections: {
    base: `${API_BASE_URL}/api/connections`,
    status: (targetId) => `${API_BASE_URL}/api/connections/status/${targetId}`,
    follow: (targetId) => `${API_BASE_URL}/api/connections/follow/${targetId}`,
    accept: (requesterId) => `${API_BASE_URL}/api/connections/accept/${requesterId}`,
    reject: (requesterId) => `${API_BASE_URL}/api/connections/reject/${requesterId}`,
  },
  notifications: {
    base: (userId) => `${API_BASE_URL}/api/notifications/${userId}`,
    markRead: (userId) => `${API_BASE_URL}/api/notifications/mark-read/${userId}`,
    sent: (userId) => `${API_BASE_URL}/api/notifications/sent/${userId}`,
    markAllRead: (userId) => `${API_BASE_URL}/api/notifications/mark-read/${userId}`,
  }
};

export default API_BASE_URL;
