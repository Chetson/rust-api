import { Link } from 'react-router-dom'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Item ({ data, disclosure }) {



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
