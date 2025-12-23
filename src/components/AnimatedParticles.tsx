import React from 'react';

export default function AnimatedParticles() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Particle 1 */}
      <div className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float-1" 
           style={{ top: '10%', left: '10%' }}></div>
      
      {/* Particle 2 */}
      <div className="absolute w-1.5 h-1.5 bg-blue-300/20 rounded-full animate-float-2" 
           style={{ top: '20%', left: '80%' }}></div>
      
      {/* Particle 3 */}
      <div className="absolute w-1 h-1 bg-blue-400/25 rounded-full animate-float-3" 
           style={{ top: '60%', left: '15%' }}></div>
      
      {/* Particle 4 */}
      <div className="absolute w-2 h-2 bg-blue-300/15 rounded-full animate-float-4" 
           style={{ top: '40%', left: '70%' }}></div>
      
      {/* Particle 5 */}
      <div className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float-5" 
           style={{ top: '80%', left: '40%' }}></div>
      
      {/* Particle 6 */}
      <div className="absolute w-1.5 h-1.5 bg-blue-300/20 rounded-full animate-float-6" 
           style={{ top: '30%', left: '50%' }}></div>
      
      {/* Particle 7 */}
      <div className="absolute w-1 h-1 bg-blue-400/25 rounded-full animate-float-1" 
           style={{ top: '70%', left: '85%' }}></div>
      
      {/* Particle 8 */}
      <div className="absolute w-1.5 h-1.5 bg-blue-300/15 rounded-full animate-float-2" 
           style={{ top: '50%', left: '25%' }}></div>
      
      {/* Particle 9 */}
      <div className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-float-3" 
           style={{ top: '15%', left: '60%' }}></div>
      
      {/* Particle 10 */}
      <div className="absolute w-2 h-2 bg-blue-300/10 rounded-full animate-float-4" 
           style={{ top: '85%', left: '70%' }}></div>
    </div>
  );
}
