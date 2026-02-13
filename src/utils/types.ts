export type VideoState =
    | 'IDLE'
    | 'GREETING'
    | 'LISTENING'
    | 'RESPONSE'
    | 'PROMPT'
    | 'GOODBYE';

export type ResponseType =
    | 'GENERAL'
    | 'WEATHER'
    | 'FALLBACK'
    | 'GREETING'
    | 'PROMPT';

export interface SpeechRecognitionResult {
    transcript: string;
    keyword: ResponseType;
}
