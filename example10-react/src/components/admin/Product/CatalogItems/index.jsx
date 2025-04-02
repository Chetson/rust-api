import { useEffect, useState } from 'react'
import { Container, Row, Col, Spinner, Form } from 'react-bootstrap'
import { useAdminItemLibraryStore } from '../../../../shared/store/adminItemLibraryStore'
import Category from './Category'
import Item from './Item'
import { Catalog as Root } from './styles'

const CatalogItems = ({
    onSelect = (item) => {}
}) => {

    const fetchCategories = useAdminItemLibraryStore(state => state.fetchItemCategories)
    const {
        categories: { data, loaded },
        items: { data: items, loaded: loadedItems }
    } = useAdminItemLibraryStore()
    const fetchItems = useAdminItemLibraryStore(state => state.fetchItems)
    const [query, setQuery] = useState('')
    const [_items, _setItems] = useState(items ? items : [])


    const handleSelectCategory = async (category) => {
        const response = await fetchItems(category.slug)
        _setItems(response)
    }

    const handleClickItem = (item) => onSelect(item)

    const filterItems = (items = [], query = '') => {
        if (items.length === 0) return []
        if (!query) return items

        return items.filter(({ name }) => name.toLowerCase().includes(query.toLowerCase()))
    }

    useEffect(() => { fetchCategories() }, [])
    useEffect(() => {
        const debounce = setTimeout(() => {
            const filteredItems = filterItems(items, query)
            _setItems(filteredItems)
        }, 300)

        return () => clearTimeout(debounce)
    }, [query])

    if (!loaded) return (
        <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
        />
    )

    return (
        <Root>


            <Container fluid>
                <Row>
                    <Col>
                        <Category data={data} onSelect={handleSelectCategory} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Control
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                    </Col>
                </Row>
                <Row>
                {_items.map(item => (
                    <Col xs={3} key={item.id}>
                        <Item data={item} onClick={() => handleClickItem(item)} />
                    </Col>
                ))}
                </Row>
            </Container>
        </Root>
    )
}

export default CatalogItems
