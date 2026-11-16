import { useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"


const Type = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        const fetchTypes = async () => {

        }

        fetchTypes()
    }, [])

    return (
        <Container>
            <h1 className="mt-4">Типы товаров</h1>
            <p>
                Тип товара это категория к которой он принадлежит
                для того чтобы можно было выбрать какие правила
                для заполнения продукта к нему применить
            </p>
            <p>
                Не рекомендуется менять типы товаров, так как это повлияет
                на функциональность сайта в целом, однако, можно изменять
                названия типов товара для лучшей навигации и понимания.
            </p>

            <Row>
                <Col>

                </Col>
            </Row>
        </Container>
    )
}

export default Type
