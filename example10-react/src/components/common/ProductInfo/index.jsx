import { Fragment, useEffect, useState } from "react"
import { Modal, Row, Col, Figure, Spinner } from "react-bootstrap"
import axiosClient from "../../../axios"
import { useAppStore } from "../../../shared/store/appStore"
import Price from "./Price"
import './styles.scss'
import Sub from "./Sub"

const ProductInfo = ({ data, onClose = () => {} }) => {

    const [_data, _setData] = useState(data || {})
    const [purchaseLoaded, setPurchaseLoaded] = useState(true)
    const changeBalance = useAppStore(state => state.changeBalance)
    const { isAuth, user } = useAppStore()
    const [loaded, setLoaded] = useState(false)

    const handleClickBuy = async (amount = 1) => {
        setPurchaseLoaded(false)

        try {
            const { data: response } = await axiosClient.post(
                '/product/purchase',
                {
                    product: data.id,
                    amount,
                }
            )

            const { balance = 0 } = response

            changeBalance(balance)
            alert('Покупка успешно совершена')
        } catch (error) {

            if (error.response.status === 402) {
                alert('Недостаточно средств для покупки.')
            }
        } finally {
            setPurchaseLoaded(true)
        }
    }

    const _getIcon = (data)  => {
        const basePath = import.meta.env.VITE_API_BASE_URL
        const icon = data?.item?.icon || data?.command?.icon || data?.set?.icon
        const path = [basePath, '/storage/', icon].join('')

        return path
    }

    useEffect(() => {
        const fetchProduct = async () => {
            setLoaded(false)
            const { data: fullData } = await axiosClient.get(`/product/${_data.id}`)
            _setData(fullData)
            setLoaded(true)
        }

        fetchProduct()
    }, [])

    const CLOSE_BTN = (
        <div className="close">
            <button onClick={onClose}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    className="bi bi-x"
                    viewBox="0 0 16 16"
                >
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </button>
        </div>
    )


    if (!data || !loaded) return (
        <Fragment>
            <Modal.Header>
                <div className="product-header">
                    <div className="title" />
                    { CLOSE_BTN }
                </div>
            </Modal.Header>
            <Modal.Body>
                <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                />
            </Modal.Body>
        </Fragment>
    )

    return (
        <Fragment>
            <Modal.Header>
                <div className="product-header">
                    <div className="title">
                        {_data.title}
                    </div>
                    { CLOSE_BTN }
                </div>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col sm={4}>
                        <div className="product-image">
                            <Figure>
                                <Figure.Image
                                    src={_getIcon(data)}
                                />
                            </Figure>
                        </div>
                    </Col>
                    <Col sm={8}>
                        <div className="product-description">
                            <div className="title">Описание</div>
                            <div className="description">
                                {_data.description}
                                {' '}
                            </div>
                            <div className="prices">
                                <Price
                                    data={_data}
                                    auth={isAuth}
                                    user={user}
                                    onPurchase={handleClickBuy}
                                    loading={purchaseLoaded}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>

                {_data?.type?.slug === 'set' && _data?.setData && (
                    <Row>
                        <Col>

                            {_data.setData.items.length > 0 && (
                                <Fragment>
                                    <h6 className="product-subtitle">Вещи в наборе</h6>
                                    <div className="product-subs">
                                    {
                                        _data.setData.items.map((item, index) => (
                                            <Sub data={item} key={`${String(item.id)}+${String(index)}`} />
                                        ))
                                    }
                                    </div>
                                </Fragment>
                            )}

                            {_data.setData.commands.length > 0 && (
                                <Fragment>
                                    <h6 className="product-subtitle">Команды в наборе</h6>
                                    <div className="product-subs">
                                    {
                                        _data.setData.commands.map(command => (
                                            <Sub data={command} key={command.id} />
                                        ))
                                    }
                                    </div>
                                </Fragment>
                            )}
                        </Col>
                    </Row>
                )}
            </Modal.Body>

        </Fragment>
    )
}

export default ProductInfo
