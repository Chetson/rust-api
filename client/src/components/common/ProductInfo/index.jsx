import { Fragment, useEffect, useState } from "react"
import { Modal, Button, Row, Col, Figure, Badge } from "react-bootstrap"
import axiosClient from "../../../axios"
import useAuth from "../../../hooks/useAuth"

const ProductInfo = ({ data }) => {

    const [_data, _setData] = useState(data || {})
    const [isLoading, isSetLoading] = useState(false)
    const { auth, isAuth, changeBalance } = useAuth()

    const handleClickBuy = async () => {
        isSetLoading(true)

        try {
            const { data: response } = await axiosClient.post('/product/purchase', { product: data.id })
            changeBalance(response.balance)
            alert('Покупка успешно совершена')
        } catch (error) {
            if (error.response.status === 402) {
                alert('Недостаточно средств для покупки.')
            }
        } finally {
            isSetLoading(false)
        }
    }

    useEffect(() => {
        const fetchProduct = async () => {
            const { data: fullData } = await axiosClient.get(`/product/${_data.id}`)
            _setData(fullData)
        }

        fetchProduct()
    }, [])

    return (
        <Fragment>
            <Modal.Header>{_data.title}</Modal.Header>
            <Modal.Body>
                <Row>
                    <Col>
                        {_data.price}RC
                    </Col>
                    <Col>
                        -{_data.discount}{_data.discount_type === 'percent' ? '%' : 'RC'}
                    </Col>
                    { auth.personal_discount > 0 && (
                        <Col>
                            -{auth.personal_discount}%
                        </Col>
                    )}
                    <Col>
                        x{_data.amount}
                    </Col>
                </Row>
                <Figure>
                    <Figure.Image src={`${import.meta.env.VITE_STORAGE_URL}/storage/${_data?.item?.icon || _data?.command?.icon || _data?.set?.icon}`} />
                </Figure>
                <Row>
                    <Col>{_data?.type?.slug}</Col>
                </Row>
                {_data?.type?.slug === 'set' && _data?.setData && (
                    <Row>
                        <Col>
                            <h6>Вещи в наборе</h6>
                            <Row>
                            {_data.setData.items.length === 0 ? (<Col>Нет нихуя</Col>) : _data.setData.items.map((item, index) => (
                                <Col xs={2} key={`${String(item.id)}+${String(index)}`}>
                                    <Figure>
                                        <Figure.Image src={`${import.meta.env.VITE_STORAGE_URL}/storage/${item?.icon}`} />
                                    </Figure>
                                    <div>{item.name}</div>
                                    <Badge bg="secondary">x{item?.amount || item?.pivot?.amount}</Badge>
                                </Col>
                            ))}
                            </Row>
                            <h6>Команды в наборе</h6>
                            {_data.setData.commands.length === 0 ? (<Col>Нет нихуя</Col>) : _data.setData.commands.map(command => (
                                <Col xs={2} key={command.id}>
                                    <Figure>
                                        <Figure.Image src={`${import.meta.env.VITE_STORAGE_URL}/storage/${command?.icon}`} />
                                    </Figure>
                                    <div>{command.name}</div>
                                </Col>
                            ))}
                        </Col>
                    </Row>
                )}
                <p>{_data.description}</p>
            </Modal.Body>
            <Modal.Footer>
            { isAuth() && (
                    <Button
                        disabled={isLoading}
                        onClick={handleClickBuy}
                    >
                        {isLoading ? 'Покупаем...' : 'Купить'}
                    </Button>
            )}
            </Modal.Footer>

        </Fragment>
    )
}

export default ProductInfo
