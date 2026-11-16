import { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import axiosClient from "../axios";

export default function Profile () {

    const [propertyHistory, setPropertyHistory] = useState([])

    useEffect(() => {
        const fetchPurchaseHistory = async () => {
            const { data: { data } } = await axiosClient.get('/product/purchase/history')
            setPropertyHistory(data)
        }

        fetchPurchaseHistory()
    }, [])

    return (
        <Container as="section" className="mt-5">
            <h1>Ваш профиль</h1>
            <Row>
                <Col>
                    <h3>История покупок</h3>

                    <Table>
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>type</th>
                                <th>product</th>
                                <th>price</th>
                            </tr>
                        </thead>
                        <tbody>
                        {propertyHistory.length > 0 && propertyHistory.map(property => (
                            <tr key={property.id}>
                                <td>{property.id}</td>
                                <td>{property.event_type}</td>
                                <td>{property?.product?.title}</td>
                                <td>{property.price}</td>
                            </tr>
                        ))}

                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    )
}
