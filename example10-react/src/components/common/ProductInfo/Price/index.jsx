import { useState } from 'react'
import { Button, InputGroup, Spinner, Form } from 'react-bootstrap'
import { useAppStore } from '../../../../shared/store/appStore'
import './styles.scss'
import { productPrice, productPriceAmount } from '../../../../shared/helpers/productPrice'

const Price = ({
    data,
    auth = false,
    user = null,
    loading,
    onPurchase = () => {}
}) => {


    const [amount, setAmount] = useState(1)
    const price = productPrice(data.price, data?.discount, user ? user.personal_discount : 0)

    const handleClickAmountDecrease = () => {
        setAmount(amount <= 1 ? 1 : amount - 1)
    }
    const handleClickAmountIncrease = () => {
        setAmount(amount + 1)
    }

    const handlePurchase = () => {
        onPurchase(amount)
    }

    return (
        <div className="productPrice">
            <div className="productPrice-prices">
                <span className="productPrice-currency">RUB</span>
                <span className="productPrice-total-price">
                    {productPriceAmount(price, amount)}
                </span>
                {Number(price).toFixed(2) !== Number(data.price).toFixed(2) && (
                    <span className="productPrice-discount-price">
                        {productPriceAmount(data.price, amount)}
                    </span>
                )}


            </div>
            <div className="productPrice-amount">
                <InputGroup>
                    <Button onClick={handleClickAmountDecrease}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-dash" viewBox="0 0 16 16">
                            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                        </svg>
                    </Button>
                    <Form.Control value={amount} disabled />
                    <Button onClick={handleClickAmountIncrease}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                        </svg>
                    </Button>
                </InputGroup>
            </div>
            {
                auth && (<div className="productPrice-purchase">
                    <Button
                        disabled={!loading}
                        onClick={handlePurchase}
                    >
                        {!loading && (
                            <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            {' '}
                            </>
                        )}
                        Купить
                    </Button>
                </div>)
            }

        </div>
    )
}

export default Price
