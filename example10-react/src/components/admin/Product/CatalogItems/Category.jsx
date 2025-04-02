import { Form } from 'react-bootstrap'
import { Category as Root } from './styles'

const Category = ({
    data = [],
    category,
    onSelect = (category) => {}
}) => {

    const handleChangeCategory = (event) => {
        const selected = data.find(category => Number(event.target.value) === category.id)
        onSelect(selected)
    }

    return (
        <Root>
            <Form.Select onChange={handleChangeCategory} defaultValue="placeholder">
                <option value="placeholder" disabled>Выберите категорию</option>
                {data.map(category => (
                    <option
                        key={category.id}
                        value={category.id}
                    >
                        {category.name}
                    </option>
                ))}
            </Form.Select>
        </Root>
    )
}

export default Category
