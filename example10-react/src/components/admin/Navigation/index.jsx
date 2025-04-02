import Item from './Item'

const navigation = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Сервера', href: '/admin/servers' },
    { name: 'Типы товара', href: '/admin/product/types' },
    { name: 'Категория товара', href: '/admin/product/categories' },
    { name: 'Команды', href: '/admin/product/commands' },
    { name: 'Наборы', href: '/admin/product/sets' },
]

const Navigation = () => {
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

export default Navigation
