import { Button, Col, Container, Modal, Row, Table } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import axios from '../../axios'
import Product from './Product/index'
import ModalEditContent from './Product/ModalEditContent'

const Dashboard = () => {

    const [products, setProducts] = useState([])
    const [isShowProductEditModal, setIsShowProductEditModal] = useState(false)
    const [modalItemContent, setModalItemContent] = useState(null)

    const handleLoadFakeItems = async () => {
        await axios.get('/admin/items/fakeload')
    }

    const handleLoadFakeServers = async () => {
        await axios.get('/admin/server/fake')
    }


    const handleClickProductEdit = (item) => {
        setModalItemContent(item)
        setIsShowProductEditModal(true)
    }

    const handleCloseProductEdit = () => {
        setIsShowProductEditModal(false)
        setModalItemContent(null)

    }

    const handleClickProductCreate = () => {
        setModalItemContent(null)
        setIsShowProductEditModal(true)
    }

    const handleClickProductSave = (item) => {
        setProducts(products.map(product => {
            return product.id !== item.id ? product : item
        }))
        setIsShowProductEditModal(false)
        setModalItemContent(null)
    }

    const handleActionProductCreate = (item) => {
        setProducts([...products, item])
        setIsShowProductEditModal(false)
        setModalItemContent(null)
    }

    const handleActionProductDestroy = async (item) => {
        const { status } = await axios.delete(`/admin/product/delete/${item.id}`)
        if (status === 200) {
            setProducts(products.filter(product => product.id !== item.id))
        }
    }

    useEffect(() => {
        const fetchProducts = async () => {
            const { status, data } = await axios.get('/admin/products')

            if (status === 200) setProducts(data)

            return
        }

        fetchProducts()
    }, [])

    return (
        <section>

            <Container>
                <br />
                <h1>Одменка</h1>
                <br />
                <Row>
                    <Col>
                        <Button onClick={handleClickProductCreate} variant="primary">Создать товар</Button>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                        <Table className="admin-products">
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>Товар</th>
                                    <th>Сервер</th>
                                    <th>Тип</th>
                                    <th>Категория</th>
                                    <th>Кол-во</th>
                                    <th>Цена</th>
                                    <th>Скидка</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                            { products && products.map(product => (
                                <Product
                                    data={product}
                                    key={product.id}
                                    onEdit={handleClickProductEdit}
                                    onDestroy={handleActionProductDestroy}
                                />
                            ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>

                <div className="mt-4">
                    <Button
                        onClick={handleLoadFakeServers}
                        variant="secondary"
                    >
                        Создать сервера
                    </Button>{' '}
                    <Button
                        onClick={handleLoadFakeItems}
                        variant="secondary"
                    >
                        Загрузить демо товары
                    </Button>
                </div>
            </Container>









            <Modal show={isShowProductEditModal} onHide={handleCloseProductEdit}>
                <ModalEditContent
                    data={modalItemContent}
                    onSave={handleClickProductSave}
                    onCreate={handleActionProductCreate}
                    onClose={handleCloseProductEdit}
                />
            </Modal>

        </section>
    )
}

export default Dashboard
