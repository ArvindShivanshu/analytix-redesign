import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Layers, Award, Cpu, ShieldCheck } from 'lucide-react';

const TIMELINE_PHASES = [
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
  const activePhase = TIMELINE_PHASES[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TIMELINE_PHASES.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + TIMELINE_PHASES.length) % TIMELINE_PHASES.length);
  };

  return (
    <section id="timeline" className="portal-section aaruush-timeline-section">
      <div className="container-custom">
        {/* Section Header */}
        <div className="section-header">
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
              onClick={() => setActiveIndex(idx)}
              className={`timeline-nav-pill ${idx === activeIndex ? 'active' : ''}`}
            >
              <span className="timeline-pill-year">{p.year}</span>
              <span className="timeline-pill-label">{p.phase}</span>
            </button>
          ))}
        </div>

        {/* Aaruush 3D Perspective Stage */}
        <div className="aaruush-timeline-stage">
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

          {/* 3-Card Filmstrip Showcase (Iconic Aaruush Layout) */}
          <div className="timeline-cards-strip">
            {/* Sprocket Holes on Left */}
            <div className="sprocket-track left" />

            <div className="timeline-cards-grid">
              {activePhase.cards.map((card, cIdx) => (
                <div key={cIdx} className="timeline-film-card">
                  <div className="film-card-image-wrap">
                    <img src={card.src} alt={card.title} />
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

            {/* Sprocket Holes on Right */}
            <div className="sprocket-track right" />
          </div>

          {/* Active Phase Narrative HUD Panel */}
          <div className="timeline-narrative-hud">
            <div className="timeline-hud-tag">
              {activePhase.tag} • {activePhase.phase}
            </div>
            <h4 className="timeline-hud-title">{activePhase.title}</h4>
            <p className="timeline-hud-desc">{activePhase.desc}</p>

            {/* Stepper Controls */}
            <div className="timeline-controls-row">
              <button
                onClick={handlePrev}
                className="btn-timeline-nav"
                aria-label="Previous Phase"
              >
                <ChevronLeft size={18} />
                <span>Previous Phase</span>
              </button>
              <div className="timeline-step-indicator">
                {TIMELINE_PHASES.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`step-dot ${i === activeIndex ? 'active' : ''}`}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                className="btn-timeline-nav"
                aria-label="Next Phase"
              >
                <span>Next Phase</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
