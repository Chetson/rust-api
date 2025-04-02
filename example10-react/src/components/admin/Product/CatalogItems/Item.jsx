import { Figure } from 'react-bootstrap'
import { Item as Root } from './styles'

const Item = ({
    data = {},
    onClick = (data) => {}
}) => {
    const handleClick = () => onClick(data)
    return (
        <Root onClick={handleClick}>
            <Figure>
                <Figure.Image
                    src={`${import.meta.env.VITE_API_BASE_URL}/storage/${data.icon}`}
                    alt={data.name}
                    title={data.name}
                />
            </Figure>
        </Root>
    )
}

export default Item
