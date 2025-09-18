import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar, Footer } from '../components'

const MainLayout = () => {

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default MainLayout
