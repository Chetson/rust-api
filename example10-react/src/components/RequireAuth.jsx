
import { useLocation, Navigate, Outlet } from 'react-router-dom'
import { useAppStore } from '../shared/store/appStore'

const RequireAuth = ({ allowedRoles }) => {
    const { user, loaded } = useAppStore()
    const location = useLocation()

    if (!loaded) return (<></>)

    return (
        user?.permission?.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : user?.username
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/" state={{ from: location }} replace />
    )
}

export default RequireAuth
