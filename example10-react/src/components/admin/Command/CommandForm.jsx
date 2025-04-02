import { Fragment, useState } from "react"
import { Button, Figure, Form, Modal } from "react-bootstrap"


const CommandForm = ({
    data,
    loading,
    onClose = () => {},
    onCreate = () => {},
    onUpdate = () => {},
}) => {

    const [_data, _setData] = useState(data || {
        name: '',
        comma: '',
        file: null,
        icon: null,
    })

    const handleClose = () => onClose()
    const handleChangeCommandName = (event) => _setData({ ..._data, name: event.target.value})
    const handleChangeCommandComma = (event) => _setData({ ..._data, comma: event.target.value})
    const handleChangeFile = (event) => _setData({ ..._data, file: event.target.files[0] })

    const handleSubmit = () => {
        if (data) {
            onUpdate(_data)
        } else {
            onCreate(_data)
        }
    }

    return (
        <Fragment>
            <Modal.Header>Команда</Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Название команды</Form.Label>
                        <Form.Control
                            name="name"
                            value={_data?.name || ''}
                            onChange={handleChangeCommandName}
                        />
                    </Form.Group>
                    <br />
                    <Form.Group>
                        <Form.Label>Команда сервера</Form.Label>
                        <Form.Control
                            name="comma"
                            value={_data?.comma || ''}
                            onChange={handleChangeCommandComma}
                        />
                    </Form.Group>
                    <br />
                    <Form.Group className="mb-3">
                        <Form.Label>Иконка команды</Form.Label>
                        {_data.icon && (
                            <Figure>
                                <Figure.Image src={`${import.meta.env.VITE_API_BASE_URL}/storage/${_data.icon}`} />
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

export default CommandForm
