import { useState, useEffect, useRef } from 'react';
import GossipGenerator from './GossipGenerator';

function SpeechRecognition() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognitionRef.current.onerror = (event) => {
        setError(`Error occurred in recognition: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
      };
    } else {
      setError('Speech recognition is not supported in this browser.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition is not initialized');
      return;
    }

    if (!isListening) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        setError(`Failed to start recognition: ${err.message}`);
      }
    } else {
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="speech-recognition">
      <button 
        onClick={toggleListening}
        className={`listen-button ${isListening ? 'listening' : ''}`}
      >
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      {error && <p className="error">{error}</p>}
      <div className="transcript">
        <h3>Transcript:</h3>
        <p>{transcript || 'Speak to see transcript here...'}</p>
      </div>
      <GossipGenerator transcript={transcript} />
    </div>
  );
}

export default SpeechRecognition; 