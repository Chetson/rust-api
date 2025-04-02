import { useEffect, useState } from "react"
import { Button, Col, Container, Form, ListGroup, Modal, Row } from "react-bootstrap"
import axiosClient from "../../../axios"
import ServerForm from './Form'

const Server = () => {

    const [data, setData] = useState([])
    const [isShowServerModal, setIsShowServerModal] = useState(false)
    const [currentServer, setCurrentServer] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)

    const handleClickServerCreate = () => {
        setIsShowServerModal(true)
    }

    const actionClose = () => {
        setIsShowServerModal(false)
        setCurrentServer(null)
    }

    const actionCreate = async (server) => {
        setIsLoaded(true)
        const { data: newServer } = await axiosClient.put('/admin/server', server)
        setData([...data, newServer])
        setIsLoaded(false)
        setCurrentServer(null)
        setIsShowServerModal(false)
    }

    const actionUpdate = async (server) => {
        setIsLoaded(true)
        const { data: updatedServer } = await axiosClient.patch('/admin/server/' + server.id, server)
        setData(data.map(_server => _server.id === updatedServer.id ? updatedServer : _server))
        setIsLoaded(false)
        setCurrentServer(null)
        setIsShowServerModal(false)
    }

    const actionRemove = async (server) => {
        if(!confirm("Точно хочешь удалить сервер?")) return

        try {
            const { status } = await axiosClient.delete('/admin/server/' + server.id)
            if (status === 200) {
                setData(data.filter(_server => _server.id !== server.id))
            }
        } catch (error) {
            if (error?.response?.status === 500) {
                alert(
                    'Нельзя удалить сервер, так как к этому серверу привязаны товары.' +
                    'Сначала надо удалить товары связанные с этим сервером'
                )
            }
        }


    }

    const handleServerEdit = (server) => {
        setCurrentServer(server)
        setIsShowServerModal(true)
    }

    useEffect(() => {
        const fetchServers = async () => {
            const { data: serverList } = await axiosClient.get('/admin/server')
            setData(serverList)
        }

        fetchServers()
    }, [])

    return (
        <Container>
            <h1 className="mb-4">Управление серверами в магазине</h1>

            <Row>
                <Col>
                    <Button
                        variant="primary"
                        onClick={handleClickServerCreate}
                    >
                        Новый сервер
                    </Button>
                </Col>
            </Row>

            <ListGroup className="mt-4">
                {data && data.length > 0 && data.map(server => (
                    <ListGroup.Item
                        key={server.id}
                    >
                        <Container fluid>
                            <Row className="justify-content-between align-items-center">
                                <Col md={8}>
                                    {server.name}
                                </Col>
                                <Col md={2}>
                                    <Button
                                        variant="link"
                                        onClick={() => handleServerEdit(server)}
                                    >
                                        Редактировать
                                    </Button>
                                    {' '}
                                    <Button
                                        variant="link"
                                        onClick={() => actionRemove(server)}
                                    >
                                        Удалить
                                    </Button>
                                </Col>
                            </Row>
                        </Container>

                    </ListGroup.Item>
                ))}
            </ListGroup>

            <Modal show={isShowServerModal} onHide={actionClose}>
                <ServerForm
                    data={currentServer}
                    onCreate={actionCreate}
                    onUpdate={actionUpdate}
                    onClose={actionClose}
                    loading={isLoaded}
                />
            </Modal>

        </Container>
    )
}

export default Server
