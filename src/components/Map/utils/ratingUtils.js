import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const webToken = localStorage.getItem('authToken')

export async function calculateAverageRating(id) {
  if (!id) {
    console.error('Invalid user ID provided')
    return 0
  }

  console.log('Calculating rating for user:', id)
  try {
    const user = await axios.get(`${BACKEND_URL}/users/user/${id}`, {
      headers: { authorization: `Bearer ${webToken}` },
    })
      
    if (
      !user.data.reviewsReceived ||
      !Array.isArray(user.data.reviewsReceived) ||
      user.data.reviewsReceived.length === 0
    ) {
      return 0
    }

    const totalRating = user.data.reviewsReceived.reduce(
      (sum, review) => sum + review.rating,
      0,
    )
    const averageRating = totalRating / user.data.reviewsReceived.length

    return Math.round(averageRating * 10) / 10
  } catch (error) {
    console.error('Error fetching user data or calculating rating:', error)
    return 0
  }
}