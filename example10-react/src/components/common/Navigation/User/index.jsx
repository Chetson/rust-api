import { useState } from 'react'
import { Button, Modal, Form } from 'react-bootstrap'
import { useAppStore } from '../../../../shared/store/appStore'
import LogoutButton from './LogoutBtn'
import './userCard.scss'

const UserCard = () => {

    const { user, balance } = useAppStore(state => ({
        user: state.user,
        isAuth: state.isAuth,
        balance: state?.user?.balance || 0
    }))
    const createPayment = useAppStore(state => state.createPayment)
    const { loading: paymentLoading } = useAppStore(state => state.payment)
    const [showUpBalance, setShowUpBalance] = useState(false)
    const [amount, setAmount] = useState(100)
    const logout = useAppStore(state => state.logout)

    const handleClickLogout = async () => {
        await logout()
    }

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

    return (
        <div className="userCard">

            <div className="userCard-balance" onClick={handleClickOpenUpBalance}>
                <div className="userCard-balance-amount">{balance}</div>
                <div className="userCard-balance-currency">RUB</div>
            </div>
            <div className="userCard-avatar">
                <figure>
                    <img src={user.avatar} alt="" />
                </figure>
            </div>

            <div className="userCard-menu">
                <LogoutButton onClick={handleClickLogout} />
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

        </div>
    )
}

export default UserCard
