import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import useAuth from '../../../hooks/useAuth'
import Item from './Item'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Navigation ({ servers }) {

    const { isAuth } = useAuth()

    const navigation = [
        { name: 'Магазин', href: '/', current: true },
        { name: 'Профиль', href: '/profile' },
        { name: isAuth() ? 'Выйти' : 'Войти', href: isAuth() ? '/auth/logout' : '/auth/login' },
        { name: 'Сменить сервер', href: '/select/server' },
    ]

    if (isAuth()) {
        navigation.push({ name: 'Админка', href: '/admin' })
        navigation.push({ name: 'Сервера', href: '/admin/servers' })
        navigation.push({ name: 'Типы товара', href: '/admin/product/types' })
        navigation.push({ name: 'Категория товара', href: '/admin/product/categories' })
        navigation.push({ name: 'Команды', href: '/admin/product/commands' })
        navigation.push({ name: 'Наборы', href: '/admin/product/sets' })
    }

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                    { navigation.map(item => (
                        <Item data={item} key={item.name} />
                    ))}
                    </div>
                </div>
            </div>
        </nav>
    )
}
