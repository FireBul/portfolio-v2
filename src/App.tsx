import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Leadership } from './pages/Leadership';
import { Contact } from './pages/Contact';
import { PortfolioPDF } from './pages/PortfolioPDF';
import { Chatbot } from './components/Chatbot';
import { InAppMessages } from './components/InAppMessages';
import { AnalyticsGimmick } from './components/AnalyticsGimmick';
import { MouseHeatmap } from './components/MouseHeatmap';
import { BehavioralPersona } from './components/BehavioralPersona';
import { ABTestReveal } from './components/ABTestReveal';
import { trackPageView, initScrollTracking } from './utils/analytics';

function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
}

function OverlayWidgets() {
  const { pathname } = useLocation();
  // PDF 페이지에서는 모든 오버레이 숨김
  if (pathname === '/pdf') return null;
  return (
    <>
      <InAppMessages />
      <AnalyticsGimmick />
      <MouseHeatmap />
      <BehavioralPersona />
      <ABTestReveal />
      <Chatbot />
    </>
  );
}

function App() {
  useEffect(() => {
    const cleanup = initScrollTracking();
    return cleanup;
  }, []);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <RouteTracker />
      <OverlayWidgets />
      <Routes>
        {/* PDF 전용 라우트 — Layout/Chatbot 없이 독립 렌더링 */}
        <Route path="pdf" element={<PortfolioPDF />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="leadership" element={<Leadership />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
