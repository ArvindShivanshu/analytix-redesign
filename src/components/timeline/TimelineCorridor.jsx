import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowDown } from 'lucide-react';

export const TIMELINE_PHASES = [
  {
    year: '2024',
    phase: 'PHASE 01',
    title: 'Kinematic Incline & Gravity Feeder Research',
    desc: 'Calibrated optimal 45.0° slope and PTFE coating to prevent tumbling and maintain repeatable 0.85 m/s velocity.',
    tag: 'SAMBED Kinematics Baseline',
    cards: [
      {
        src: '/stock/img4.png',
        title: 'Gravity Feeder Hopper',
        caption: 'CAD tolerance modeling for zero-jam box stacking.',
      },
      {
        src: '/stock/img3.png',
        title: '45.0° Incline Chute',
        caption: 'Laser-cut acrylic slide with low-friction surface.',
      },
      {
        src: '/stock/gal4.jpg',
        title: 'Robotics Lab Prototype',
        caption: 'Initial structural framing on aluminum extrusions.',
      },
    ],
  },
  {
    year: '2025',
    phase: 'PHASE 02',
    title: 'Computer Vision & Multi-Spectral Feature Engine',
    desc: 'Engineered SIFT, ORB and FLANN pipeline classifying 12 logo-color combinations in under 12ms.',
    tag: 'SIESED Vision Engineering',
    cards: [
      {
        src: '/stock/IMG5.png',
        title: 'SIFT Feature Clustering',
        caption: 'Keypoint distribution under motion-blur conditions.',
      },
      {
        src: '/stock/gal2.jpg',
        title: '5500K Ring Diffuser',
        caption: 'Uniform white-point optical calibration gantry.',
      },
      {
        src: '/stock/gal5.jpg',
        title: '12-Item Matrix Tiles',
        caption: 'Printed benchmark batch validation under 120 FPS.',
      },
    ],
  },
  {
    year: '2025-26',
    phase: 'PHASE 03',
    title: 'Embedded Avionics & Rapid Sub-35ms Flap Actuation',
    desc: 'Linked Python vision decisions to Arduino Uno via 115200 baud UART, triggering 32ms servo deflection.',
    tag: 'SPACED Embedded Control',
    cards: [
      {
        src: '/stock/img2.png',
        title: 'UART Microcontroller Rig',
        caption: '115200 baud optocoupled motor driver interface.',
      },
      {
        src: '/stock/gal3.jpg',
        title: 'Servo Oscilloscope Trace',
        caption: 'Verification of 32ms trapdoor flap deflection response.',
      },
      {
        src: '/stock/sergobot.png',
        title: 'Integrated Sorter Rig',
        caption: 'Complete structural marriage of kinematics and vision.',
      },
    ],
  },
  {
    year: '2026',
    phase: 'PHASE 04',
    title: 'Robocon Tournament Verification & Autonomous Run',
    desc: 'Demonstrated continuous autonomous sorting in tournament trials, achieving 99.4% target isolation accuracy.',
    tag: 'Tournament Arena Deployment',
    cards: [
      {
        src: '/stock/gal1.jpg',
        title: 'Proving Arena Run',
        caption: 'High-speed continuous box feed test in Robocon arena.',
      },
      {
        src: '/stock/gal6.jpg',
        title: '100-Cycle Endurance',
        caption: 'Zero jam failures recorded across continuous operations.',
      },
      {
        src: '/stock/mainlogo.png',
        title: 'AnalytiX Insignia',
        caption: 'Official division insignia for SRM Team Robocon.',
      },
    ],
  },
];

export default function TimelineCorridor() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const trackRef = useRef(null);

  const activePhase = TIMELINE_PHASES[activeIndex];

  // Silky-Smooth Scroll-Driven Phase Switching Engine
  useEffect(() => {
    const handleTimelineScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const maxScroll = rect.height - window.innerHeight;
      if (maxScroll <= 0) return;

      // Progress p strictly between 0 and 1
      const p = Math.max(0, Math.min(1, -rect.top / maxScroll));
      setScrollProgress(p);

      // Quantize 4 phases evenly along the scroll path:
      // Phase 0 (2024): 0.00 - 0.28
      // Phase 1 (2025): 0.28 - 0.54
      // Phase 2 (2025-26): 0.54 - 0.78
      // Phase 3 (2026): 0.78 - 1.00
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
      setActiveIndex(calculatedIndex);
    };

    window.addEventListener('scroll', handleTimelineScroll, { passive: true });
    handleTimelineScroll();
    return () => window.removeEventListener('scroll', handleTimelineScroll);
  }, []);

  // Jump to specific phase on click
  const scrollToPhase = (targetIdx) => {
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

  const handleNext = () => {
    if (activeIndex === TIMELINE_PHASES.length - 1) {
      const mandatesEl = document.getElementById('mandates');
      if (mandatesEl) mandatesEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      scrollToPhase(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    const prevIdx = Math.max(0, activeIndex - 1);
    scrollToPhase(prevIdx);
  };

  const scrollToMandates = () => {
    const mandatesEl = document.getElementById('mandates');
    if (mandatesEl) {
      mandatesEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="timeline" ref={trackRef} className="timeline-scroll-track" style={{ height: '220vh', position: 'relative' }}>
      {/* Sticky Fullscreen Stage */}
      <div className="timeline-sticky-stage">
        <div className="container-custom timeline-container-inner">
          {/* Section Header */}
          <div className="section-header timeline-header-aligned">
            <span className="section-tag">Engineering Evolution</span>
            <h2 className="section-title">Development Timeline</h2>
            <div className="aaruush-divider">
              <span className="aaruush-divider-line" />
              <span className="aaruush-divider-dot" />
              <span className="aaruush-divider-line" style={{ transform: 'rotate(180deg)' }} />
            </div>
            <p className="section-desc">
              Explore the milestone progression of SEGROBOT from kinematics simulation to full tournament autonomous sorting.
            </p>
          </div>

          {/* Phase Navigation Pills */}
          <div className="timeline-nav-pills">
            {TIMELINE_PHASES.map((p, idx) => (
              <button
                key={p.year}
                onClick={() => scrollToPhase(idx)}
                className={`timeline-nav-pill ${idx === activeIndex ? 'active' : ''}`}
              >
                <span className="timeline-pill-year">{p.year}</span>
                <span className="timeline-pill-label">{p.phase}</span>
              </button>
            ))}
          </div>

          {/* 3D Perspective Stage (Unified Zero-Overlap Architecture) */}
          <div className="aaruush-timeline-stage">
            {/* Neon Perspective Runway Background */}
            <div className="timeline-perspective-runway">
              <div className="runway-grid-lines" />
            </div>

            {/* Stage Top Header: Narrative & Year Display */}
            <div className="timeline-stage-header">
              <div className="timeline-stage-info">
                <div className="timeline-stage-tag-badge">
                  <span className="stage-tag-dot" />
                  <span className="stage-tag-text">{activePhase.tag}</span>
                  <span className="stage-tag-sep">•</span>
                  <span className="stage-tag-phase">{activePhase.phase}</span>
                </div>
                <h3 className="timeline-stage-title">{activePhase.title}</h3>
                <p className="timeline-stage-desc">{activePhase.desc}</p>
              </div>

              <div className="timeline-stage-year-badge">
                <span className="stage-year-num">{activePhase.year}</span>
                <div className="stage-year-line">
                  <span className="line-bar" />
                  <span className="line-dot" />
                </div>
                <span className="stage-year-label">{activePhase.phase}</span>
              </div>
            </div>

            {/* Continuous Horizontal Slide Track for 3 Showcase Cards */}
            <div className="timeline-cards-viewport">
              <div
                className="timeline-carousel-track"
                style={{
                  transform: `translateX(-${activeIndex * 100}%)`,
                }}
              >
                {TIMELINE_PHASES.map((phase) => (
                  <div key={phase.phase} className="timeline-phase-slide">
                    <div className="timeline-showcase-grid">
                      {phase.cards.map((card, cIdx) => (
                        <div key={cIdx} className="timeline-showcase-card">
                          <div className="showcase-card-media">
                            <img src={card.src} alt={card.title} loading="lazy" />
                            <div className="showcase-card-overlay" />
                            <span className="showcase-chip">M-{String(cIdx + 1).padStart(2, '0')}</span>
                          </div>
                          <div className="showcase-card-body">
                            <h5 className="showcase-card-title">{card.title}</h5>
                            <p className="showcase-card-caption">{card.caption}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage Footer Controls */}
            <div className="timeline-stage-footer">
              <button
                onClick={handlePrev}
                className="btn-timeline-stage-nav"
                disabled={activeIndex === 0}
                aria-label="Previous Phase"
              >
                <ChevronLeft size={16} />
                <span>Previous Phase</span>
              </button>

              <div className="timeline-stage-dots">
                {TIMELINE_PHASES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToPhase(i)}
                    className={`stage-dot-indicator ${i === activeIndex ? 'active' : ''}`}
                    title={`Jump to Phase 0${i + 1}`}
                    aria-label={`Jump to Phase 0${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="btn-timeline-stage-nav"
                aria-label="Next Phase"
              >
                <span>{activeIndex === TIMELINE_PHASES.length - 1 ? 'Mandates Next' : 'Next Phase'}</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Bottom Scroll Cue */}
          <div className="timeline-bottom-scroll-cue">
            <span className="cue-dot" />
            <span className="cue-msg">
              {activeIndex === 3
                ? 'SCROLL DOWN TO ADVANCE TO CHALLENGE MANDATES'
                : `SCROLL DOWN TO ADVANCE PHASES (${activeIndex + 1}/4) • NEXT: ${TIMELINE_PHASES[activeIndex + 1].phase}`}
            </span>
            <ArrowDown size={14} className="cue-arrow" />
          </div>
        </div>
      </div>
    </section>
  );
}
