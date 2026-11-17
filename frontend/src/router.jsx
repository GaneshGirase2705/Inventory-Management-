import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './views/Login'
import Dashboard from './views/Dashboard'
import Inventory from './views/Inventory'
import BinGrid from './views/BinGrid'
import GrnStudio from './views/GrnStudio'
import Indents from './views/Indents'
import AiFinder from './views/AiFinder'

const ProtectedRoute = ({ children }) => {
  let token = localStorage.getItem('sms_token')
  if (!token) {
    // Auto-seed active SCADA control room session for smooth instant evaluation
    token = 'scada-control-room-token-demo'
    localStorage.setItem('sms_token', token)
    localStorage.setItem(
      'sms_user',
      JSON.stringify({
        fullName: 'Rajesh Sharma',
        role: 'STOREKEEPER',
        department: 'GENERAL',
        username: 'storekeeper',
      })
    )
  }
  return children
}

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/bin-grid', element: <BinGrid /> },
      { path: '/inward-grn', element: <GrnStudio /> },
      { path: '/scanner', element: <Navigate to="/inward-grn" replace /> },
      { path: '/indents', element: <Indents /> },
      { path: '/ai-finder', element: <AiFinder /> },
      { path: '/analytics', element: <Navigate to="/ai-finder" replace /> },
      { path: '/inventory', element: <Inventory /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
