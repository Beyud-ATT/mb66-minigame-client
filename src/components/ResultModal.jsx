import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import button4 from '../assets/images/button4.png';

const ResultModal = ({ isOpen, score, totalQuestions, onLogout }) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleComplete = () => {
    onLogout(); // Directly call logout without delay
  };

  if (!isOpen) return null;

  const earnedPoints = score * 100; // 100 points per correct answer

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={500}
      />
      <div className="relative w-[90%] max-w-[400px] p-6 rounded-[15.678px] bg-[rgba(255,255,255,0.95)] shadow-[0px_0px_20px_0px_rgba(255,255,255,0.25)] text-center">
        <h2 className="text-[#FC8F00] text-2xl font-bold mb-4">Chúc mừng!</h2>
        <div className="text-[#727272] mb-6">
          <p className="text-xl mb-2">Bạn đã hoàn thành Mini Game</p>
          <p className="text-3xl font-bold text-[#FC8F00] mb-2">
            {score}/{totalQuestions} câu đúng
          </p>
          <p className="text-lg">
            Bạn đã giành được <span className="text-[#FC8F00] font-bold">{earnedPoints}</span> điểm
          </p>
        </div>
        
        <button 
          onClick={handleComplete}
          className="hover:scale-105 transition-transform"
        >
          <img src={button4} alt="Đã hoàn thành" />
        </button>
      </div>
    </div>
  );
};

export default ResultModal;
