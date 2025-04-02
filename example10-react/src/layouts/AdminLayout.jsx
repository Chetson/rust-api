import { Outlet } from 'react-router-dom'
import Navigation from '../components/common/Navigation'
import AdminNavigation from '../components/admin/Navigation'

export default function AdminLayout () {
    return (
        <div>
            <Navigation />
            <AdminNavigation />
            <div>
                <Outlet />
            </div>
        </div>
    )
}
