import { createContext, useContext, useEffect, useState } from "react"
import api from "../api/axios"
import axios from "axios"

const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  console.log(user)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      setLoading(true)
      // This will call /auth/me, interceptor will refresh token if 401
      const res = await axios.get("http://localhost:8000/api/auth/me")
      setUser(res.data.payload)
    } catch (err) {
      setUser(null)
    } finally {
      setLoading(false) // ✅ important: stop loading no matter what
    }
  }

  // const fetchUser = async () => {
  //   try {
  //     setLoading(true)
  //     // The interceptor will automatically try to refresh if this returns 401
  //     const res = await api.get("/auth/me")
  //     setUser(res.data.payload)
  //   } catch (err) {
  //     setUser(null)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
