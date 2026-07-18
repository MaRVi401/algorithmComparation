import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Import hooks & components
import { usePathfinding } from './hooks/usePathfinding';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { GridBoard } from './components/GridBoard';
import { TrainingModal } from './components/TrainingModal';
import { ErrorModal } from './components/ErrorModal';

const App = () => {
  const containerRef = useRef();
  
  // Destructure semua yang dibutuhkan dari custom hook
  const {
    grid, setGrid, stats, isRunning, setIsRunning, isMouseDown, setIsMouseDown, 
    showError, setShowError, errorMsg, progress, setProgress, isTrainingComplete, 
    trainingData, createInitialGrid, clearPathOnly, handleCancel, runAlgorithm, handleVisualizeML
  } = usePathfinding();

  // GSAP Initial Animation
  useGSAP(() => {
    gsap.from(".sidebar-item", { x: -30, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out" });
    gsap.from(".grid-container", { scale: 0.95, opacity: 0, duration: 1, ease: "expo.out" });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="h-screen w-screen bg-slate-950 text-slate-200 overflow-hidden flex flex-col font-sans">
      <Header stats={stats} />

      <main className="flex-1 flex flex-col-reverse md:flex-row overflow-hidden min-h-0">
        <Sidebar 
          createInitialGrid={createInitialGrid} 
          runAlgorithm={runAlgorithm} 
          isRunning={isRunning} 
          handleCancel={handleCancel} 
          clearPathOnly={clearPathOnly} 
          stats={stats} 
        />
        
        <GridBoard 
          grid={grid} 
          setGrid={setGrid} 
          isRunning={isRunning} 
          isMouseDown={isMouseDown} 
          setIsMouseDown={setIsMouseDown} 
        />

        <TrainingModal 
          isRunning={isRunning} 
          progress={progress} 
          trainingData={trainingData} 
          isTrainingComplete={isTrainingComplete} 
          handleVisualizeML={handleVisualizeML} 
          setIsRunning={setIsRunning} 
          setProgress={setProgress} 
          handleCancel={handleCancel} 
        />

        <ErrorModal 
          showError={showError} 
          setShowError={setShowError} 
          errorMsg={errorMsg} 
          createInitialGrid={createInitialGrid} 
        />
      </main>
    </div>
  );
};

export default App;