import { useEffect, useState } from 'react';

export default function FlashMessage({ message, category, onClose }) {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Reset fade state if message changes
    setIsFading(false);
    
    // Auto-dismiss timers
    const timer1 = setTimeout(() => setIsFading(true), 3800);
    const timer2 = setTimeout(() => onClose(), 4000);
    
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, [message, onClose]);

  return (
    <div 
      className={`flash flash-${category}`} 
      style={{
        opacity: isFading ? 0 : 1,
        transform: isFading ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'opacity 0.2s, transform 0.2s'
      }}
    >
      <span>{message}</span>
      <button className="close-btn" onClick={onClose}>&times;</button>
    </div>
  );
}
