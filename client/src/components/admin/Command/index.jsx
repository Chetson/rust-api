import { useEffect, useState } from "react"
import { Button, Col, Container, Figure, ListGroup, Modal, Row } from "react-bootstrap"
import axiosClient from "../../../axios"
import CommandForm from "./CommandForm"


const Command = () => {

    const [commands, setCommands] = useState([])
    const [isShowModal, setIsShowModal] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [modalData, setModalData] = useState(null)

    const handleClickCommandCreate = () => {
        setModalData(null)
        setIsShowModal(true)
    }

    const handleCommandEdit = (command) => {
        setModalData(command)
        setIsShowModal(true)
    }

    const actionClose = () => {
        setIsShowModal(false)
        setModalData(null)
    }

    const actionCreate = async (command) => {
        setIsLoaded(true)
        const formData = new FormData()

        for (const key in command) {
            if (Object.hasOwnProperty.call(command, key)) {
                formData.append(key, command[key])
            }
        }

        const { data: newCommand } = await axiosClient.post('/admin/command/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        setCommands([...commands, newCommand])
        setModalData(null)
        setIsShowModal(false)
        setIsLoaded(false)
    }

    const actionUpdate = async (command) => {
        setIsLoaded(true)

        const formData = new FormData()

        for (const key in command) {
            if (Object.hasOwnProperty.call(command, key)) {
                formData.append(key, command[key])
            }
        }

        const { data: updatedCommand } = await axiosClient.post('/admin/command/update', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        setCommands(commands.map(_command => _command.id === updatedCommand.id ? updatedCommand : _command))

        setModalData(null)
        setIsShowModal(null)
        setIsLoaded(false)
    }

    const actionRemove = async (command) => {
        if (!confirm('Точно удалить???')) return
        await axiosClient.delete('/admin/command/' + command.id)
        setCommands(commands.filter(_command => _command.id !== command.id))
        setModalData(null)
        setIsShowModal(null)
        setIsLoaded(false)
    }

    useEffect(() => {
        const fetchCommands = async () => {
            const { data } = await axiosClient.get('/admin/command')

            setCommands(data)
        }

        fetchCommands()
    }, [])

    return (
        <Container>
            <h1 className="mt-4">Команды сервера</h1>
            <p>
                Данный раздел содержит наборы команд для сервера, которые игроки могут преобретать для получения
                преимущества перед другими игроками. Неломайки, метаболизм, выдача китов и прочие прелести - это здесь.
            </p>

            <br />

            <Button onClick={handleClickCommandCreate}>Добавить команду</Button>

            <br />
            <br />

            <Row>
                <Col>
                    <ListGroup>
                    { commands && commands.length > 0 && commands.map(command => (
                        <ListGroup.Item key={command.id}>
                            <Container fluid>
                                <Row className="justify-content-between align-items-center">
                                    <Col>
                                        <Figure>
                                            <Figure.Image src={`${import.meta.env.VITE_STORAGE_URL}/storage/${command.icon}`} />
                                        </Figure>
                                    </Col>
                                    <Col md={8}>
                                        {command.name} <pre>{command.comma}</pre>
                                    </Col>
                                    <Col md={2}>
                                        <Button
                                            variant="link"
                                            onClick={() => handleCommandEdit(command)}
                                        >
                                            Редактировать
                                        </Button>
                                        {' '}
                                        <Button
                                            variant="link"
                                            onClick={() => actionRemove(command)}
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
                <CommandForm
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

export default Command
