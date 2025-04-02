import { useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"
import Item from "./Item"
import axiosClient from "../../../axios"

const ProductCategories = ({ onChangeCategory = () => {} }) => {

    const [categories, setCategories] = useState([])

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await axiosClient.get('/product/categories')
            setCategories(data)
        }

        fetchCategories()

    }, [])

    const handleClickCategory = (category) => {
        onChangeCategory(category)
    }

    return (
        <Row>
            <Col>
                <div className="mt-5">
                {categories && categories.length > 0 && categories.map(category => (
                    <Item key={category.id} label={category.name} onClick={() => handleClickCategory(category)} />
                ))}
                </div>
            </Col>
        </Row>
    )
}

export default ProductCategories
