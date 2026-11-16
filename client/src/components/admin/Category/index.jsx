import { useEffect, useState } from "react"
import { Button, Col, Container, ListGroup, Modal, Row } from "react-bootstrap"
import axiosClient from "../../../axios"
import CategoryForm from "./CategoryForm"


const Category = () => {

    const [categories, setCategories] = useState([])
    const [isShowModal, setIsShowModal] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [modalData, setModalData] = useState(null)

    const handleClickCategoryCreate = () => {
        setModalData(null)
        setIsShowModal(true)
    }

    const handleCategoryEdit = (category) => {
        setModalData(category)
        setIsShowModal(true)
    }

    const actionClose = () => {
        setIsShowModal(false)
        setModalData(null)
    }

    const actionCreate = async (category) => {
        setIsLoaded(true)
        const { data: newCategory } = await axiosClient.put('/admin/product/category', category)
        setCategories([...categories, newCategory])
        setModalData(null)
        setIsShowModal(false)
        setIsLoaded(false)
    }

    const actionUpdate = async (category) => {
        setIsLoaded(true)

        const { data: updatedCategory } = await axiosClient.patch('/admin/product/category', category)
        setCategories(categories.map(_category => _category.id === updatedCategory.id ? updatedCategory : _category))

        setModalData(null)
        setIsShowModal(null)
        setIsLoaded(false)
    }

    const actionRemove = async (category) => {
        if (!confirm('Точно удалить???')) return
        await axiosClient.delete('/admin/product/category/' + category.id)
        setCategories(categories.filter(_category => _category.id !== category.id))
        setModalData(null)
        setIsShowModal(null)
        setIsLoaded(false)
    }

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await axiosClient.get('/admin/product/category')

            setCategories(data)
        }

        fetchCategories()
    }, [])

    return (
        <Container>
            <h1 className="mt-4">Категории товаров</h1>
            <p>
                Категории товаров это категории которые отображаются на странице в магазине.
                Можно задавать любые названия и каталогализировать как угодно товары по категориям.
                ВАЖНО! Если в категории будут находиться товары, то удалить данную категорию будет нельзя,
                до удаления всех товаров и/или переноса из этой категории. Это сделано для безопасности,
                чтобы не потерять товары из магазина безследно.
            </p>

            <br />

            <Button onClick={handleClickCategoryCreate}>Добавить категорию</Button>

            <br />
            <br />

            <Row>
                <Col>
                    <ListGroup>
                    { categories && categories.length > 0 && categories.map(category => (
                        <ListGroup.Item key={category.id}>
                            <Container fluid>
                                <Row className="justify-content-between align-items-center">
                                    <Col md={8}>
                                        {category.name}
                                    </Col>
                                    <Col md={2}>
                                        <Button
                                            variant="link"
                                            onClick={() => handleCategoryEdit(category)}
                                        >
                                            Редактировать
                                        </Button>
                                        {' '}
                                        <Button
                                            variant="link"
                                            onClick={() => actionRemove(category)}
                                        >
                                            Удалить
                                        </Button>
                                    </Col>
                                </Row>
                            </Container>
                        </ListGroup.Item>
                    ))}
                    </ListGroup>
                </Col>
            </Row>

            <Modal show={isShowModal} onHide={actionClose}>
                <CategoryForm
                    data={modalData}
                    onCreate={actionCreate}
                    onUpdate={actionUpdate}
                    onClose={actionClose}
                    loading={isLoaded}
                />
            </Modal>

        </Container>
    )
}

export default Category
