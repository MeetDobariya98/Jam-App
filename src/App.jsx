import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './Components/Home/Navbar'
import Home from './Components/Home/Home'
import Discover from './Components/Discover/Discover'
import Communities from './Components/Communities/Communities'
import Profile from './Components/Profile/Profile'
import Messages from './Components/Messages/Messages'
import SignIn from './Components/Home/SignIn'
import Login from './Components/Home/Login'
import Post from './Components/Post/Post'
import NotFound from './Components/Home/notFound'
import Feed from './Components/Home/Feed'
import ForgotPassword from './Components/Home/ForgotPassword'

// Admin imports
import AdminLogin from './Components/Admin/AdminLogin'
import AdminLayout from './Components/Admin/AdminLayout'
import AdminDashboard from './Components/Admin/AdminDashboard'
import AdminUsers from './Components/Admin/AdminUsers'
import AdminPosts from './Components/Admin/AdminPosts'
import AdminCommunities from './Components/Admin/AdminCommunities'
import AdminReports from './Components/Admin/AdminReports'
import AdminActivityLog from './Components/Admin/AdminActivityLog'

const ADMIN_BASE = '/jam-admin-x7k'

const App = () => {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith(ADMIN_BASE)

  return (
    <div>
      {/* Hide regular navbar on all admin pages */}
      {!isAdmin && <Navbar />}
      <Routes>
        {/* ── Regular App Routes ── */}
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<SignIn />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/discover' element={<Discover />} />
        <Route path='/Communities' element={<Communities />} />
        <Route path='/Post' element={<Post />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/Profile' element={<Profile />} />
        <Route path='/Profile/:id' element={<Profile />} />
        <Route path='/messages' element={<Messages />} />

        {/* ── Secret Admin Routes ── */}
        <Route path={ADMIN_BASE} element={<AdminLogin />} />
        <Route path={`${ADMIN_BASE}/dashboard`} element={
          <AdminLayout><AdminDashboard /></AdminLayout>
        } />
        <Route path={`${ADMIN_BASE}/users`} element={
          <AdminLayout><AdminUsers /></AdminLayout>
        } />
        <Route path={`${ADMIN_BASE}/posts`} element={
          <AdminLayout><AdminPosts /></AdminLayout>
        } />
        <Route path={`${ADMIN_BASE}/communities`} element={
          <AdminLayout><AdminCommunities /></AdminLayout>
        } />
        <Route path={`${ADMIN_BASE}/reports`} element={
          <AdminLayout><AdminReports /></AdminLayout>
        } />
        <Route path={`${ADMIN_BASE}/activity`} element={
          <AdminLayout><AdminActivityLog /></AdminLayout>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
