export const ATTENDANCE_THRESHOLD = 75;

export const isBelowThreshold = (percentage) => {
    return percentage < ATTENDANCE_THRESHOLD;
};