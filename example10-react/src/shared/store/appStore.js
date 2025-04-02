import { create } from 'zustand'
import axiosClient from '../../axios'

export const useAppStore = create((set, get) => ({
    user: null,
    loaded: false,
    isAuth: false,
    payment: {
        loading: true
    },
    currentServer: localStorage.getItem('currentServer') || null,

    login: async (payload, callback = () => {}) => {
        const { data, status } = await axiosClient.post('/steam/login', payload)

        if (status === 201) {
            const { user, token } = data

            localStorage.setItem('accessToken', token)

            set({ user: user, isAuth: true })
            callback()
        }
    },

    createPayment: async (payload, callback = () => {}) => {
        set({ payment: { loading: false }})

        const { data, status } = await axiosClient.post('/profile/transaction', payload)

        if (status === 200) {
            return { redirectUrl: data }
            callback()
        }

        set({ payment: { loading: true }})
    },

    logout: async (callback = () => {}) => {
        await axiosClient.get('/steam/logout')
        localStorage.removeItem('accessToken')
        set({ user: null, isAuth: false })
        callback()
    },

    fetchUser: async () => {
        set({ loaded: false })
        const { data, status } = await axiosClient.get('/steam/user')
        if (status === 200) set({ user: data, loaded: true, isAuth: true })
    },

    changeBalance: (amount) => {
        const user = get().user
        set({ user: { ...user, balance: amount.toFixed(2) } })
    },

    setCurrentServer: (server) => {
        set({ currentServer: server })
    },

    setAppLoadStatus: (status) => {
        set({ loaded: status })
    }

}))
