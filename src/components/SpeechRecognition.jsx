import { useState, useEffect, useRef } from 'react';
import GossipGenerator from './GossipGenerator';

function SpeechRecognition() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const [isICloudConnected, setIsICloudConnected] = useState(false);
  const [isICloudLoading, setIsICloudLoading] = useState(false);
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

  const handleICloudLogin = async () => {
    setIsICloudLoading(true);
    setError(null);
    
    try {
      // This is a mock implementation since actual iCloud API access requires
      // proper authentication and Apple Developer account
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Mock successful connection
      setIsICloudConnected(true);
      setTranscript(prev => prev + "\n\n[Connected to iCloud - Accessing photos and data...]");
    } catch (err) {
      setError('Failed to connect to iCloud. Please ensure you have proper permissions and try again.');
    } finally {
      setIsICloudLoading(false);
    }
  };

  return (
    <div className="speech-recognition">
      <div className="button-group">
        <button 
          onClick={toggleListening}
          className={`listen-button ${isListening ? 'listening' : ''}`}
        >
          <span>{isListening ? 'Stop Listening' : 'Start Listening'}</span>
        </button>
        
        <button
          onClick={handleICloudLogin}
          disabled={isICloudLoading || isICloudConnected}
          className={`icloud-button ${isICloudConnected ? 'connected' : ''} ${isICloudLoading ? 'loading' : ''}`}
        >
          <span>
            {isICloudLoading ? (
              <>
                <i className="apple-icon"></i> Connecting...
              </>
            ) : isICloudConnected ? (
              <>
                <i className="apple-icon"></i> iCloud Connected
              </>
            ) : (
              <>
                <i className="apple-icon"></i> Connect iCloud
              </>
            )}
          </span>
        </button>
      </div>

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