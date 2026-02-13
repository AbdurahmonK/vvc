import React from 'react';

interface MicrophoneVisualizerProps {
    isActive: boolean;
}

export const MicrophoneVisualizer: React.FC<MicrophoneVisualizerProps> = ({ isActive }) => {
    return (
        <div className={`relative w-[60px] h-[60px] flex items-center justify-center ${isActive ? 'text-secondary' : 'text-white'}`}>
            <div className="relative z-[3] w-6 h-6">
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
            </div>
            {isActive && (
                <>
                    <div className="pulse-ring-1 absolute top-1/2 left-1/2 w-10 h-10 border-2 border-secondary rounded-full opacity-0"></div>
                    <div className="pulse-ring-2 absolute top-1/2 left-1/2 w-10 h-10 border-2 border-secondary rounded-full opacity-0"></div>
                    <div className="pulse-ring-3 absolute top-1/2 left-1/2 w-10 h-10 border-2 border-secondary rounded-full opacity-0"></div>
                </>
            )}
        </div>
    );
};
