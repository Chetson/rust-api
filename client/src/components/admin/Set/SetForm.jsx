import { Fragment, useState } from "react"
import { Button, Modal, Form, Row, Col, Container, Figure } from "react-bootstrap"
import axiosClient from "../../../axios"


const SetForm = ({
    data,
    loading,
    onClose = () => {},
    onCreate = () => {},
    onUpdate = () => {},
}) => {
    const [_data, _setData] = useState(data || {
        name: '',
        icon: null,
        file: null,
        items: [],
        commands: []
    })

    const [_openCommands, _setOpenCommands] = useState(false)
    const [_additionalCommands, _setAdditionalCommands] = useState([])

    const [_openItems, _setOpenItems] = useState(false)
    const [_additionalItems, _setAdditionalItems] = useState([])

    const handleClose = () => onClose()
    const handleChangeName = (event) => _setData({ ..._data, name: event.target.value })
    const handleChangeFile = (event) => _setData({ ..._data, file: event.target.files[0] })

    const handleClickOpenCommands = async () => {
        const { data } = await axiosClient.get('/admin/command')
        _setAdditionalCommands(data)
        _setOpenCommands(true)
    }

    const handleClickOpenItems = async () => {
        const { data } = await axiosClient.get('/admin/items')
        _setAdditionalItems(data)
        _setOpenItems(true)
    }

    const handleSelectAdditionalItem = (item) => {
        _setData({
            ..._data,
            items: [..._data.items, {...item, amount: item.stacksize }]
        })
        _setOpenItems(false)
        _setAdditionalItems([])
    }

    const handleSelectAdditionalCommand = (command) => {
        _setData({
            ..._data,
            commands: [..._data.commands, command]
        })
        _setOpenCommands(false)
        _setAdditionalCommands([])
    }

    const handleChangeAdditionalItemAmount = (event, item, index) => {

        _setData({
            ..._data,
            items: _data.items.map((_item, _index) => {
                if (_item.id === item.id && _index === index) {
                    _item.amount = Number(event.target.value)
                    return _item
                }

                return _item
            })
        })
    }

    const handleCloseAdditional = () => {
        _setOpenItems(false)
        _setOpenCommands(false)
        _setAdditionalItems([])
        _setAdditionalCommands([])
    }

    const handleSubmit = () => {
        if (data) {
            onUpdate(_data)
        } else {
            onCreate(_data)
        }
    }

    return (
        <Fragment>
            <Modal.Header>Набор</Modal.Header>
            <Modal.Body>
                <Row>
                    <Col>
                        <Form>
                            <Form.Group>
                                <Form.Control
                                    name="name"
                                    value={_data?.name || ''}
                                    onChange={handleChangeName}
                                />
                            </Form.Group>

                            <Button
                                variant="link"
                                onClick={handleClickOpenItems}
                            >
                                Добавить вещь в набор
                            </Button>
                            <Button
                                variant="link"
                                onClick={handleClickOpenCommands}
                            >
                                Добавить команду
                            </Button>

                            <br />
                            <Form.Group className="mb-3">
                                <Form.Label>Иконка команды</Form.Label>
                                {_data?.icon && (
                                    <Figure>
                                        <Figure.Image src={`${import.meta.env.VITE_STORAGE_URL}/storage/${_data?.icon}`} />
                                    </Figure>
                                )}

                                <Form.Control
                                    type="file"
                                    name="file"
                                    accept=".jpg, .jpeg, .png"
                                    onChange={handleChangeFile}
                                />
                            </Form.Group>
                        </Form>
                    </Col>

                    {_openCommands && (
                        <Col>
                            <Button onClick={handleCloseAdditional}>Закрыть</Button>
                            <Row>
                            { _additionalCommands && _additionalCommands.length > 0 && _additionalCommands.map(command => (
                                <Col
                                    xs={3}
                                    key={command.id}
                                    onClick={() => handleSelectAdditionalCommand(command)}
                                >
                                    <Figure>
                                        <Figure.Image
                                            src={`${import.meta.env.VITE_STORAGE_URL}/storage/${command.icon}`}
                                        />
                                    </Figure>
                                </Col>
                            ))}
                            </Row>
                        </Col>
                    )}

                    {_openItems && (
                        <Col>
                            <Button onClick={handleCloseAdditional}>Закрыть</Button>
                            <Row>
                            { _additionalItems && _additionalItems.length > 0 && _additionalItems.map((item, index) => (
                                <Col
                                    xs={3}
                                    key={index}
                                    onClick={() => handleSelectAdditionalItem(item, index)}
                                >
                                    <Figure>
                                        <Figure.Image
                                            src={`${import.meta.env.VITE_STORAGE_URL}/storage/${item.icon}`}
                                        />
                                    </Figure>
                                </Col>
                            ))}
                            </Row>
                        </Col>
                    )}


                </Row>
                {_data.items && _data.items.length > 0 && (
                    <Row>
                        <h6>Вещи в наборе</h6>
                        {_data.items.map((item, index) => (
                            <Col xs={2} key={`${String(item.id)}-${String(index)}`}>
                                <Figure>
                                    <Figure.Image
                                        src={`${import.meta.env.VITE_STORAGE_URL}/storage/${item.icon}`}
                                    />
                                </Figure>
                                <div>{item.name}</div>
                                <Form.Control
                                    name="item-amount"
                                    value={item?.amount || item?.pivot?.amount}
                                    onChange={(event) => handleChangeAdditionalItemAmount(event, item, index)}
                                />
                            </Col>
                        ))}
                    </Row>
                )}

                {_data.commands && _data.commands.length > 0 && (
                    <Row className="mt-4">
                        <h6>Команды в наборе</h6>
                        {_data.commands.map((command, index) => (
                            <Col xs={2} key={`${String(command.id)}-${String(index)}`}>
                                <Figure>
                                    <Figure.Image
                                        src={`${import.meta.env.VITE_STORAGE_URL}/storage/${command.icon}`}
                                    />
                                </Figure>
                                <div>{command.name}</div>
                            </Col>
                        ))}
                    </Row>
                )}

            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={handleClose}
                    disabled={loading}
                >
                    Отмена
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Сохраняем...' : 'Сохранить'}
                </Button>
            </Modal.Footer>
        </Fragment>
    )
}

export default SetForm
