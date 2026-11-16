import { Figure } from "react-bootstrap"
import useAuth from "../../../hooks/useAuth"
import Price from "./Price"

const Product = ({ data, onClick = () => {} }) => {

    const { auth, isAuth } = useAuth()

    const handleClick = (item) => {
        onClick(item)
    }

    return (
        <div className="col-6 col-md-4 col-lg-4 col-xl-3" onClick={() => handleClick(data)}>
            <article className="product-card">
                <Figure>
                    <Figure.Image src={`${import.meta.env.VITE_STORAGE_URL}/storage/${data?.item?.icon || data?.command?.icon || data?.set?.icon}`} alt="" />
                </Figure>

                <span className="product-price">
                    <Price
                        price={data.price}
                        discount={data.discount}
                        type={data.discount_type}
                        personalDiscount={(isAuth() && auth.personal_discount > 0) && auth.personal_discount}
                    />
                </span>

                {!!data.discount && (
                    <span className="badge product-discount bg-success">
                        -{data.discount}{data.discount_type === 'amount' ? 'RC' : '%'}
                    </span>
                )}

                <span className="badge product-count">
                    x{data.amount}
                </span>
            </article>
        </div>
    )
}

export default Product
