import React from 'react'

const notFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-xl">Page Not Found</p>
    </div>
  )
}

export default notFound
