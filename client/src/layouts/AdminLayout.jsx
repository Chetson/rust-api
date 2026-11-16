import { Outlet } from 'react-router-dom'
import Navigation from '../components/common/Navigation'

export default function AdminLayout () {
    return (
        <div>
            <Navigation />
            <div>
                <Outlet />
            </div>
        </div>
    )
}
