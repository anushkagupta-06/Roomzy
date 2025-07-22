import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Admin from './components/auth/Admin.jsx';
import Layout from './components/layout/Layout.jsx';
import User from './components/auth/User.jsx';
import AdminDb from './components/dashboard/AdminDb.jsx';
import UserDb from './components/dashboard/UserDb.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path='/' element={<Layout />}>
      <Route path='auth/user' element={<User />} />
      <Route path='auth/admin' element={<Admin />} />
    </Route>
    <Route path='user/dashboard' element={<UserDb />} />
    <Route path='admin/dashboard' element={<AdminDb />} />
    </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)