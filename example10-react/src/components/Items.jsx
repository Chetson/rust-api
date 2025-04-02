import { useEffect, useState } from 'react'
import axios from '../axios'
import Product from '../components/common/Product'
import { Col, Container, Modal, Row } from 'react-bootstrap'
import ProductCategories from './common/ProductCategories'
import ProductInfo from './common/ProductInfo'
import { useAppStore } from '../shared/store/appStore'

const Items = () => {
    const { currentServer } = useAppStore()
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

    const handleChangeCategory = async (category) => {
        try {
            const { data } = await axios.get(`/products`, {
                params: {
                    server_id: currentServer,
                    category: category?.id,
                }
            })

            setItems(data)
        } catch (error) {
            console.log(error, error.response)
            alert('Ошибка загрузки товаров')
        }
    }

    useEffect(() => {
        const fetchServerProducts = async (server) => {
            const { data } = await axios.get(`/products`, {
                params: {
                    server_id: currentServer,
                    category: 'all',
                }
            })
            setItems(data)
        }

        fetchServerProducts()

    }, [currentServer])

    return (
        <Container fluid>

            <ProductCategories
                onChangeCategory={handleChangeCategory}
            />

            <Row className="mt-4">
            { items && items.map((item, index) => (
                <Col
                    key={index}
                    xs={6} md={3} xl={2}
                    className="mb-3"
                >
                    <Product
                        data={item}
                        onClick={handleClickItem}
                    />
                </Col>
            )) }
            </Row>

            <Modal
                show={isShowProductModal}
                onHide={actionClose}
                centered
                size="lg"
                fullscreen="lg-down"
            >
                <ProductInfo onClose={actionClose} data={item} />
            </Modal>
        </Container>
    )
}

export default Items
