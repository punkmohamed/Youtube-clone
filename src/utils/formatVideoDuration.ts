export const formatVideoDuration = (duration: string) => {
    return duration
        .replace('PT', '')
        .replace('H', 'h ')
        .replace('M', 'm ')
        .replace('S', 's');
};