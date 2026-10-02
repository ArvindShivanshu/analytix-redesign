import React from 'react';
import {
  Mail,
  ArrowUp,
  MapPin,
  ExternalLink,
  Cpu,
  Layers,
  Activity
} from 'lucide-react';
import { Github, Linkedin, Instagram } from '../icons/SocialIcons';

export default function Footer({ onScrollTop }) {
  return (
    <footer className="aaruush-footer">
      {/* Background Architectural Ambient Glow & Non-Obstructive Watermark */}
      <div className="footer-ambient-glow" />
      <div className="footer-watermark-text" aria-hidden="true">
        ANALYTIX
      </div>

      <div className="container-custom">
        <div className="footer-grid">
          {/* Column 1: Brand Identity & Live Status */}
          <div className="footer-brand-col">
            <div className="footer-logo-row">
              <div className="footer-brand-badge">
                <img src="/stock/facicon.png" alt="Team AnalytiX" className="footer-brand-img" />
              </div>
              <div className="footer-brand-text">
                <span className="footer-logo-title">TEAM ANALYTIX</span>
                <span className="footer-logo-badge">
                  <span className="footer-badge-dot" />
                  SRM TEAM ROBOCON
                </span>
              </div>
            </div>

            <p className="footer-desc">
              SEGROBOT is an autonomous robotics sorting platform engineered under SRM Team Robocon. Engineered with high-speed SIFT/ORB feature matching, 45.0° gravity slide kinematics, and rapid 32ms servo trapdoor diversion.
            </p>

            {/* Live Telemetry Status Pill */}
            <div className="footer-status-card">
              <span className="status-pulse-dot" />
              <div className="status-text-wrap">
                <span className="status-label">CAD DIGITAL TWIN V2.4</span>
                <span className="status-sub">ALL SUBSYSTEMS NOMINAL • 120 FPS CV</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="footer-social-row">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="social-icon-btn"
                title="GitHub"
                aria-label="GitHub Repository"
              >
                <Github size={15} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="social-icon-btn"
                title="LinkedIn"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={15} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="social-icon-btn"
                title="Instagram"
                aria-label="Instagram Profile"
              >
                <Instagram size={15} />
              </a>
              <a
                href="mailto:contact@srmteamrobocon.org"
                className="social-icon-btn"
                title="Email Team"
                aria-label="Contact Email"
              >
                <Mail size={15} />
              </a>
            </div>
          </div>

          {/* Column 2: Platform Navigation */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">
              <span className="title-bar" />
              Platform
            </h4>
            <ul className="footer-links-list">
              <li>
                <a href="#cad">3D CAD Digital Twin</a>
              </li>
              <li>
                <a href="#timeline">Timeline Corridor</a>
              </li>
              <li>
                <a href="#mandates">Challenge Mandates</a>
              </li>
              <li>
                <a href="#subsystems">Subsystems Architecture</a>
              </li>
              <li>
                <a href="#team">Engineers Roster</a>
              </li>
              <li>
                <a href="#gallery">Media Archives</a>
              </li>
              <li>
                <a href="#faq">Technical FAQ</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Engineering Divisions */}
          <div className="footer-divisions-col">
            <h4 className="footer-col-title">
              <span className="title-bar" />
              Divisions
            </h4>
            <ul className="footer-divisions-list">
              <li>
                <span className="div-acronym">SAMBED</span>
                <span className="div-name">Mechanical Kinematics</span>
              </li>
              <li>
                <span className="div-acronym">SIESED</span>
                <span className="div-name">Computer Vision & AI</span>
              </li>
              <li>
                <span className="div-acronym">SPACED</span>
                <span className="div-name">Embedded Firmware & Web</span>
              </li>
              <li>
                <span className="div-acronym">MCSOCD</span>
                <span className="div-name">Media & Outreach</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Headquarters & Quick Action */}
          <div className="footer-hq-col">
            <h4 className="footer-col-title">
              <span className="title-bar" />
              Headquarters
            </h4>
            <div className="footer-hq-info">
              <p className="hq-org">SRM Institute of Science and Technology</p>
              <p className="hq-lab">Robotics & Automation Innovation Lab</p>
              <p className="hq-loc">Kattankulathur, Chennai, Tamil Nadu — 603203</p>
              <a href="mailto:contact@srmteamrobocon.org" className="hq-email-link">
                contact@srmteamrobocon.org
              </a>
            </div>

            <button onClick={onScrollTop} className="btn-back-top" aria-label="Back to Top">
              <ArrowUp size={14} className="btn-back-top-icon" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-left">
            <span>© {new Date().getFullYear()} Team AnalytiX • SRM Team Robocon. All rights reserved.</span>
          </div>
          <div className="footer-bottom-center">
            <span className="mono-dot" />
            <span>Autonomous Vision-Guided Media Sorter • Inspired by Aaruush</span>
          </div>
          <div className="footer-bottom-right">
            <span>SRMIST KTR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
