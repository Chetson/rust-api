import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../shared/store/appStore'

export default function Logout () {
    const { logout } = useAppStore()
    const navigate = useNavigate()

    useEffect(() => {
        logout(() => navigate('/'))
    }, [])
}
