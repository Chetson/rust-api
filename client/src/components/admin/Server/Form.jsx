import { useState } from "react"
import { Modal, Form as BForm, Button } from "react-bootstrap"

const Form = ({
    data,
    loading,
    onClose = () => {},
    onCreate = () => {},
    onUpdate = () => {},
}) => {

    const [_data, _setData] = useState(data || {
        name: '',
        ip_address: '',
        description: '',
    })

    const handleClose = () => onClose()
    const handleChangeName = (event) => _setData({ ..._data, name: event.target.value })
    const handleChangeIpAddress = (event) => _setData({ ..._data, ip_address: event.target.value })
    const handleChangeDescription = (event) => _setData({ ..._data, description: event.target.value })

    const handleSubmit = () => {
        if (data) {
            onUpdate(_data)
        } else {
            onCreate(_data)
        }
    }

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Сервер</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <BForm>
                    <BForm.Group>
                        <BForm.Control
                            name="name"
                            value={_data.name}
                            onChange={handleChangeName}
                        />
                    </BForm.Group>
                    <br />
                    <BForm.Group>
                        <BForm.Control
                            name="ip_address"
                            value={_data.ip_address}
                            onChange={handleChangeIpAddress}
                        />
                    </BForm.Group>
                    <br />
                    <BForm.Group>
                        <BForm.Control as="textarea"
                            name="description"
                            value={_data.description}
                            onChange={handleChangeDescription}
                        />
                    </BForm.Group>
                </BForm>
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
        </>
    )
}

export default Form
