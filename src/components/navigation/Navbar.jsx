import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Layers
} from 'lucide-react';

export default function Navbar({ currentTheme, onToggleTheme, onNavigateCad }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('cad');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Active Section Spy
      const sections = ['cad', 'timeline', 'mandates', 'subsystems', 'team', 'gallery', 'faq'];
      const scrollPos = window.scrollY + 140;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'cad', label: '3D CAD' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'mandates', label: 'Mandates' },
    { id: 'subsystems', label: 'Subsystems' },
    { id: 'team', label: 'Team' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'faq', label: 'FAQ' },
  ];

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (targetId === 'cad' && onNavigateCad) {
      onNavigateCad();
      return;
    }
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`aaruush-nav ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container-wrapper">
        <div className="nav-bar-inner">
          {/* Authentic Clean Brand Lockup (No clunky AI boxes) */}
          <a
            href="#cad"
            onClick={(e) => handleNavClick(e, 'cad')}
            className="nav-brand-lockup"
            aria-label="Team AnalytiX Home"
          >
            <img src="/stock/facicon.png" alt="AnalytiX" className="nav-brand-icon" />
            <div className="nav-brand-meta">
              <span className="nav-brand-name">TEAM ANALYTIX</span>
              <span className="nav-brand-sep" />
              <span className="nav-brand-sub">SRM ROBOCON</span>
            </div>
          </a>

          {/* Aaruush.org Signature Center Floating Capsule */}
          <nav className="aaruush-center-dock" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`aaruush-dock-link ${isActive ? 'active' : ''}`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="dock-link-dot" />}
                </a>
              );
            })}
          </nav>

          {/* Right Action Elements (Aaruush.org Frosted Glass Design) */}
          <div className="nav-right-actions">
            {/* Technical Blueprint Toggle Pill */}
            <button
              onClick={onToggleTheme}
              className="aaruush-util-btn"
              title={currentTheme === 'blueprint' ? 'Switch to Dark Void' : 'Technical Blueprint Mode'}
              aria-label="Toggle Blueprint Mode"
            >
              <Layers size={15} />
            </button>

            {/* Aaruush Signature Primary Frosted Action Button */}
            <div className="nav-action-lockup">
              <a
                href="#cad"
                onClick={(e) => handleNavClick(e, 'cad')}
                className="aaruush-primary-btn"
              >
                <span className="nav-pulse-beacon" />
                <span>SEGROBOT CAD</span>
              </a>
              <span className="nav-action-tag">*SRM ROBOCON &#x27;25</span>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="aaruush-mobile-btn"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="aaruush-mobile-drawer">
          <div className="mobile-drawer-inner">
            <span className="mobile-drawer-label">// NAVIGATION INDEX</span>
            <div className="mobile-links-list">
              {navLinks.map((link, idx) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={(e) => handleNavClick(e, link.id)}
                    className={`mobile-drawer-link ${isActive ? 'active' : ''}`}
                  >
                    <span className="mobile-link-idx">0{idx + 1}</span>
                    <span className="mobile-link-text">{link.label}</span>
                    {isActive && <span className="mobile-active-tag">LIVE</span>}
                  </a>
                );
              })}
            </div>

            <div className="mobile-drawer-footer">
              <button
                onClick={() => {
                  onToggleTheme();
                  setMobileMenuOpen(false);
                }}
                className="mobile-util-btn"
              >
                <Layers size={14} />
                <span>{currentTheme === 'blueprint' ? 'Dark Void' : 'Blueprint Mode'}</span>
              </button>
              <a
                href="#cad"
                onClick={(e) => handleNavClick(e, 'cad')}
                className="mobile-primary-btn"
              >
                <span className="nav-pulse-beacon" />
                <span>Open 3D CAD</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
