import { createContext, useContext, useEffect, useState } from "react"
import api from "../api/axios"

const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  console.log(user)

  const [loading, setLoading] = useState(true)

  // const fetchUser = async () => {
  //   try {
  //     setLoading(true)
  //     const res = await api.get("/auth/me")

  //     setUser(res.data.payload)
  //   } catch {
  //     try {
  //       await api.get("/auth/refresh-token")

  //       const res = await api.get("/auth/me")

  //       setUser(res.data.payload)
  //     } catch {
  //       setUser(null)
  //     }
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const fetchUser = async () => {
    try {
      setLoading(true)
      // The interceptor will automatically try to refresh if this returns 401
      const res = await api.get("/auth/me")
      setUser(res.data.payload)
    } catch (err) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

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
