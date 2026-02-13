import React, { useEffect, useRef, useState } from 'react';
import type { VideoState, ResponseType } from '../utils/types';
import { getVideoUrl, isLoopingState } from '../utils/stateMachine';


interface SeamlessVideoPlayerProps {
    currentState: VideoState;
    responseType?: ResponseType;
    onVideoEnd: () => void;
    className?: string;
}

export const SeamlessVideoPlayer: React.FC<SeamlessVideoPlayerProps> = ({
    currentState,
    responseType,
    onVideoEnd,
    className = '',
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null]);
    const currentVideoUrl = useRef('');
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (!isInitialized) {
            const initialVideoUrl = getVideoUrl(currentState, responseType);
            const shouldLoop = isLoopingState(currentState);
            const firstVideo = videoRefs.current[0];

            if (firstVideo) {
                firstVideo.src = initialVideoUrl;
                firstVideo.loop = shouldLoop;
                firstVideo.muted = false;
                firstVideo.load();

                firstVideo.play().catch(error => {
                    console.error('Error playing initial video:', error);
                });

                currentVideoUrl.current = initialVideoUrl;
                setIsInitialized(true);
            }
        }
    }, [isInitialized, currentState, responseType]);

    useEffect(() => {
        const videoUrl = getVideoUrl(currentState, responseType);
        const shouldLoop = isLoopingState(currentState);

        if (currentVideoUrl.current === videoUrl) {
            return;
        }

        currentVideoUrl.current = videoUrl;

        const nextIndex = activeIndex === 0 ? 1 : 0;
        const nextVideo = videoRefs.current[nextIndex];
        const currentVideo = videoRefs.current[activeIndex];

        if (!nextVideo) return;

        nextVideo.src = videoUrl;
        nextVideo.loop = shouldLoop;
        nextVideo.muted = false;
        nextVideo.load();

        const playNextVideo = async () => {
            try {
                await nextVideo.play();

                if (currentVideo) {
                    currentVideo.style.opacity = '0';
                }
                nextVideo.style.opacity = '1';

                setTimeout(() => {
                    setActiveIndex(nextIndex);
                    if (currentVideo) {
                        currentVideo.pause();
                        currentVideo.currentTime = 0;
                    }
                }, 300);
            } catch (error) {
                console.error('Error playing video:', error);
            }
        };

        const timer = setTimeout(playNextVideo, 100);

        return () => clearTimeout(timer);
    }, [currentState, responseType]);

    const handleVideoEnded = (index: number) => {
        if (index === activeIndex && !isLoopingState(currentState)) {
            onVideoEnd();
        }
    };

    return (
        <div className={`relative w-full h-full ${className}`}>
            {[0, 1].map((index) => (
                <video
                    key={index}
                    ref={(el) => { videoRefs.current[index] = el; }}
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out ${index === activeIndex ? 'z-[2]' : 'z-[1]'
                        }`}
                    playsInline
                    preload="auto"
                    onEnded={() => handleVideoEnded(index)}
                    style={{
                        opacity: index === activeIndex ? 1 : 0,
                    }}
                />
            ))}
        </div>
    );
};
