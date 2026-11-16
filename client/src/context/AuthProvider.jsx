import { createContext, useEffect, useState } from 'react'
import axios from '../axios'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({})
    const [loaded, setLoaded] = useState(false)
    const [currentServer, setCurrentServer] = useState(localStorage.getItem('currentServer'))

    const login = async (payload, callback = () => {}) => {
        const { data, status } = await axios.post('/steam/signin', payload)
        if (status !== 201) return false

        const { user, token } = data

        localStorage.setItem('accessToken', token)
        setAuth(user)
        callback()
    }

    const logout = async (callback = () => {}) => {
        await axios.get('/steam/logout')
        localStorage.removeItem('accessToken')
        setAuth({})
        callback()
    }

    const fetchUser = async () => {
        const { data, status } = await axios.get('/steam/user')
        if (status === 200) setAuth(data)
        setLoaded(true)
    }

    const isAuth = () => {
        if (!auth) return false
        if (!auth.name || !auth.steamid || !auth.avatar) return false

        return true
    }

    const changeBalance = (amount) => {
        if (!isAuth()) return false
        setAuth({
            ...auth,
            balance: amount
        })
    }

    const context = { auth, setAuth, login, logout, isAuth, loaded, currentServer, setCurrentServer, changeBalance }

    useEffect(() => {
        const server = localStorage.getItem('currentServer')
        if (!server) localStorage.removeItem('currentServer')


        const token = localStorage.getItem('accessToken')
        if (token) { fetchUser() } else setLoaded(true)
    }, [])

    return (
        <AuthContext.Provider value={context}>
            {loaded ? children : (<>loading...</>)}
        </AuthContext.Provider>
    )
}

export default AuthContext
