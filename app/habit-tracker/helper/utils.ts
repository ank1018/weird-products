export const isDateCompleted = (completedDates: string[], dateToCheck: string): boolean => {
    // Standardize the dateToCheck format
    const standardizedDate = new Date(dateToCheck).toISOString().split('T')[0];

    // Check if any date in completedDates matches the standardized format
    return completedDates.some(completedDate => {
        const standardizedCompletedDate = new Date(completedDate).toISOString().split('T')[0];
        return standardizedCompletedDate === standardizedDate;
    });
};
