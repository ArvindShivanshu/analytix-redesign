import React, { useEffect, useRef } from 'react';
import {
  Archive,
  BarChart2,
  CheckCircle2,
  ArrowDown
} from 'lucide-react';

export default function MandatesSection() {
  const sectionRef = useRef(null);
  const isGlidingRef = useRef(false);
  const prevYRef = useRef(0);

  // Immediately advance to next section (#subsystems) when scrolling down from mandates
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const currentY = window.pageYOffset || document.documentElement.scrollTop;
      const isScrollingDown = currentY > prevYRef.current;
      prevYRef.current = currentY;

      // When user is viewing mandates and scrolls downward:
      if (rect.top <= 100 && rect.bottom > 200 && isScrollingDown && !isGlidingRef.current) {
        isGlidingRef.current = true;
        const subsystemsEl = document.getElementById('subsystems');
        if (subsystemsEl) {
          subsystemsEl.scrollIntoView({ behavior: 'smooth' });
        }
        setTimeout(() => {
          isGlidingRef.current = false;
        }, 900);
      }
    };

    const handleWheel = (e) => {
      if (e.deltaY > 15 && !isGlidingRef.current) {
        const rect = sectionRef.current?.getBoundingClientRect();
        if (rect && rect.top <= 100 && rect.bottom > 200) {
          isGlidingRef.current = true;
          const subsystemsEl = document.getElementById('subsystems');
          if (subsystemsEl) {
            subsystemsEl.scrollIntoView({ behavior: 'smooth' });
          }
          setTimeout(() => {
            isGlidingRef.current = false;
          }, 900);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const scrollToSubsystems = () => {
    const el = document.getElementById('subsystems');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="mandates" ref={sectionRef} className="portal-section mandates-section">
      <div className="container-custom">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">Tournament Specification</span>
          <h2 className="section-title">Core Challenge Mandates</h2>
          <div className="aaruush-divider">
            <span className="aaruush-divider-line" />
            <span className="aaruush-divider-dot" />
            <span className="aaruush-divider-line" style={{ transform: 'rotate(180deg)' }} />
          </div>
          <p className="section-desc">
            Dual operational directives: physical target isolation and real-time brand telemetry.
          </p>
        </div>

        {/* Dual Core Mandates Grid */}
        <div className="mandates-grid">
          {/* Mandate 1: Extract & Archive */}
          <div className="mandate-card">
            <div>
              <div className="mandate-top">
                <div className="mandate-icon-box">
                  <Archive size={20} />
                </div>
                <span className="mandate-pill orange">MANDATE 01</span>
              </div>

              <h3 className="mandate-card-title">Extract & Archive</h3>
              <p className="mandate-card-sub">
                Autonomous Target Isolation
              </p>
              <p className="mandate-card-body">
                Autonomously isolates designated <strong style={{ color: '#ffffff' }}>“Key Competitor”</strong> units. The 32ms servo trapdoor diverts target packages into the quarantine vault.
              </p>

              <div className="mandate-checklist">
                <div className="mandate-check-item">
                  <CheckCircle2 size={16} color="var(--accent-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>32ms servo diversion prevents downstream jamming</span>
                </div>
                <div className="mandate-check-item">
                  <CheckCircle2 size={16} color="var(--accent-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>45.0° slide delivers steady 0.85 m/s velocity</span>
                </div>
              </div>
            </div>

            <div className="mandate-bottom-bar">
              Actuation: High-torque coreless micro-servo driving CNC flap.
            </div>
          </div>

          {/* Mandate 2: Market-Scan & Report */}
          <div className="mandate-card">
            <div>
              <div className="mandate-top">
                <div className="mandate-icon-box" style={{ color: 'var(--accent-gold)', borderColor: 'rgba(198, 197, 1, 0.35)', background: 'rgba(198, 197, 1, 0.12)' }}>
                  <BarChart2 size={20} />
                </div>
                <span className="mandate-pill gold">MANDATE 02</span>
              </div>

              <h3 className="mandate-card-title">Market-Scan & Report</h3>
              <p className="mandate-card-sub" style={{ color: 'var(--accent-gold)' }}>
                12-Combination Brand Matrix Telemetry
              </p>
              <p className="mandate-card-body">
                Logs every logo-color combination in real time to deliver complete statistical visibility of market brand presence.
              </p>

              <div className="mandate-checklist">
                <div className="mandate-check-item">
                  <CheckCircle2 size={16} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>12ms SIFT & ORB feature matching immune to tilt</span>
                </div>
                <div className="mandate-check-item">
                  <CheckCircle2 size={16} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Real-time Python-to-Arduino UART telemetry logging</span>
                </div>
              </div>
            </div>

            <div className="mandate-bottom-bar">
              Pipeline: SIFT keypoints + FLANN KD-tree nearest neighbor matching.
            </div>
          </div>
        </div>

        {/* 12-Item Matrix Specification Visualizer */}
        <div className="matrix-container">
          <div className="matrix-header">
            <div>
              <h3 className="matrix-title">Asset Specification Matrix</h3>
              <p className="matrix-sub">
                4 corporate logos presented across 3 distinct background campaign colorways.
              </p>
            </div>
            <span className="matrix-badge">12 Variations</span>
          </div>

          <div className="matrix-grid">
            {[
              {
                brand: 'Company A (Target)',
                badge: 'Target for Isolation',
                badgeClass: 'target',
                colors: ['#ef4444', '#eab308', '#3b82f6'],
                desc: 'Diverted via 32ms servo trapdoor into quarantine vault.',
              },
              {
                brand: 'Company B',
                badge: 'Standard Stream',
                badgeClass: 'standard',
                colors: ['#ef4444', '#eab308', '#3b82f6'],
                desc: 'Tallied in presence log; glides to standard collection.',
              },
              {
                brand: 'Company C',
                badge: 'Standard Stream',
                badgeClass: 'standard',
                colors: ['#ef4444', '#eab308', '#3b82f6'],
                desc: 'Tallied in presence log; glides to standard collection.',
              },
              {
                brand: 'Company D',
                badge: 'Standard Stream',
                badgeClass: 'standard',
                colors: ['#ef4444', '#eab308', '#3b82f6'],
                desc: 'Tallied in presence log; glides to standard collection.',
              },
            ].map((item, idx) => (
              <div key={idx} className="matrix-item-card">
                <div>
                  <span className={`matrix-item-badge ${item.badgeClass}`}>
                    {item.badge}
                  </span>
                  <h4 className="matrix-item-title">{item.brand}</h4>
                  <p className="matrix-item-desc">{item.desc}</p>
                </div>

                <div className="matrix-colors-row">
                  <span className="matrix-colors-label">Colorways:</span>
                  <div className="matrix-colors-dots">
                    {item.colors.map((c, cIdx) => (
                      <span
                        key={cIdx}
                        className="color-dot"
                        style={{ backgroundColor: c }}
                        title={`Colorway ${cIdx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Direct Advance Cue & Button */}
        <div className="mandates-bottom-action">
          <button
            onClick={scrollToSubsystems}
            className="btn-mandates-to-subsystems"
            title="Immediately advance to Subsystem Architecture"
          >
            <span>EXPLORE SUBSYSTEM ARCHITECTURE NEXT</span>
            <ArrowDown size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
