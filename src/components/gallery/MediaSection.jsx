import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';

const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'Physical SEGROBOT Sorting Rig Prototype',
    category: 'Hardware',
    src: '/stock/sergobot.png',
    caption: 'Physical integration of 45° slide chute, DC gravity hopper, and overhead optical bridge.',
  },
  {
    id: 2,
    title: 'Embedded Avionics & Actuation Testing',
    category: 'Hardware',
    src: '/stock/img2.png',
    caption: 'Wiring harness inspection linking Arduino Uno, motor driver shields, and I2C LCD telemetry.',
  },
  {
    id: 3,
    title: 'Kinematic Chute & Trapdoor Flap Assembly',
    category: 'Hardware',
    src: '/stock/img3.png',
    caption: 'Precision alignment testing for the 45.0° incline angle and servo trapdoor diversion clearance.',
  },
  {
    id: 4,
    title: 'Gravity Feeder & Microswitch Indexing',
    category: 'Hardware',
    src: '/stock/img4.png',
    caption: 'SAMBED mechanical CAD model showcasing the internal stack guide and single-box ejector mechanism.',
  },
  {
    id: 5,
    title: 'SIFT & ORB Keypoint Classification Matrix',
    category: 'Vision',
    src: '/stock/IMG5.png',
    caption: 'Feature extraction diagnostics comparing descriptor clustering across the 4 corporate brand logos.',
  },
  {
    id: 6,
    title: 'Proving Arena Tournament Run',
    category: 'Testing',
    src: '/stock/gal1.jpg',
    caption: 'Live box sorting demonstration conducted at the Robocon robotics proving arena.',
  },
  {
    id: 7,
    title: 'Optical Calibration',
    category: 'Vision',
    src: '/stock/gal2.jpg',
    caption: 'Fine-tuning camera white balance and ring LED diffusion under variable ambient lighting.',
  },
  {
    id: 8,
    title: 'Subsystem Calibration & Flap Response',
    category: 'Hardware',
    src: '/stock/gal3.jpg',
    caption: 'Oscilloscope measurements verifying 32ms servo actuation latency upon UART packet arrival.',
  },
  {
    id: 9,
    title: 'Robotics Prototyping Laboratory',
    category: 'Testing',
    src: '/stock/gal4.jpg',
    caption: 'SRM Team Robocon workspace where prototyping, soldering, and software debugging were conducted.',
  },
  {
    id: 10,
    title: 'Sample Tile Batch Matrix Inspection',
    category: 'Testing',
    src: '/stock/gal5.jpg',
    caption: 'Quality control review of printed packaging samples across Red, Yellow, and Blue backgrounds.',
  },
  {
    id: 11,
    title: 'Tournament Verification Trials',
    category: 'Testing',
    src: '/stock/gal6.jpg',
    caption: 'Autonomous continuous batch testing confirming 99.4% detection accuracy over 100 consecutive runs.',
  },
  {
    id: 12,
    title: 'Team AnalytiX Insignia',
    category: 'Media',
    src: '/stock/mainlogo.png',
    caption: 'Official division branding asset for Team AnalytiX by SRM Team Robocon.',
  },
];

export default function MediaSection() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalItem, setActiveModalItem] = useState(null);

  const categories = ['All', 'Hardware', 'Vision', 'Testing', 'Media'];

  const filteredItems =
    selectedCategory === 'All'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  const openLightbox = (item) => setActiveModalItem(item);
  const closeLightbox = () => setActiveModalItem(null);

  const nextLightbox = (e) => {
    e.stopPropagation();
    const currentIndex = filteredItems.findIndex((it) => it.id === activeModalItem?.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setActiveModalItem(filteredItems[nextIndex]);
  };

  const prevLightbox = (e) => {
    e.stopPropagation();
    const currentIndex = filteredItems.findIndex((it) => it.id === activeModalItem?.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setActiveModalItem(filteredItems[prevIndex]);
  };

  return (
    <section id="gallery" className="portal-section">
      <div className="container-custom">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">Documentary & Archives</span>
          <h2 className="section-title">Project Showcase & Gallery</h2>
          <div className="aaruush-divider">
            <span className="aaruush-divider-line" />
            <span className="aaruush-divider-dot" />
            <span className="aaruush-divider-line" style={{ transform: 'rotate(180deg)' }} />
          </div>
          <p className="section-desc">
            Photographic documentation and tournament showcase video tracking the design, assembly, and testing of SEGROBOT.
          </p>
        </div>

        {/* Video Showcase Section */}
        <div className="video-container">
          <div className="video-header">
            <div>
              <h3 className="video-title">Tournament Demonstration</h3>
              <p className="video-sub">Autonomous sorting, gravity descent, and optical inspection cycle</p>
            </div>
            <span className="video-badge">SRM TEAM ROBOCON</span>
          </div>

          <div className="video-frame">
            <video
              controls
              poster="/stock/sergobot.png"
            >
              <source src="https://analytix-henna.vercel.app/stock/bg.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Filter Categories Bar */}
        <div className="gallery-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="gallery-grid">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => openLightbox(item)}
              className="gallery-card"
            >
              <div className="gallery-thumb-wrap">
                <img src={item.src} alt={item.title} loading="lazy" />
                <div className="gallery-hover-overlay">
                  <Maximize2 size={24} />
                </div>
              </div>

              <div className="gallery-info">
                <span className="gallery-category-tag">{item.category}</span>
                <h4 className="gallery-item-title">{item.title}</h4>
                <p className="gallery-item-desc">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeModalItem && (
        <div onClick={closeLightbox} className="lightbox-backdrop">
          <div onClick={(e) => e.stopPropagation()} className="lightbox-dialog">
            {/* Modal Header */}
            <div className="lightbox-top">
              <span className="lightbox-tag">
                {activeModalItem.category} Archive
              </span>
              <button
                onClick={closeLightbox}
                className="btn-lightbox-close"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Image Viewport */}
            <div className="lightbox-viewport">
              <img src={activeModalItem.src} alt={activeModalItem.title} />

              <button
                onClick={prevLightbox}
                className="btn-lightbox-nav prev"
                aria-label="Previous"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextLightbox}
                className="btn-lightbox-nav next"
                aria-label="Next"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Modal Caption */}
            <div className="lightbox-bottom">
              <h3 className="lightbox-title">{activeModalItem.title}</h3>
              <p className="lightbox-caption">{activeModalItem.caption}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
