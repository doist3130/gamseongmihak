import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ExhibitionGallery from './ExhibitionGallery.jsx'
import PresentationDetail from './PresentationDetail.jsx'

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/exhibition-gallery" element={<ExhibitionGallery />} />
        <Route path="/presentation/:slug" element={<PresentationDetail />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
