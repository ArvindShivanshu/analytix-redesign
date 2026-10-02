import React from 'react';
import { Linkedin, Github, Instagram } from '../icons/SocialIcons';

const TEAM_MEMBERS = [
  {
    name: 'Daksh Jain',
    role: 'Web Dev Lead',
    domain: 'SPACED',
    image: '/stock/daksh.png',
    bio: 'Architected responsive full-stack telemetry and live data visualization pipeline.',
    links: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
  },
  {
    name: 'Krish Parekh',
    role: 'Firmware & MCU',
    domain: 'SPACED',
    image: '/stock/krish.jpg',
    bio: 'Engineered Python-to-Arduino UART protocol and sub-5ms interrupt routines.',
    links: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
  },
  {
    name: 'Naveen',
    role: 'CV Engineer',
    domain: 'SIESED',
    image: '/stock/naveen.jpg',
    bio: 'Developed SIFT and ORB feature descriptor models for high-velocity logo recognition.',
    links: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
  },
  {
    name: 'Syed Misbahul',
    role: 'Outreach Lead',
    domain: 'MCSOCD',
    image: '/stock/syed.jpd.jpg',
    bio: 'Directed technical project documentation, Robocon posters, and media campaigns.',
    links: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
  },
  {
    name: 'Deepa',
    role: 'VFX & Graphics',
    domain: 'MCSOCD',
    image: '/stock/DEEPA.JPG',
    bio: 'Created 3D animations, tournament showcase film, and graphic branding systems.',
    links: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      instagram: 'https://www.instagram.com/deepajayadevan_/',
    },
  },
  {
    name: 'Bhaskar Tripathi',
    role: 'Systems Engineer',
    domain: 'SPACED',
    image: '/stock/bhaskar.jpg',
    bio: 'Implemented LCD status interface and hardware integration for the sorting rig.',
    links: {
      github: 'https://github.com',
      linkedin: 'https://www.linkedin.com/in/bhaskar-tripathi-128a23203',
      instagram: 'https://instagram.com',
    },
  },
  {
    name: 'Fayiz',
    role: 'Mechanical Lead',
    domain: 'SAMBED',
    image: '/stock/FAIZ.JPG',
    bio: 'Designed the 45° low-friction chute, vertical stack dispenser, and 32ms servo trapdoor flap.',
    links: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
  },
  {
    name: 'Sammujwal',
    role: 'Kinematics Specialist',
    domain: 'SAMBED',
    image: '/stock/sammujwal.jpg',
    bio: 'Modeled CAD assembly tolerances, gravity slide dynamics, and chassis dampening.',
    links: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
  },
];

export default function TeamSection() {
  return (
    <section id="team" className="portal-section">
      <div className="container-custom">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">SRM Team Robocon</span>
          <h2 className="section-title">Team AnalytiX</h2>
          <div className="aaruush-divider">
            <span className="aaruush-divider-line" />
            <span className="aaruush-divider-dot" />
            <span className="aaruush-divider-line" style={{ transform: 'rotate(180deg)' }} />
          </div>
          <p className="section-desc">
            The multidisciplinary robotics engineers behind the mechanical design, computer vision models, embedded electronics, and media production of SEGROBOT.
          </p>
        </div>

        {/* 8 Team Members Grid */}
        <div className="team-grid">
          {TEAM_MEMBERS.map((member, idx) => (
            <div key={idx} className="team-card">
              <div>
                {/* Photo Wrap */}
                <div className="team-photo-wrap">
                  <img src={member.image} alt={member.name} loading="lazy" />
                  <div className="team-photo-grad" />
                  <span className="team-domain-tag">{member.domain}</span>
                  <div className="team-caption">
                    <h4 className="team-name">{member.name}</h4>
                    <p className="team-role">{member.role}</p>
                  </div>
                </div>

                <p className="team-bio">{member.bio}</p>
              </div>

              {/* Social Links */}
              <div className="team-social-bar">
                <span className="team-social-label">Connect</span>
                <div className="team-social-icons">
                  <a
                    href={member.links.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="social-icon-btn"
                    title="LinkedIn"
                  >
                    <Linkedin size={13} />
                  </a>
                  <a
                    href={member.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="social-icon-btn"
                    title="GitHub"
                  >
                    <Github size={13} />
                  </a>
                  <a
                    href={member.links.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="social-icon-btn"
                    title="Instagram"
                  >
                    <Instagram size={13} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
