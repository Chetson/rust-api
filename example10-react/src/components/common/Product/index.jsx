import { Figure } from "react-bootstrap"
import { useAppStore } from "../../../shared/store/appStore"
import { ProductCard as Root, Header, Body, Footer, Title, Category } from './styles'
import Price from "./ui/Price"

const Product = ({
    data,
    onClick = () => {}
}) => {

    const { user } = useAppStore()

    const handleClick = (item) => {
        onClick(item)
    }

    return (
        <Root
            className="product-card"
            onClick={() => handleClick(data)}
            type={data?.type?.slug}
        >
            <Header>
                <Price
                    price={data.price}
                    discount={data.discount}
                    personal={user?.personal_discount}
                    amount={data.amount}
                />
            </Header>
            <Body>
                <Figure>
                    <Figure.Image
                        src={`${import.meta.env.VITE_API_BASE_URL}/storage/${data?.item?.icon || data?.command?.icon || data?.set?.icon}`}
                        alt=""
                    />
                </Figure>
            </Body>
            <Footer>
                <Title>{data.title}</Title>
            </Footer>
        </Root>
    )
}

export default Product
