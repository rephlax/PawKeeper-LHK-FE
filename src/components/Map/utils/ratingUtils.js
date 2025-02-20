export const calculateAverageRating = (pin) => {
    if (!pin?.reviewsReceived || !Array.isArray(pin.reviewsReceived) || pin.reviewsReceived.length === 0) {
      return 0;
    }
  
    const totalRating = pin.reviewsReceived.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / pin.reviewsReceived.length;
  
    // Round to 1 decimal place
    return Math.round(averageRating * 10) / 10;
  };