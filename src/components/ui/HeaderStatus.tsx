'use client';
import { useState, useEffect } from 'react';
import { useCyberpunkStore } from '@/store/useCyberpunkStore';
import { Volume2, VolumeX, Monitor } from 'lucide-react';

export function HeaderStatus() {
  const [timeStr, setTimeStr] = useState('00:00:00');
  const {
    scrollProgress,
    scrollVelocity,
    isAudioMuted,
    scanlinesEnabled,
    toggleAudio,
    toggleScanlines,
  } = useCyberpunkStore();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toTimeString().split(' ')[0] +
          '.' +
          Math.floor(now.getMilliseconds() / 100)
      );
    };
    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, []);

  const boyZ = (-scrollProgress * 160).toFixed(1);

  return (
    <header className="flex justify-between items-center text-xs font-mono tracking-widest text-cyber-cyan border-b border-cyber-cyan/30 pb-3 bg-cyber-panel/60 backdrop-blur-md px-4 py-2.5 rounded-lg border border-cyber-cyan/20">
      {/* Left: District & Live System Status */}
      <div className="flex items-center space-x-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyber-green" />
        </span>
        <span className="font-bold text-white tracking-wider">SECTOR 07</span>
        <span className="text-gray-400 hidden sm:inline">// REPLICANT ALLEY</span>
      </div>

      {/* Center: Real-time Telemetry & Clock */}
      <div className="flex items-center space-x-6 text-[11px]">
        <span className="text-gray-400 hidden md:inline">
          SYS_TIME: <span className="text-cyber-amber">{timeStr}</span>
        </span>
        <span className="text-gray-300">
          Z: <span className="text-cyber-cyan font-bold">{boyZ}m</span>
        </span>
        <span className="text-gray-400 hidden sm:inline">
          VEL: <span className="text-white">{Math.abs(scrollVelocity).toFixed(2)}</span>
        </span>
        <span className="text-white font-bold bg-cyber-cyan/10 px-2 py-0.5 rounded border border-cyber-cyan/40">
          {(scrollProgress * 100).toFixed(1)}%
        </span>
      </div>

      {/* Right: Audio & Scanline Controls */}
      <div className="flex items-center space-x-3 pointer-events-auto">
        {/* Scanlines Toggle */}
        <button
          onClick={toggleScanlines}
          title="Toggle CRT Scanlines"
          className={`px-2 py-1 rounded text-[10px] tracking-wider uppercase border transition-all flex items-center space-x-1 ${
            scanlinesEnabled
              ? 'border-cyber-cyan/60 text-cyber-cyan bg-cyber-cyan/10 shadow-[0_0_8px_rgba(0,243,255,0.3)]'
              : 'border-gray-700 text-gray-500 hover:text-gray-300'
          }`}
        >
          <Monitor className="w-3 h-3" />
          <span className="hidden sm:inline">CRT</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={toggleAudio}
          title={isAudioMuted ? 'Unmute Cyberpunk Synth Ambience' : 'Mute Ambience'}
          className={`px-2.5 py-1 rounded text-[10px] tracking-wider uppercase border transition-all flex items-center space-x-1.5 ${
            !isAudioMuted
              ? 'border-cyber-magenta/60 text-cyber-magenta bg-cyber-magenta/10 shadow-[0_0_10px_rgba(255,0,85,0.4)]'
              : 'border-gray-700 text-gray-400 hover:text-gray-200'
          }`}
        >
          {!isAudioMuted ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-cyber-magenta" />
              {/* Equalizer animation bars */}
              <div className="flex items-end space-x-0.5 h-3">
                <span className="w-0.5 h-2 bg-cyber-magenta animate-pulse" />
                <span className="w-0.5 h-3 bg-cyber-magenta animate-bounce" />
                <span className="w-0.5 h-1.5 bg-cyber-magenta animate-pulse" />
              </div>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">MUTED</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}

