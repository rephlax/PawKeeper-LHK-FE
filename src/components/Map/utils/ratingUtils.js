export const calculateAverageRating = (pin) => {
    if (!pin?.user.reviewsReceived || !Array.isArray(pin.user.reviewsReceived) || pin.user.reviewsReceived.length === 0) {
      return 0;
    }
  
    const totalRating = pin.user.reviewsReceived.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / pin.user.reviewsReceived.length;
  
    // Round to 1 decimal place
    return Math.round(averageRating * 10) / 10;
  };