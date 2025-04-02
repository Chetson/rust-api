import { useState, useEffect } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useAppStore } from '../../../shared/store/appStore'
import ServerStats from '../ServerStats'

const Aside = () => {

    const { user, isAuth, balance } = useAppStore(state => ({
        user: state.user,
        isAuth: state.isAuth,
        balance: state?.user?.balance || 0
    }))
    const createPayment = useAppStore(state => state.createPayment)
    const { loading: paymentLoading } = useAppStore(state => state.payment)
    const [showUpBalance, setShowUpBalance] = useState(false)
    const [amount, setAmount] = useState(100)

    const handleCloseUpBalance = () => {
        if (!paymentLoading) return false
        setShowUpBalance(false)
    }

    const handleClickOpenUpBalance = () => {
        setShowUpBalance(true)
    }

    const handleChangeAmount = (event) => {
        const amount = Number(event.target.value)
        setAmount(amount)
    }

    const handleClickUpBalance = async () => {
        const { redirectUrl } = await createPayment({ amount })
        if (redirectUrl) {
            window.location.href = redirectUrl
        }
    }

    useEffect(() => {}, [user, isAuth, balance])

    return (
        <aside className="main-aside mt-5">
            { isAuth && (
                <section className="card aside-card">
                    <div className="card-body">
                        <span>Мой баланс {balance} RC</span>
                    </div>
                    <div>
                        <button onClick={handleClickOpenUpBalance}>Пополнить баланс</button>
                    </div>

                    <Modal show={showUpBalance} onHide={handleCloseUpBalance}>
                        <Modal.Header closeButton>
                            <Modal.Title>Пополнение балика</Modal.Title>
                        </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group>
                                        <Form.Control
                                            type="text"
                                            placeholder="Балик"
                                            value={String(amount)}
                                            onChange={handleChangeAmount}
                                        />
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                        <Modal.Footer>
                        <Button
                            variant="secondary"
                            disabled={!paymentLoading}
                            onClick={handleCloseUpBalance}
                        >
                            Отмена
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleClickUpBalance}
                            disabled={!paymentLoading}
                        >
                            Пополнить
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </section>
            )}


            <section className="card aside-card">
                <div className="card-body">
                    Скидки при пополнении
                </div>
            </section>

            <section className="card aside-card">
                <div className="card-body">
                    ссылка в дискорд
                </div>
            </section>

            <ServerStats />
        </aside>
    )
}

export default Aside
