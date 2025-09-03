// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MoviePage from './pages/MoviePage.tsx'

const router = createBrowserRouter([
  { path: '/', element: <MoviePage defaultId={299534} /> },   // 기본 진입
  { path: '/movie/:id', element: <MoviePage /> },             // 상세 페이지
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
