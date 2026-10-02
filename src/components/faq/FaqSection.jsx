import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'How does SEGROBOT distinguish the Key Competitor from other packages?',
    a: 'Multi-spectral SIFT and ORB algorithms match logo keypoints within 12ms under 5500K ring illumination, providing 100% rotation-invariant detection.',
  },
  {
    q: 'Why was a 45.0° incline selected for the slide chute?',
    a: '45.0° balances gravity descent and friction, maintaining a steady 0.85 m/s velocity with zero tumbling or camera blur.',
  },
  {
    q: 'How is the trapdoor flap actuated in under 35 milliseconds?',
    a: 'A high-torque micro-servo receives a 115200 baud UART interrupt from the vision engine, clearing the 90° diversion flap in 32ms.',
  },
  {
    q: 'What happens to non-target competitor items?',
    a: 'Non-target items are logged into the real-time presence tally and glide past the closed trapdoor into the standard egress bay.',
  },
  {
    q: 'How does the system prevent hopper feed jams?',
    a: 'A 12V DC planetary geared pusher with microswitch limit indexing feeds exactly one package at a time at up to 2 units per second.',
  },
  {
    q: 'Can SEGROBOT be re-calibrated for new packaging shapes?',
    a: 'Yes. New templates can be added to the SIFT/ORB dictionary in seconds, and the hopper standoffs adjust modularly.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (idx) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  };

  return (
    <section id="faq" className="portal-section aaruush-faq-section">
      <div className="container-custom">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">System Clarifications</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="aaruush-divider">
            <span className="aaruush-divider-line" />
            <span className="aaruush-divider-dot" />
            <span className="aaruush-divider-line" style={{ transform: 'rotate(180deg)' }} />
          </div>
          <p className="section-desc">
            Technical specifics and computer vision methodologies behind SEGROBOT.
          </p>
        </div>

        {/* Floating Glass Pill FAQ List (Aaruush Iconic Design) */}
        <div className="faq-list-container">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => toggleFaq(idx)}
                className={`aaruush-faq-item ${isOpen ? 'open' : ''}`}
              >
                <div className="faq-question-row">
                  <div className="faq-q-left">
                    <span className="faq-num">0{idx + 1}</span>
                    <span className="faq-question-text">{faq.q}</span>
                  </div>
                  <div className="faq-toggle-circle">
                    <ChevronDown
                      size={18}
                      className={`faq-chevron ${isOpen ? 'rotated' : ''}`}
                    />
                  </div>
                </div>

                {isOpen && (
                  <div className="faq-answer-container">
                    <p className="faq-answer-text">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
