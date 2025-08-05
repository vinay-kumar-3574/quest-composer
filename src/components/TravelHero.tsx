
import { useEffect, useRef } from "react";
import { Plane, MapPin, Camera, Compass } from "lucide-react";

export const TravelHero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple floating animation for travel icons
    const icons = document.querySelectorAll('.floating-icon');
    icons.forEach((icon, index) => {
      const delay = index * 0.5;
      (icon as HTMLElement).style.animationDelay = `${delay}s`;
    });
  }, []);

  return (
    <div ref={heroRef} className="relative overflow-hidden h-64 rounded-3xl bg-gradient-to-r from-orange-500 to-orange-600 mb-8">
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Floating travel icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Plane className="floating-icon absolute top-8 left-16 h-8 w-8 text-white/30 animate-bounce" />
        <MapPin className="floating-icon absolute top-16 right-24 h-6 w-6 text-white/40 animate-pulse" />
        <Camera className="floating-icon absolute bottom-12 left-32 h-7 w-7 text-white/35 animate-bounce" />
        <Compass className="floating-icon absolute bottom-8 right-16 h-6 w-6 text-white/30 animate-pulse" />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
        <div className="text-white">
          <h2 className="text-3xl font-bold mb-2">Welcome to TravelSense</h2>
          <p className="text-lg opacity-90">Your AI-powered travel companion</p>
        </div>
      </div>
    </div>
  );
};
