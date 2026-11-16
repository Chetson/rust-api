import { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import ProductCategories from './common/ProductCategories'
import Items from './Items'

export default function Homepage () {

    const { currentServer } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!currentServer) return navigate('/select/server')
    }, [currentServer])

    return (
        <Container fluid>
            <Items />
        </Container>

    )
}
