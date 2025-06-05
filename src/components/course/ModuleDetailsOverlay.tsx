import React from 'react';
import { ModuleData } from './LearningMapVisualization';

interface ModuleDetailsOverlayProps {
  module: ModuleData;
  onClose: () => void;
  theme: 'light' | 'dark' | 'contrast';
}

export function ModuleDetailsOverlay({ module, onClose, theme }: ModuleDetailsOverlayProps) {
  const themeStyles = {
    light: {
      backgroundColor: 'white',
      borderColor: '#ccc',
      textColor: 'black',
      closeButtonColor: '#333',
    },
    dark: {
      backgroundColor: '#495057',
      borderColor: '#6c757d',
      textColor: 'white',
      closeButtonColor: '#e9ecef',
    },
    contrast: {
      backgroundColor: '#000000',
      borderColor: '#ffffff',
      textColor: '#ffffff',
      closeButtonColor: '#ffffff',
    },
  };

  const currentStyles = themeStyles[theme];

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      width: '300px',
      backgroundColor: currentStyles.backgroundColor,
      border: `1px solid ${currentStyles.borderColor}`,
      borderRadius: '8px',
      padding: '15px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      zIndex: 1000,
      color: currentStyles.textColor,
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'none',
          border: 'none',
          fontSize: '18px',
          cursor: 'pointer',
          color: currentStyles.closeButtonColor,
        }}
      >
        &times;
      </button>
      <h3 className="text-lg font-bold mb-2" style={{ color: currentStyles.textColor }}>{module.name}</h3>
      <p><strong>Difficulty:</strong> {module.difficulty.charAt(0).toUpperCase() + module.difficulty.slice(1)}</p>
      <p><strong>Status:</strong> {module.available ? (module.completed ? 'Completed' : 'Available') : 'Unavailable'}</p>
      {module.content && (
        <div className="mt-4">
          <strong>Content:</strong>
          {module.content.type === 'text' && <p>{module.content.value}</p>}
          {module.content.type === 'image' && (
            <div>
              <img src={module.content.value} alt="Module Content" style={{ maxWidth: '100%', height: 'auto' }} />
              <p className="text-sm text-gray-500">Image content (placeholder)</p>
            </div>
          )}
          {module.content.type === 'audio' && (
            <div>
              <audio controls src={module.content.value}>
                Your browser does not support the audio element.
              </audio>
              <p className="text-sm text-gray-500">Audio content (placeholder)</p>
            </div>
          )}
        </div>
      )}
      {/* Add more details here as needed */}
      <p className="mt-4 text-sm text-gray-600" style={{ color: currentStyles.textColor }}>Click outside to close.</p>
    </div>
  );
} 