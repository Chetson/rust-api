import { Button, Col, Container, Modal, Pagination, Row, Table } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import axios from '../../axios'
import Product from './Product/index'
import ModalEditContent from './Product/ModalEditContent'
import Paginator from '../../shared/ui/paginator'
import { useSearchParams } from 'react-router-dom'

const Dashboard = () => {

    const [products, setProducts] = useState([])
    const [isShowProductEditModal, setIsShowProductEditModal] = useState(false)
    const [modalItemContent, setModalItemContent] = useState(null)
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        pegPage: 15,
        total: 0
    })

    const [searchParams, setSearchParams] = useSearchParams()

    const handleLoadFakeItems = async () => {
        const { data: categories } = await axios.get('/admin/items/categories')

        for (const category of categories) {
            await axios.get('/admin/items/fakeload', { params: { slug: category.slug }})
        }
    }

    const handleLoadFakeServers = async () => {
        await axios.get('/admin/server/fake')
    }

    const handleCreateAllProducts = () => {
        axios.get('/admin/create/items')
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

    const fetchProducts = async (page = 1) => {
        const {
            status,
            data: {
                data: products,
                current_page: currentPage,
                last_page: lastPage,
                per_page: pegPage,
                total: total,
            },
        } = await axios.get('/admin/products', { params: { page } })

        if (status === 200) {
            setProducts(products)
            setPagination({
                currentPage: currentPage,
                lastPage: lastPage,
                pegPage: pegPage,
                total: total,
            })
        }

        return
    }

    const handleClickPage = async (page) => {


        setSearchParams(page === 1 ? false : { page })
        fetchProducts(page)
    }

    useEffect(() => {

        const page = searchParams.get('page')
        fetchProducts(page ? page : 1)
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

                <Row>
                    <Col>
                        <Paginator options={{...pagination}} onClick={handleClickPage} />
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
                    </Button>{' '}
                    <Button
                        onClick={handleCreateAllProducts}
                        variant="primary"
                    >
                        Создать все товары
                    </Button>
                </div>
            </Container>


            <Modal
                show={isShowProductEditModal}
                onHide={handleCloseProductEdit}
                size="lg"
            >
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
