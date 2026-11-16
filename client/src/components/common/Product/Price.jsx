import { Fragment } from "react"
import { Badge } from "react-bootstrap"
import { totalPriceAmount, totalPricePercent } from "../../../helpers"

const Price = ({ price, discount, personalDiscount = 0, type = 'percent' }) => (
    <Fragment>
    { !!discount ? (
        <span>
            <span className="text-decoration-line-through">
                {price}
            </span>
            {' '}
            <Badge>
                {type === 'amount'
                    ? totalPriceAmount(price, discount, personalDiscount)
                    : totalPricePercent(price, discount, personalDiscount)
                }RC
            </Badge>
        </span>
    ) : (
        <Badge>
            {price}RC
        </Badge>
    )}
    </Fragment>
)

export default Price
