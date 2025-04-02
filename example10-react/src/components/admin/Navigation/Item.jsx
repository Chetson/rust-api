import { Link } from 'react-router-dom'

const Item = ({ data }) => {
    return (
        <Link
            to={data.href}
            className="nav-link"
            aria-current={data.current ? 'page' : undefined}
        >
            {data.name}
        </Link>
    )
}

export default Item
