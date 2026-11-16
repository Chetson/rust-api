import { Fragment, useEffect, useState } from "react"
import { Badge, Col, ListGroup, Row } from "react-bootstrap"
import axiosClient from "../../../axios"

const ProductCategories = () => {

    const [categories, setCategories] = useState([])

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await axiosClient.get('/product/category')
            setCategories(data)
        }

        fetchCategories()

    }, [])

    return (
        <Row>
            <Col>
                <div className="mt-5">
                {categories && categories.length > 0 && categories.map(category => (
                    <Fragment key={category.id}>
                        <Badge>
                            {category.name}
                        </Badge>
                    </Fragment>
                ))}
                </div>
            </Col>
        </Row>
    )
}

export default ProductCategories
