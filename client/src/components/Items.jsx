import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import axios from '../axios'
import Product from '../components/common/Product'
import { Container, Modal, Row } from 'react-bootstrap'
import ProductCategories from './common/ProductCategories'
import ProductInfo from './common/ProductInfo'

const Items = () => {
    const { currentServer } = useAuth()
    const [items , setItems] = useState([])
    const [isShowProductModal, setIsShowProductModal] = useState(false)
    const [item, setItem] = useState(null)

    const actionClose = () => {
        setIsShowProductModal(false)
        setItem(null)
    }

    const handleClickItem = (item) => {
        setIsShowProductModal(true)
        setItem(item)
    }

    useEffect(() => {
        const fetchServerProducts = async (server) => {
            const { data } = await axios.get(`/products/${currentServer}`)
            setItems(data)

        }

        fetchServerProducts()

    }, [currentServer])

    return (
        <Container fluid>

            <ProductCategories />

            <Row className="mt-4">
            { items && items.map((item, index) => (
                <Product
                    key={index}
                    data={item}
                    onClick={handleClickItem}
                />
            )) }
            </Row>

            <Modal show={isShowProductModal} onHide={actionClose}>
                <ProductInfo onClose={actionClose} data={item} />
            </Modal>
        </Container>
    )
}

export default Items
