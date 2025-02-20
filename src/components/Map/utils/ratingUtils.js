import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const webToken = localStorage.getItem('authToken')

export async function calculateAverageRating(pinUserId) {

  console.log(pinUserId)
  try {
    const user = await axios.get(`${BACKEND_URL}/users/user/${pinUserId}`, {
      headers: { authorization: `Bearer ${webToken}` },
    })

    if (
      !user.reviewsReceived ||
      !Array.isArray(user.reviewsReceived) ||
      user.reviewsReceived.length === 0
    ) {
      return 0
    }

    const totalRating = user.reviewsReceived.reduce(
      (sum, review) => sum + review.rating,
      0,
    )
    const averageRating = totalRating / user.reviewsReceived.length

    // Round to 1 decimal place
    return Math.round(averageRating * 10) / 10
  } catch (error) {
    console.error('Error fetching user data or calculating rating:', error)
    return 0
  }
}
