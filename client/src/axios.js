import axios from 'axios'
import { redirect } from 'react-router-dom'

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
    headers: {
        Accept: 'application/json'
    }
})

axiosClient.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken')

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
})

axiosClient.interceptors.response.use((response) => {
    return response
}, (error) => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('accessToken')
        window.location.href = '/'
        return error
    }

    throw error
})

export default axiosClient
