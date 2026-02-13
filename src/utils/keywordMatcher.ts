export function matchKeyword(text: string) {
    const lowerText = text.toLowerCase();

    if (lowerText.match(/\b(hello|hi|hey|good morning|good afternoon)\b/)) {
        return "GREETING";
    }

    if (lowerText.match(/\b(weather|today|rain|sunny|hot|cold|temperature|forecast)\b/)) {
        return "WEATHER";
    }

    if (lowerText.match(/\b(goodbye|bye|see you|later|exit|quit)\b/)) {
        return "GOODBYE";
    }

    return "GENERAL";
}
