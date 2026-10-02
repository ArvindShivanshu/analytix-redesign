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
  const isGlidingNextRef = useRef(false);
  const prevYRef = useRef(0);

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
      // Phase 1 (2025): 0.28 - 0.56
      // Phase 2 (2025-26): 0.56 - 0.82
      // Phase 3 (2026): 0.82 - 0.95
      let calculatedIndex = 0;
      if (p < 0.28) {
        calculatedIndex = 0;
      } else if (p < 0.56) {
        calculatedIndex = 1;
      } else if (p < 0.82) {
        calculatedIndex = 2;
      } else {
        calculatedIndex = 3;
      }
      setActiveIndex(calculatedIndex);

      // Immediately move to next section after the 2026 portion ends on scroll down
      const currentY = window.pageYOffset || document.documentElement.scrollTop;
      const isScrollingDown = currentY > prevYRef.current;
      prevYRef.current = currentY;

      if (p >= 0.94 && isScrollingDown && !isGlidingNextRef.current) {
        isGlidingNextRef.current = true;
        const mandatesEl = document.getElementById('mandates');
        if (mandatesEl) {
          mandatesEl.scrollIntoView({ behavior: 'smooth' });
        }
        setTimeout(() => {
          isGlidingNextRef.current = false;
        }, 800);
      }
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
        <div className="container-custom" style={{ width: '100%', maxWidth: '1150px' }}>
          {/* Section Header */}
          <div className="timeline-header-compact">
            <span className="section-tag">Engineering Evolution</span>
            <h2 className="timeline-title-compact">Development Timeline Corridor</h2>
          </div>

          {/* Continuous Scroll Progress Scrubber Bar */}
          <div className="timeline-scrubber-wrap">
            <div className="timeline-scrubber-track">
              <div
                className="timeline-scrubber-fill"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
            <div className="timeline-scrubber-phases">
              {TIMELINE_PHASES.map((p, idx) => (
                <button
                  key={p.year}
                  onClick={() => scrollToPhase(idx)}
                  className={`timeline-scrubber-node ${idx === activeIndex ? 'active' : ''} ${idx < activeIndex ? 'completed' : ''}`}
                >
                  <span className="node-dot" />
                  <span className="node-year">{p.year}</span>
                  <span className="node-label">{p.phase}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3D Perspective Stage */}
          <div className="aaruush-timeline-stage timeline-interactive-card">
            {/* Neon Perspective Runway Background */}
            <div className="timeline-perspective-runway">
              <div className="runway-grid-lines" />
            </div>

            {/* Floating Year Watermark on Right */}
            <div className="timeline-floating-year">
              <span className="timeline-huge-year">{activePhase.year}</span>
              <div className="timeline-year-line">
                <span className="line-bar" />
                <span className="line-dot" />
              </div>
              <span className="timeline-phase-tag">{activePhase.phase}</span>
            </div>

            {/* Continuous Horizontal Filmstrip Carousel Track */}
            <div className="timeline-cards-strip">
              <div className="sprocket-track left" />

              <div className="timeline-carousel-viewport">
                <div
                  className="timeline-carousel-track"
                  style={{
                    transform: `translateX(-${activeIndex * 100}%)`,
                  }}
                >
                  {TIMELINE_PHASES.map((phase) => (
                    <div key={phase.phase} className="timeline-phase-slide">
                      <div className="timeline-cards-grid">
                        {phase.cards.map((card, cIdx) => (
                          <div key={cIdx} className="timeline-film-card">
                            <div className="film-card-image-wrap">
                              <img src={card.src} alt={card.title} loading="lazy" />
                              <div className="film-card-shadow" />
                              <div className="film-card-arrow-marker" />
                            </div>
                            <div className="film-card-caption">
                              <h5 className="film-card-title">{card.title}</h5>
                              <p className="film-card-text">{card.caption}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sprocket-track right" />
            </div>

            {/* Active Phase Narrative HUD Panel */}
            <div className="timeline-narrative-hud">
              <div className="timeline-hud-tag">
                {activePhase.tag} • {activePhase.phase}
              </div>
              <h4 className="timeline-hud-title">{activePhase.title}</h4>
              <p className="timeline-hud-desc">{activePhase.desc}</p>

              {/* Stepper Controls & Manual Fallback */}
              <div className="timeline-controls-row">
                <button
                  onClick={handlePrev}
                  className="btn-timeline-nav"
                  disabled={activeIndex === 0}
                  aria-label="Previous Phase"
                >
                  <ChevronLeft size={16} />
                  <span>Prev</span>
                </button>
                <div className="timeline-step-indicator">
                  {TIMELINE_PHASES.map((_, i) => (
                    <span
                      key={i}
                      onClick={() => scrollToPhase(i)}
                      className={`step-dot ${i === activeIndex ? 'active' : ''}`}
                      title={`Jump to Phase 0${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={handleNext}
                  className="btn-timeline-nav"
                  aria-label="Next Phase"
                >
                  <span>{activeIndex === TIMELINE_PHASES.length - 1 ? 'Mandates' : 'Next'}</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Scroll Cue */}
          <div className="timeline-bottom-scroll-cue">
            {activeIndex === 3 ? (
              <button
                onClick={scrollToMandates}
                className="timeline-next-mandates-btn"
                title="Immediately proceed to Challenge Mandates"
              >
                <span>CHALLENGE MANDATES NEXT</span>
                <ArrowDown size={14} className="cue-arrow" />
              </button>
            ) : (
              <>
                <span className="cue-dot" />
                <span className="cue-msg">
                  SCROLL DOWN TO ADVANCE PHASES ({activeIndex + 1}/4) • NEXT: {TIMELINE_PHASES[activeIndex + 1].phase}
                </span>
                <ArrowDown size={14} className="cue-arrow" />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
