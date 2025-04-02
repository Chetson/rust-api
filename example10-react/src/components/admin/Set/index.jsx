import { useEffect, useState } from "react"
import { Button, Col, Container, Figure, ListGroup, Modal, Row } from "react-bootstrap"
import axiosClient from "../../../axios"
import SetForm from "./SetForm"


const Set = () => {

    const [data, setData] = useState([])
    const [isShowModal, setIsShowModal] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [modalData, setModalData] = useState(null)

    const handleClickSetCreate = () => {
        setModalData(null)
        setIsShowModal(true)
    }

    const handleClickSetUpdate = (set) => {
        setModalData(set)
        setIsShowModal(true)
    }

    const actionClose = () => {
        setIsShowModal(false)
        setModalData(null)
    }

    const actionCreate = async (set) => {
        setIsLoaded(true)

        console.log('SET CREATE', set)

        const formData = new FormData()

        formData.append('id', set.id)
        formData.append('name', set.name)
        formData.append('icon', set.icon)
        formData.append('file', set.file)
        formData.append('items', JSON.stringify(set.items))
        formData.append('commands', JSON.stringify(set.commands))

        const { data: createdSet } = await axiosClient.post(
            '/admin/set/create',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )

        setData([
            ...data,
            {
                ...createdSet,
                items: createdSet.items.map(item => ({
                    ...item,
                    amount: item?.amount
                        ? item.amount
                        : item?.pivot?.amount
                            ? item.pivot.amount : 0
                }))
            }
        ])

        setIsLoaded(false)
        setIsShowModal(false)
        setModalData(null)
    }
    const actionUpdate = async (set) => {

        // setIsLoaded(true)

        const formData = new FormData()

        formData.append('id', set.id)
        formData.append('name', set.name)
        formData.append('icon', set.icon)
        formData.append('file', set.file)
        formData.append('items', JSON.stringify(set.items))
        formData.append('commands', JSON.stringify(set.commands))

        const { data: updatedSet } = await axiosClient.post(
            '/admin/set/update',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )

        setIsLoaded(false)

        setData(data.map(_set => _set.id === set.id ? {
            ...set,
            ...updatedSet,
            items: updatedSet.items.map(item => ({
                ...item,
                amount: item?.amount
                    ? item.amount
                    : item?.pivot?.amount
                        ? item.pivot.amount : 0
            }))
        } : _set))

        setIsShowModal(false)
        setModalData(null)
    }

    const handleClickSetRemove = async (set) => {
        const { status } = await axiosClient.delete(`/admin/set/${set.id}`)
        if (status === 200) {
            setData(data.filter(_set => _set.id !== set.id))
        }
    }

    useEffect(() => {
        const fetchSets = async () => {
            const { data: sets } = await axiosClient.get('/admin/set')
            setData(sets.map(set => ({
                ...set,
                items: set.items.map(item => ({
                    ...item,
                    amount: item?.amount
                        ? item.amount
                        : item?.pivot?.amount
                            ? item.pivot.amount : 0
                }))
            })))
        }

        fetchSets()
    }, [])

    return (
        <Container>
            <h1 className="mt-5">Наборы</h1>

            <p>
                В данном разделе можно сконфигурировать кастомные наборы вещей, которые будут выданы при покупке.
                ВНИМАНИЕ! Вещи выданные при покупке возврату не подлежат. Каждая вещь из набора отображается как
                отдельно купленная вещь. В наборы можно добаавлять так же и команды для игроков, которые необходимо
                активировать внутри игры
            </p>

            <br />

            <Button onClick={handleClickSetCreate}>Добавить набор</Button>

            <br />
            <br />

            <Row>
                <Col>
                    <ListGroup>
                    { data && data.length > 0 && data.map(set => (
                        <ListGroup.Item key={set.id}>
                            <Row className="justify-content-between align-items-center">
                                <Col>
                                    <Figure>
                                        <Figure.Image src={`${import.meta.env.VITE_API_BASE_URL}/storage/${set.icon}`} />
                                    </Figure>
                                </Col>
                                <Col xs={8}>{set.name}</Col>
                                <Col xs={2}>
                                    <Button variant="link" onClick={() => handleClickSetUpdate(set)}>Редактировать</Button>
                                    <Button variant="link" onClick={() => handleClickSetRemove(set)}>Удалить</Button>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                    </ListGroup>
                </Col>
            </Row>

            <Modal show={isShowModal} onHide={actionClose}>
                <SetForm
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

export default Set
