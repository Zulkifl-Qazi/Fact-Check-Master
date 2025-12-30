import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { getVideoPlatformIcon } from '../utils/videoParser';

/**
 * MediaCarousel Component
 * Displays images and videos in a carousel format
 */
const MediaCarousel = ({ media, autoPlay = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const twitterRef = useRef(null);

  // Load Twitter widget script
  useEffect(() => {
    if (!window.twttr) {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Re-render Twitter embeds when tweet changes
  useEffect(() => {
    if (window.twttr && window.twttr.widgets && twitterRef.current) {
      window.twttr.widgets.load(twitterRef.current);
    }
  }, [currentIndex]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  console.log('MediaCarousel received media:', media);

  if (!media || (!media.images?.length && !media.videos?.length)) {
    console.log('MediaCarousel: No media to display');
    return null;
  }

  // Combine all media items
  const allMedia = [
    ...(media.images || []).map(url => ({ type: 'image', url })),
    ...(media.videos || []).map(video => ({ type: 'video', ...video }))
  ];

  console.log('MediaCarousel: allMedia array:', allMedia);

  if (allMedia.length === 0) return null;

  const currentMedia = allMedia[currentIndex];

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allMedia.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
  };

  const renderMedia = (item, isFullscreen = false) => {
    console.log('Rendering media item:', item);
    if (item.type === 'image') {
      return (
        <img
          src={item.url}
          alt="Post media"
          style={{
            width: '100%',
            height: isFullscreen ? '80vh' : 'auto',
            maxHeight: isFullscreen ? '80vh' : '400px',
            objectFit: 'contain',
            borderRadius: isFullscreen ? '0' : '12px',
            display: 'block',
            margin: 0,
            padding: 0
          }}
          onClick={() => !isFullscreen && setIsFullscreen(true)}
          onLoad={() => console.log('Image loaded successfully:', item.url)}
          onError={(e) => console.error('Image failed to load:', item.url, e)}
        />
      );
    }

    if (item.type === 'video') {
      return renderVideo(item, isFullscreen);
    }

    return null;
  };

  const renderVideo = (video, isFullscreen = false) => {
    const style = {
      width: '100%',
      height: isFullscreen ? '80vh' : '400px',
      border: 'none',
      borderRadius: isFullscreen ? '0' : '12px'
    };

    switch (video.platform) {
      case 'youtube':
        return (
          <iframe
            src={video.embedUrl}
            style={style}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video"
          />
        );

      case 'vimeo':
        return (
          <iframe
            src={video.embedUrl}
            style={style}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Vimeo video"
          />
        );

      case 'direct':
        return (
          <video
            controls
            autoPlay={autoPlay}
            style={style}
            src={video.url}
          >
            Your browser does not support the video tag.
          </video>
        );

      case 'twitter':
        if (video.videoId) {
          return (
            <iframe
              src={`https://platform.twitter.com/embed/Tweet.html?id=${video.videoId}&theme=dark`}
              style={style}
              allowFullScreen
              title="Twitter video"
              frameBorder="0"
              scrolling="no"
            />
          );
        }
        return (
          <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <a href={video.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1DA1F2' }}>
              View on X
            </a>
          </div>
        );

      case 'tiktok':
        return (
          <div style={{ 
            ...style, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'white'
          }}>
            <a 
              href={video.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: '#00f2ea', 
                textDecoration: 'none', 
                fontSize: '1.2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <span style={{ fontSize: '3rem' }}>🎵</span>
              <span>View TikTok Video</span>
            </a>
          </div>
        );

      case 'facebook':
        return (
          <div style={{ 
            ...style, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'white'
          }}>
            <a 
              href={video.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: '#1877f2', 
                textDecoration: 'none', 
                fontSize: '1.2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <span style={{ fontSize: '3rem' }}>👥</span>
              <span>View Facebook Video</span>
            </a>
          </div>
        );

      default:
        return (
          <div style={{ 
            ...style, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'white'
          }}>
            <a 
              href={video.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#a855f7', textDecoration: 'none', fontSize: '1.2rem' }}
            >
              🔗 View Video
            </a>
          </div>
        );
    }
  };

  return (
    <>
      {/* Main Carousel */}
      <div style={{
        position: 'relative',
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {renderMedia(currentMedia)}

        {/* Navigation Arrows */}
        {allMedia.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              style={{
                position: 'absolute',
                left: '5px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: window.innerWidth < 768 ? '35px' : '40px',
                height: window.innerWidth < 768 ? '35px' : '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: window.innerWidth < 768 ? '1rem' : '1.2rem',
                zIndex: 10,
                touchAction: 'manipulation'
              }}
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={goToNext}
              style={{
                position: 'absolute',
                right: '5px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: window.innerWidth < 768 ? '35px' : '40px',
                height: window.innerWidth < 768 ? '35px' : '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: window.innerWidth < 768 ? '1rem' : '1.2rem',
                zIndex: 10,
                touchAction: 'manipulation'
              }}
            >
              <FaChevronRight />
            </button>
          </>
        )}

        {/* Media Counter */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: window.innerWidth < 768 ? '4px 8px' : '5px 10px',
          borderRadius: '20px',
          fontSize: window.innerWidth < 768 ? '0.75rem' : '0.875rem',
          fontWeight: '600'
        }}>
          {currentIndex + 1} / {allMedia.length}
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {allMedia.length > 1 && (
        <div style={{
          display: 'flex',
          gap: window.innerWidth < 768 ? '6px' : '10px',
          marginTop: '10px',
          overflowX: 'auto',
          padding: '5px',
          scrollbarWidth: 'thin'
        }}>
          {allMedia.map((item, index) => (
            <div
              key={index}
              onClick={() => setCurrentIndex(index)}
              style={{
                width: window.innerWidth < 768 ? '60px' : '80px',
                height: window.innerWidth < 768 ? '45px' : '60px',
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: index === currentIndex ? '3px solid #a855f7' : '2px solid rgba(255,255,255,0.2)',
                flexShrink: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                touchAction: 'manipulation'
              }}
            >
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={`Thumbnail ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ color: 'white', fontSize: window.innerWidth < 768 ? '1.2rem' : '1.5rem' }}>
                  {getVideoPlatformIcon(item.platform)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              zIndex: 10000
            }}
          >
            <FaTimes />
          </button>
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: '90vw', width: '100%' }}>
            {renderMedia(currentMedia, true)}
          </div>
        </div>
      )}
    </>
  );
};

export default MediaCarousel;
