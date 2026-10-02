import React from 'react';
import {
  Box,
  ArrowRight,
  Layers,
  Eye,
  Cpu,
  Clock
} from 'lucide-react';

export default function HeroSection({ onExploreCad, onExploreTimeline, onExploreMandates }) {
  return (
    <section className="hero-celestial">
      {/* Aaruush Solar Horizon & Nebula Flares */}
      <div className="hero-solar-backdrop" />
      <div className="hero-solar-glow" />

      {/* Aaruush Signature 3D Perspective Neon Grid Runway (Warp Corridor) */}
      <div className="hero-perspective-container">
        <div className="hero-perspective-runway">
          <div className="hero-runway-grid" />
          <div className="hero-runway-sprockets left" />
          <div className="hero-runway-sprockets right" />
        </div>
      </div>

      <div className="container-custom">
        <div className="hero-content">
          {/* Top Telemetry Brackets */}
          <div className="hero-hud-telemetry">
            <span className="telemetry-chip">[ STATUS: COMBAT READY ]</span>
            <span className="telemetry-chip">[ CV: SIFT/ORB @ 120 FPS ]</span>
            <span className="telemetry-chip">[ DIVERSION: 32MS ]</span>
          </div>

          {/* Insignia Pill Badge */}
          <div className="hero-aaruush-badge">
            <span className="hero-aaruush-badge-dot" />
            <span className="hero-aaruush-badge-text">
              Team AnalytiX • SRM Team Robocon
            </span>
          </div>

          {/* Big Solar Gradient Heading */}
          <h1 className="hero-title-gradient">SEGROBOT</h1>

          {/* Subtitle */}
          <p className="hero-subtitle-aaruush">
            Autonomous Vision-Guided Robotic Sorting System
          </p>

          {/* Aaruush Divider with glowing terminal point */}
          <div className="aaruush-divider" style={{ margin: '0 auto 1.5rem auto' }}>
            <span className="aaruush-divider-line" />
            <span className="aaruush-divider-dot" />
            <span className="aaruush-divider-line" style={{ transform: 'rotate(180deg)' }} />
          </div>

          {/* Narrative Description */}
          <p className="hero-narrative-aaruush">
            Engineered to autonomously isolate designated competitor assets under tournament conditions. Powered by a 45.0° precision gravity slide, multi-spectral SIFT & ORB computer vision feature matching, and real-time sub-35ms servo gate diversion.
          </p>

          {/* Action CTAs */}
          <div className="hero-actions-aaruush">
            <a href="#cad" onClick={onExploreCad} className="btn-aaruush-explore">
              <Box size={16} />
              <span>Explore 3D CAD</span>
            </a>

            <a href="#timeline" onClick={onExploreTimeline} className="btn-aaruush-glass">
              <Clock size={16} color="var(--accent-orange)" />
              <span>Development Timeline</span>
            </a>

            <a href="#mandates" onClick={onExploreMandates} className="btn-aaruush-glass">
              <span>Challenge Mandates</span>
              <ArrowRight size={15} color="var(--accent-orange)" />
            </a>
          </div>

          {/* Engineering Pillars Ribbon HUD */}
          <div className="hero-pillars-hud">
            <div className="pillar-hud-card">
              <div className="pillar-hud-tag">
                <Layers size={14} />
                <span>SAMBED DIVISION</span>
              </div>
              <h3 className="pillar-hud-title">Mechanical Kinematics</h3>
              <p className="pillar-hud-desc">
                45.0° low-friction acrylic slide chute with high-speed servo diversion trapdoor.
              </p>
            </div>

            <div className="pillar-hud-card">
              <div className="pillar-hud-tag">
                <Eye size={14} />
                <span>SIESED DIVISION</span>
              </div>
              <h3 className="pillar-hud-title">Computer Vision</h3>
              <p className="pillar-hud-desc">
                SIFT, ORB & FLANN multi-spectral feature detection across 12 asset matrices.
              </p>
            </div>

            <div className="pillar-hud-card">
              <div className="pillar-hud-tag">
                <Cpu size={14} />
                <span>SPACED DIVISION</span>
              </div>
              <h3 className="pillar-hud-title">Firmware & Actuation</h3>
              <p className="pillar-hud-desc">
                Sub-5ms interrupt response over 115200 baud UART linking Python to Arduino.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
