import type { VideoState, ResponseType } from './types';
import { videoMap } from './videoMap';

export const getVideoUrl = (state: VideoState, responseType?: ResponseType): string => {
    if (state === 'RESPONSE' && responseType) {
        return videoMap[responseType];
    }
    return videoMap[state as keyof typeof videoMap] || videoMap.IDLE;
};

export const isLoopingState = (state: VideoState): boolean => {
    return state === 'IDLE' || state === 'LISTENING';
};

export const getNextState = (
    currentState: VideoState
): VideoState => {
    switch (currentState) {
        case 'IDLE':
            return 'GREETING';
        case 'GREETING':
            return 'LISTENING';
        case 'LISTENING':
            return 'RESPONSE';
        case 'PROMPT':
            return 'LISTENING';
        case 'RESPONSE':
            return 'LISTENING';
        case 'GOODBYE':
            return 'IDLE';
        default:
            return 'IDLE';
    }
};
