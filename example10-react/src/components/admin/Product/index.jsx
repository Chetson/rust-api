import { Button, Figure } from 'react-bootstrap'
import {ReactComponent as PencilIcon} from '../../../shared/icons/pencil.svg'
import {ReactComponent as TrashIcon} from '../../../shared/icons/trash.svg'

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
                        src={`${import.meta.env.VITE_API_BASE_URL}/storage/${data?.item?.icon || data?.command?.icon || data?.set?.icon}`}
                        width={32}
                        height={32}
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
                <PencilIcon onClick={handleClickEdit} />
                {' '}
                <TrashIcon onClick={handleClickDestroy} />
            </td>

        </tr>
    )
}
