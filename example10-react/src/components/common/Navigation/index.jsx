import { Link } from 'react-router-dom'
import { useAppStore } from '../../../shared/store/appStore'
import Item from './Item'
import SteamLogin from './SteamLogin'
import UserCard from './User'

export default function Navigation ({ servers }) {

    const { isAuth, user } = useAppStore()

    const navigation = [
        { name: 'Магазин', href: '/' },
        { name: 'Сменить сервер', href: '/select/server' },
    ]

    if (isAuth && user.permission.find(role => role === 'admin')) {
        navigation.push({ name: 'Админка', href: '/admin' })
    }

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <img src={`${import.meta.env.VITE_API_BASE_URL}/storage/common/logo.png`} alt="Volev Rust" />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                    { navigation.map(item => (
                        <Item data={item} key={item.name} />
                    )) }
                    </div>
                </div>
                <div className="d-flex">
                    { isAuth ? <UserCard /> : <SteamLogin /> }
                </div>
            </div>
        </nav>
    )
}
