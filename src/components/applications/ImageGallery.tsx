import React, { useState } from 'react';

const images = [
  '/pictures/picture1.jpg',
  '/pictures/picture2.jpg',
  '/pictures/picture3.jpg',
];

const RetroGallery: React.FC = () => {
  const [current, setCurrent] = useState(0);

  return (
    <div style={{
      maxWidth: 360,
      margin: '40px auto',
      padding: 20,
      backgroundColor: '#d3d3d3',
      border: '12px ridge #444',
      borderRadius: 10,
      boxShadow: 'inset 0 0 10px #000000aa',
      fontFamily: 'Courier New, monospace',
    }}>
      <div style={{
        backgroundColor: '#000',
        padding: 10,
        border: '6px groove #999',
        borderRadius: 8,
      }}>
        <img
          src={images[current]}
          alt={`Retro ${current}`}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'contain',
            backgroundColor: '#222',
            border: '4px inset #666',
          }}
        />
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 10,
        marginTop: 10,
      }}>
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: 50,
              height: 40,
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              border: current === i ? '3px solid red' : '2px solid #666',
              borderRadius: 4,
              cursor: 'pointer',
              filter: 'grayscale(0.5)',
            }}
          />
        ))}
      </div>
      <p style={{
        marginTop: 8,
        textAlign: 'center',
        color: '#333',
        fontSize: 14,
      }}>
        Photo {current + 1} / {images.length}
      </p>
    </div>
  );
};

export default RetroGallery;
