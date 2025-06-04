import { useState } from 'react';
import OpenAI from 'openai';

function GossipGenerator({ transcript }) {
  const [gossip, setGossip] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generateGossip = async () => {
    if (!transcript.trim()) {
      setError('Please speak something first to generate gossip!');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const prompt = `You are Gossip Girl, the mysterious narrator of the Upper East Side. 
      Take this real-life conversation and transform it into a juicy gossip column in your signature style.
      Use your iconic "XOXO, Gossip Girl" sign-off. Keep it under 200 words.
      
      Conversation to transform:
      "${transcript}"`;

      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are Gossip Girl, the mysterious and witty narrator of the Upper East Side. You transform everyday conversations into scandalous gossip, using your signature style with dramatic flair, pop culture references, and a touch of cattiness."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "gpt-3.5-turbo",
        max_tokens: 300,
        temperature: 0.8,
      });

      setGossip(completion.choices[0].message.content);
    } catch (err) {
      setError(`Failed to generate gossip: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="gossip-generator">
      <h2>Gossip Girl Column</h2>
      <button 
        onClick={generateGossip}
        disabled={isGenerating || !transcript.trim()}
        className={`generate-button ${isGenerating ? 'generating' : ''}`}
      >
        <span>{isGenerating ? 'Generating Gossip...' : 'Generate Gossip'}</span>
      </button>
      {error && <p className="error">{error}</p>}
      {gossip && (
        <div className="gossip-content">
          <h3>Latest Gossip</h3>
          <div className="gossip-text">
            {gossip.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default GossipGenerator; 