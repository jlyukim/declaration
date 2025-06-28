// src/Components/Settings.tsx

import { useState } from 'react';
import settingsIcon from '../../assets/settingsIcon.png';
import './Settings.css';

interface SettingsProps {
  deckType: string;
  toggleDeck: () => void;
}

export default function Settings({ deckType, toggleDeck }: SettingsProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <button
        className="settings-button"
        onClick={() => setShowSettings(prev => !prev)}
        aria-label="Toggle settings"
      >
        <img src={settingsIcon} alt="Settings" className="settings-icon" />
      </button>

      {showSettings && (
        <div className="settings-popup">
          <button onClick={toggleDeck}>
            Toggle Deck (Current: {deckType})
          </button>
        </div>
      )}
    </>
  );
}
