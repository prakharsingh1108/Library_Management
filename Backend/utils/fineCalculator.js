export function calculateFine(dueDate, returnDate) {
    const due = new Date(dueDate);
    const returned = new Date(returnDate);

    // If returned on time or early, fine is 0
    if (returned <= due) {
        return 0;
    }

    // Difference in milliseconds
    const timeDiff = returned.getTime() - due.getTime();
    
    // Difference in days (rounded up to nearest whole day)
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    const finePerDay = 10; // Fine rate per day
    return daysDiff * finePerDay;
}
