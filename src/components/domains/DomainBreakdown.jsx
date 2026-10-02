import React, { useState } from 'react';
import {
  Wrench,
  Eye,
  Cpu,
  Tv,
  CheckCircle2
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
  const [activeDomainId, setActiveDomainId] = useState('sambed');
  const activeDomain = DOMAINS.find((d) => d.id === activeDomainId) || DOMAINS[0];

  return (
    <section id="subsystems" className="portal-section">
      <div className="container-custom">
        {/* Section Header */}
        <div className="section-header">
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
          {DOMAINS.map((domain) => {
            const Icon = domain.icon;
            const isActive = domain.id === activeDomainId;
            return (
              <button
                key={domain.id}
                onClick={() => setActiveDomainId(domain.id)}
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

        {/* Active Domain Panel */}
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
                <img src={activeDomain.image} alt={activeDomain.title} />
              </div>
              <div className="domain-img-footer">
                <span>{activeDomain.title} Subsystem</span>
                <span style={{ color: 'var(--accent-orange)' }}>SRM Team Robocon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
