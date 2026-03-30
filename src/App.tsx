import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { PortfolioProvider } from './context/PortfolioContext';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Works from './pages/Works';
import WorkDetail from './pages/WorkDetail';
import About from './pages/About';
import Inquiry from './pages/Inquiry';
import ThankYou from './pages/ThankYou';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <LanguageProvider>
      <PortfolioProvider>
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/works" element={<Works />} />
                <Route path="/works/:slug" element={<WorkDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Inquiry />} />
                <Route path="/inquiry" element={<Inquiry />} />
                <Route path="/thank-you" element={<ThankYou />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </PortfolioProvider>
    </LanguageProvider>
  );
}
