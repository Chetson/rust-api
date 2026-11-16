import { Badge, Button, Card, Col, Figure, Ratio } from "react-bootstrap"

export default function Product ({
    data,
    onEdit = () => {},
    onDestroy = () => {}
}) {

    const handleClickEdit = () => {
        return onEdit(data)
    }

    const handleClickDestroy = () => {
        return confirm("Точно хочешь удалить товар?") ? onDestroy(data) : false
    }

    return (

        <tr>
            <td>{data.id}</td>
            <td>
                <Figure>
                    <Figure.Image
                        src={`${import.meta.env.VITE_STORAGE_URL}/storage/${data?.item?.icon || data?.command?.icon || data?.set?.icon}`}
                        width={48}
                        height={48}
                    />
                </Figure>
                <span>{data.title}</span>

            </td>
            <td>{data.server.name}</td>
            <td>{data.type.name}</td>
            <td>{data.category.name}</td>
            <td>{data.amount}</td>
            <td>{data.price}</td>
            <td>{data.discount}</td>
            <td>
                <Button variant="link" onClick={handleClickEdit}>Редактировать</Button>
                {' '}
                <Button variant="link" onClick={handleClickDestroy}>Удалить</Button>
            </td>

        </tr>
    )
}
