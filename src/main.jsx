import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ExhibitionGallery from './ExhibitionGallery.jsx'
import PresentationDetail from './PresentationDetail.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/exhibition-gallery" element={<ExhibitionGallery />} />
        <Route path="/presentation/:slug" element={<PresentationDetail />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
