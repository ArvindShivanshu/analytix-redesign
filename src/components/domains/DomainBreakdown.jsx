import React, { useState, useEffect, useRef } from 'react';
import {
  Wrench,
  Eye,
  Cpu,
  Tv,
  ChevronLeft,
  ChevronRight,
  ArrowDown
} from 'lucide-react';

const DOMAINS = [
  {
    id: 'sambed',
    title: 'SAMBED',
    subtitle: 'Kinematics & Structure',
    icon: Wrench,
    image: '/stock/img4.png',
    lead: '45.0° Incline Chute & Servo Diverter',
    description:
      'Engineered the physical sorting rig: gravity hopper feed, 45.0° PTFE slide chute, and sub-35ms servo gate diversion.',
    technicalSpecs: [
      { label: 'Slide Incline', value: '45.0° Calibrated' },
      { label: 'Descent Velocity', value: '0.85 m/s' },
      { label: 'Hopper Capacity', value: '18 Units' },
      { label: 'Flap Diverter', value: '32ms Actuation' },
    ],
  },
  {
    id: 'siesed',
    title: 'SIESED',
    subtitle: 'Computer Vision',
    icon: Eye,
    image: '/stock/IMG5.png',
    lead: 'SIFT, ORB & FLANN Real-Time Engine',
    description:
      'Multi-spectral computer vision matching logo features within 12ms with scale, rotation, and illumination invariance.',
    technicalSpecs: [
      { label: 'Camera Rate', value: '120 FPS' },
      { label: 'Match Latency', value: '12ms' },
      { label: 'Algorithms', value: 'SIFT + ORB + FLANN' },
      { label: 'Accuracy', value: '99.4% Benchmark' },
    ],
  },
  {
    id: 'spaced',
    title: 'SPACED',
    subtitle: 'Embedded Firmware',
    icon: Cpu,
    image: '/stock/img2.png',
    lead: '115200 Baud UART & Microcontroller Loop',
    description:
      'Bidirectional serial link bridging high-level Python vision decisions to Arduino Uno for sub-5ms interrupt servo firing.',
    technicalSpecs: [
      { label: 'Microcontroller', value: 'Arduino Uno' },
      { label: 'Protocol', value: 'UART @ 115200 Baud' },
      { label: 'Response Loop', value: '< 5ms Interrupt' },
      { label: 'PWM Control', value: 'Precision 50Hz' },
    ],
  },
  {
    id: 'mcsocd',
    title: 'MCSOCD',
    subtitle: 'Media & Outreach',
    icon: Tv,
    image: '/stock/mcsocd.svg',
    lead: 'Technical Documentation & Renders',
    description:
      'Engineering documentation, 3D CAD visual assets, graphic branding, and tournament documentary video for Robocon trials.',
    technicalSpecs: [
      { label: '3D Standards', value: 'SolidWorks 1:1' },
      { label: 'Affiliation', value: 'SRM Team Robocon' },
      { label: 'Media Output', value: 'CAD, Posters, Film' },
      { label: 'Telemetry UI', value: 'Real-time Web Twins' },
    ],
  },
];

export default function DomainBreakdown() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const trackRef = useRef(null);

  const activeDomain = DOMAINS[activeIdx] || DOMAINS[0];

  // Silky-Smooth Scroll-Driven Division Switching
  useEffect(() => {
    const handleSubsystemsScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const maxScroll = rect.height - window.innerHeight;
      if (maxScroll <= 0) return;

      const p = Math.max(0, Math.min(1, -rect.top / maxScroll));
      setScrollProgress(p);

      // Quantize 4 domains along the scroll path:
      // 0 (SAMBED): 0.00 - 0.28
      // 1 (SIESED): 0.28 - 0.54
      // 2 (SPACED): 0.54 - 0.78
      // 3 (MCSOCD): 0.78 - 1.00
      let calculatedIndex = 0;
      if (p < 0.28) {
        calculatedIndex = 0;
      } else if (p < 0.54) {
        calculatedIndex = 1;
      } else if (p < 0.78) {
        calculatedIndex = 2;
      } else {
        calculatedIndex = 3;
      }
      setActiveIdx(calculatedIndex);
    };

    window.addEventListener('scroll', handleSubsystemsScroll, { passive: true });
    handleSubsystemsScroll();
    return () => window.removeEventListener('scroll', handleSubsystemsScroll);
  }, []);

  // Jump to specific division on click
  const scrollToDomain = (targetIdx) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const trackTop = rect.top + scrollTop;
    const maxScroll = trackRef.current.clientHeight - window.innerHeight;

    const phaseP = [0.12, 0.42, 0.68, 0.88];
    const targetP = phaseP[targetIdx] ?? 0;

    window.scrollTo({
      top: trackTop + targetP * maxScroll,
      behavior: 'smooth',
    });
  };

  const handlePrev = () => {
    const prevIdx = Math.max(0, activeIdx - 1);
    scrollToDomain(prevIdx);
  };

  const handleNext = () => {
    if (activeIdx === DOMAINS.length - 1) {
      const faqEl = document.getElementById('faq');
      if (faqEl) faqEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      scrollToDomain(activeIdx + 1);
    }
  };

  const scrollToFaq = () => {
    const faqEl = document.getElementById('faq');
    if (faqEl) {
      faqEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="subsystems"
      ref={trackRef}
      className="subsystems-scroll-track"
      style={{ height: '220vh', position: 'relative' }}
    >
      {/* Sticky Fullscreen Stage */}
      <div className="subsystems-sticky-stage">
        <div className="container-custom subsystems-container-inner">
          {/* Section Header */}
          <div className="section-header subsystems-header-aligned">
            <span className="section-tag">Engineering Divisions</span>
            <h2 className="section-title">Subsystem Architecture</h2>
            <div className="aaruush-divider">
              <span className="aaruush-divider-line" />
              <span className="aaruush-divider-dot" />
              <span className="aaruush-divider-line" style={{ transform: 'rotate(180deg)' }} />
            </div>
            <p className="section-desc">
              Decoupled kinematics, optical vision, embedded firmware, and technical documentation.
            </p>
          </div>

          {/* Domain Navigation Tabs */}
          <div className="domains-tabs-grid">
            {DOMAINS.map((domain, idx) => {
              const Icon = domain.icon;
              const isActive = idx === activeIdx;
              return (
                <button
                  key={domain.id}
                  onClick={() => scrollToDomain(idx)}
                  className={`domain-tab-btn ${isActive ? 'active' : ''}`}
                >
                  <div className="domain-tab-icon">
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="domain-tab-title">{domain.title}</div>
                    <div className="domain-tab-sub">
                      {domain.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Domain Panel (Mission Deck) */}
          <div className="domain-active-panel">
            <div className="domain-panel-grid">
              {/* Left: Narrative & Specs */}
              <div>
                <div className="domain-narrative-tag">
                  {activeDomain.title} DIVISION • {activeDomain.subtitle}
                </div>
                <h3 className="domain-narrative-title">{activeDomain.lead}</h3>
                <p className="domain-narrative-body">{activeDomain.description}</p>

                {/* Specs Grid */}
                <div className="domain-specs-grid">
                  {activeDomain.technicalSpecs.map((spec, i) => (
                    <div key={i} className="domain-spec-cell">
                      <div className="domain-spec-label">{spec.label}</div>
                      <div className="domain-spec-val">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Prototype Visual Card */}
              <div className="domain-visual-box">
                <div className="domain-img-wrap">
                  <img
                    key={activeDomain.id}
                    src={activeDomain.image}
                    alt={activeDomain.title}
                    className="domain-preview-img"
                  />
                </div>
                <div className="domain-img-footer">
                  <span>{activeDomain.title} Subsystem</span>
                  <span style={{ color: 'var(--accent-orange)' }}>SRM Team Robocon</span>
                </div>
              </div>
            </div>

            {/* Stepper Controls Row */}
            <div className="domain-controls-row">
              <button
                onClick={handlePrev}
                className="btn-domain-nav"
                disabled={activeIdx === 0}
                aria-label="Previous Division"
              >
                <ChevronLeft size={16} />
                <span>Previous Division</span>
              </button>

              <div className="domain-step-dots">
                {DOMAINS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToDomain(i)}
                    className={`domain-dot-btn ${i === activeIdx ? 'active' : ''}`}
                    title={`Jump to ${DOMAINS[i].title}`}
                    aria-label={`Jump to ${DOMAINS[i].title}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="btn-domain-nav"
                aria-label="Next Division"
              >
                <span>{activeIdx === DOMAINS.length - 1 ? 'FAQ Next' : 'Next Division'}</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Bottom Scroll Cue */}
          <div className="subsystems-bottom-scroll-cue">
            <span className="cue-dot" />
            <span className="cue-msg">
              {activeIdx === 3
                ? 'SCROLL DOWN TO ADVANCE TO FAQ & INTELLIGENCE'
                : `SCROLL DOWN TO ADVANCE DIVISIONS (${activeIdx + 1}/4) • NEXT: ${DOMAINS[activeIdx + 1]?.title}`}
            </span>
            <ArrowDown size={14} className="cue-arrow" />
          </div>
        </div>
      </div>
    </section>
  );
}
