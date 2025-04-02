import { Fragment, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"


const CategoryForm = ({
    data,
    loading,
    onClose = () => {},
    onCreate = () => {},
    onUpdate = () => {},
}) => {

    const [_data, _setData] = useState(data || {
        name: '',
        description: '',
    })

    const handleClose = () => onClose()
    const handleChangeCategoryName = (event) => _setData({ ..._data, name: event.target.value})
    const handleChangeCategoryDescription = (event) => _setData({ ..._data, description: event.target.value})

    const handleSubmit = () => {
        if (data) {
            onUpdate(_data)
        } else {
            onCreate(_data)
        }
    }

    return (
        <Fragment>
            <Modal.Header>Категория</Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Control
                            name="name"
                            value={_data?.name || ''}
                            onChange={handleChangeCategoryName}
                        />
                    </Form.Group>
                    <br />
                    <Form.Group>
                        <Form.Control
                            name="description"
                            as="textarea"
                            value={_data?.description || ''}
                            onChange={handleChangeCategoryDescription}
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

export default CategoryForm
