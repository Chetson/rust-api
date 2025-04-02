import { productPrice } from '../../../../shared/helpers/productPrice'
import { Price as Root, ProductPrice, Amount } from './styles'

const Price = ({
    price = 0,
    discount = 0,
    personal = 0,
    amount = 1
}) => {
    return (
        <Root>
            <ProductPrice>
                <span>RUB</span>
                {' '}
                <span>{productPrice(price, discount, personal)}</span>
                {
                    (discount > 0 || personal > 0) && (<>{' '}<s>{price}</s></>)
                }
            </ProductPrice>
            { amount !== 1 && (
                <Amount>
                    x{amount}
                </Amount>
            )}
        </Root>
    )
}

export default Price
