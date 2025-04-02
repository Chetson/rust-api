import { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../shared/store/appStore'
import Items from './Items'

export default function Homepage () {

    const { currentServer } = useAppStore()
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
