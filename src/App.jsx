import React from 'react'
import Navbar from './Components/Home/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './Components/Home/Home'
import Discover from './Components/Discover/Discover'
import Communities from './Components/Communities/Communities'
import Profile from './Components/Profile/Profile'
import ProtectedRoute from './ProtectedRoute/ProtectedRoute'
import SignIn from './Components/Home/SignIn'
import Login from './Components/Home/Login'
import Post from './Components/Post/Post'
import NotFound from './Components/Home/notFound'


const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<SignIn />} />
        <Route path='/login' element={<Login/>}/>
        <Route
          path='/Discover'
          element={
            // <ProtectedRoute>
              <Discover />
            // </ProtectedRoute>
          }
        />
        <Route
          path='/Communities'
          element={
            <ProtectedRoute>
              <Communities />
            </ProtectedRoute>
          }
        />
        <Route path='/Post'
        element={
         
            <Post/>
         
        }
        />
        <Route
          path='/Profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </div>
  )
}

export default App
