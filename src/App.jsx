import React, { useState, useEffect } from 'react';
import Preloader from './components/common/Preloader';
import ScrollProgressBar from './components/common/ScrollProgressBar';
import Navbar from './components/navigation/Navbar';
import HeroCadScrollExperience from './components/cad/HeroCadScrollExperience';
import TimelineCorridor from './components/timeline/TimelineCorridor';
import MandatesSection from './components/mandates/MandatesSection';
import DomainBreakdown from './components/domains/DomainBreakdown';
import FaqSection from './components/faq/FaqSection';
import TeamSection from './components/team/TeamSection';
import MediaSection from './components/gallery/MediaSection';
import Footer from './components/footer/Footer';

export default function App() {
  const [theme, setTheme] = useState('dark'); // 'dark' | 'blueprint'

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'blueprint' : 'dark'));
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-root">
      {/* Aaruush Style Boot Preloader */}
      <Preloader />

      {/* Top Neon Scroll Progress Line */}
      <ScrollProgressBar />

      {/* Aaruush Floating Pill Navbar */}
      <Navbar
        currentTheme={theme}
        onToggleTheme={toggleTheme}
        onNavigateCad={() => scrollToSection('cad')}
      />

      <main>
        {/* Centerpiece: 3D CAD Assembly Scroll Experience */}
        <section id="cad">
          <HeroCadScrollExperience
            onExploreTimeline={() => scrollToSection('timeline')}
            onExploreMandates={() => scrollToSection('mandates')}
          />
        </section>

        {/* 3D Perspective Development Timeline Corridor */}
        <TimelineCorridor />

        {/* Challenge Mandates & 12-Item Matrix */}
        <MandatesSection />

        {/* Subsystem Architecture (Division Pills) */}
        <DomainBreakdown />

        {/* Aaruush Signature Glass Pill FAQ Accordion */}
        <FaqSection />

        {/* Team AnalytiX Engineers Roster */}
        <TeamSection />

        {/* Media & Photographic Gallery */}
        <MediaSection />
      </main>

      {/* Aaruush Giant Outline Watermark Footer */}
      <Footer onScrollTop={scrollToTop} />
    </div>
  );
}
