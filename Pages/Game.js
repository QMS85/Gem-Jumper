import React, { useState, useEffect } from 'react';
import GameCanvas from '../components/game/GameCanvas';
import GameControls from '../components/game/GameControls';
import GameUI from '../components/game/GameUI';
import GameMenu from '../components/game/GameMenu';
import { Gamepad2 } from 'lucide-react';

export default function Game() {
  const [gameState, setGameState] = useState('menu'); // menu, playing, paused, won, lost
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gemsCollected, setGemsCollected] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setCurrentLevel(1);
    setGemsCollected(0);
  };

  const pauseGame = () => {
    setGameState('paused');
  };

  const resumeGame = () => {
    setGameState('playing');
  };

  const nextLevel = () => {
    if (currentLevel < 3) {
      setCurrentLevel(currentLevel + 1);
      setGameState('playing');
    } else {
      setGameState('won');
    }
  };

  const restartLevel = () => {
    setGameState('playing');
  };

  const gameOver = () => {
    setGameState('lost');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200 flex flex-col">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-sky-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Platform Adventure</h1>
                <p className="text-sm text-gray-500">Jump, collect, and conquer!</p>
              </div>
            </div>
            <GameUI 
              score={score}
              lives={lives}
              level={currentLevel}
              gems={gemsCollected}
              gameState={gameState}
              onPause={pauseGame}
              onResume={resumeGame}
            />
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full max-w-5xl">
          {gameState === 'menu' && (
            <GameMenu onStart={startGame} />
          )}
          
          {(gameState === 'playing' || gameState === 'paused') && (
            <>
              <GameCanvas
                gameState={gameState}
                level={currentLevel}
                lives={lives}
                onScoreChange={setScore}
                onLivesChange={setLives}
                onGemsChange={setGemsCollected}
                onLevelComplete={nextLevel}
                onGameOver={gameOver}
              />
              {isMobile && gameState === 'playing' && <GameControls />}
            </>
          )}

          {gameState === 'won' && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md mx-auto">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Victory!</h2>
              <p className="text-gray-600 mb-6">You completed all levels!</p>
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 mb-6">
                <p className="text-2xl font-bold text-orange-600">Final Score: {score}</p>
                <p className="text-gray-600">Gems Collected: {gemsCollected}</p>
              </div>
              <button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Play Again
              </button>
            </div>
          )}

          {gameState === 'lost' && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md mx-auto">
              <div className="text-6xl mb-4">💔</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Game Over</h2>
              <p className="text-gray-600 mb-6">Better luck next time!</p>
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 mb-6">
                <p className="text-2xl font-bold text-orange-600">Score: {score}</p>
                <p className="text-gray-600">Level Reached: {currentLevel}</p>
              </div>
              <button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
