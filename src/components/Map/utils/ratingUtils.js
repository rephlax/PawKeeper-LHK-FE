export const calculateAverageRating = (user) => {
    if (!user?.reviewsReceived || !Array.isArray(user.reviewsReceived) || user.reviewsReceived.length === 0) {
      return 0;
    }
  
    const totalRating = user.reviewsReceived.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / user.reviewsReceived.length;
  
    // Round to 1 decimal place
    return Math.round(averageRating * 10) / 10;
  };