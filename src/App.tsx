import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Leadership } from './pages/Leadership';
import { Contact } from './pages/Contact';
import { Chatbot } from './components/Chatbot';
import { InAppMessages } from './components/InAppMessages';
import { AnalyticsGimmick } from './components/AnalyticsGimmick';
import { trackPageView, initScrollTracking } from './utils/analytics';

function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
}

function App() {
  useEffect(() => {
    const cleanup = initScrollTracking();
    return cleanup;
  }, []);

  return (
    <BrowserRouter>
      <RouteTracker />
      <InAppMessages />
      <AnalyticsGimmick />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="leadership" element={<Leadership />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
      <Chatbot />
    </BrowserRouter>
  );
}

export default App;
