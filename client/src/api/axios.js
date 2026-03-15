import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // very important for cookies
})

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("Interceptor called", error.response?.status) // <- debug

    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("401 detected, trying refresh token")
      originalRequest._retry = true
      try {
        const res = await api.get("/auth/refresh-token")
        console.log("Refresh token response:", res.data)
        return api(originalRequest)
      } catch (err) {
        console.error("Refresh token failed:", err.response?.data || err)
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

export default api
