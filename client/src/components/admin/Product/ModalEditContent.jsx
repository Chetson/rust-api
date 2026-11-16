import { Fragment, useEffect, useState } from 'react'
import { Button, Col, Figure, Form, Modal, Row } from 'react-bootstrap'
import axiosClient from '../../../axios'

const ModalEditContent = ({
    data,
    onClose = () => {},
    onSave = () => {},
    onCreate = () => {}
}) => {

    const [_data, _setData] = useState(data ? {...data} : {
        title: '',
        description: null,
        server: { id: 'default' },
        type: { id: 'default' },
        category: { id: 'default' },
        amount: 1,
        price: 0,
        discount: 0,
        discount_type: 'percent',
        returnable: true,
    })
    const [productCategories, setProductCategories] = useState([])
    const [productServers, setProductServers] = useState([])
    const [productTypes, setProductTypes] = useState([])

    const [isUpdate, setIsUpdate] = useState(false)

    const [catalogItems, setCatalogItems] = useState([])
    const [isOpenItemsCatalog, setIsOpenItemsCatalog] = useState(false)

    const [catalogCommands, setCatalogCommands] = useState([])
    const [isOpenCatalogCommands, setIsOpenCatalogCommands] = useState(false)

    const [catalogSets, setCatalogSets] = useState([])
    const [isOpenCatalogSets, setIsOpenCatalogSets] = useState(false)

    const handleClose = () => {
        onClose()
    }

    const handleSave = () => {
        if (data) {
            updateProduct(_data)
        } else {
            createProduct(_data)
        }

    }

    const handleChangeTitle = (event) => _setData({ ..._data, title: event.target.value })
    const handleChangePrice = (event) => _setData({ ..._data, price: Number(event.target.value) })
    const handleChangeDiscount = (event) => _setData({ ..._data, discount: Number(event.target.value) })
    const handleChangeAmount = (event) => _setData({ ..._data, amount: Number(event.target.value) })

    const handleChangeProductType = (event) => {

        /**
         * Закрываем все доп окна с выбором вещей, команд, наборов
         * чистим за ними данные
         */
        setIsOpenCatalogCommands(false)
        setIsOpenItemsCatalog(false)
        setCatalogItems([])
        setCatalogCommands([])

        const productTypeId = Number(event.target.value)
        const selectedType = productTypes.find(type => type.id === productTypeId)
        _setData({
            ..._data,
            type: { ...selectedType },
            product_type_id: productTypeId
        })
    }

    const handleChangeProductCategory = (event) => {
        const productCategoryId = Number(event.target.value)
        const selectedCategory = productCategories.find(category => category.id === productCategoryId)
        _setData({
            ..._data,
            category: { ...selectedCategory },
            product_category_id: productCategoryId
        })
    }

    const handleChangeProductServer = (event) => {
        const productServerId = Number(event.target.value)
        const selectedServer = productServers.find(server => server.id === productServerId)
        _setData({
            ..._data,
            server: { ...selectedServer },
            server_id: productServerId
        })
    }

    const handleChangeProductDiscountType = (event) => {
        _setData({
            ..._data,
            discount_type: event.target.value
        })
    }

    const handleClickSelectCatalogItem = async () => {
        const { data: catalogItems } = await axiosClient.get('/admin/items')
        setCatalogItems(catalogItems)
        setIsOpenItemsCatalog(true)
    }

    const handleClickSelectCatalogCommand = async () => {
        const { data: catalogCommands } = await axiosClient.get('/admin/command')

        setCatalogCommands(catalogCommands)
        setIsOpenCatalogCommands(true)
    }

    const handleClickSelectCatalogSet = async () => {
        const { data: catalogSets } = await axiosClient.get('/admin/set')
        setCatalogSets(catalogSets)
        setIsOpenCatalogSets(true)
    }

    const handleSelectCatalogItem = (item) => {
        _setData({
            ..._data,
            item: {
                id: item.id,
                icon: item.icon,
                name: item.name,
                description: item.description,
            },
            item_id: item.id,
            title: item.name,
            description: item.description,
        })
        setIsOpenItemsCatalog(false)
    }

    const handleSelectCommand = (command) => {
        _setData({
            ..._data,
            command: {
                id: command.id,
                icon: command.icon,
                name: command.name,
                comma: command.comma,
            },
            command_id: command.id,
            title: command.name,
            description: 'command description',
        })
        setIsOpenCatalogCommands(false)
    }

    const handleSelectSet = (set) => {
        _setData({
            ..._data,
            set: {
                id: set.id,
                name: set.name,
                icon: set.icon
            },
            set_id: set.id,
            title: set.name,
            description: 'set description',
        })

        setIsOpenCatalogSets(false)
    }

    const createProduct = async (item) => {
        setIsUpdate(true)
        const { data: newProduct } = await axiosClient.post('/admin/product/create', item)
        setIsUpdate(false)
        onCreate({..._data, ...newProduct})
    }

    const updateProduct = async (item) => {
        setIsUpdate(true)
        await axiosClient.post('/admin/product/update', item)
        setIsUpdate(false)
        onSave(_data)
    }

    useEffect(() => {
        const preloadData = async () => {
            const { data: categories } = await axiosClient.get('/admin/productCategories')
            setProductCategories(categories)

            const { data: servers } = await axiosClient.get('/admin/productServers')
            setProductServers(servers)

            const { data: types } = await axiosClient.get('/admin/productTypes')
            setProductTypes(types)
        }

        preloadData()
    }, [])

    return (
        <Fragment>
            <Modal.Header closeButton>
                <Modal.Title>Редактирование товара</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col>
                        <Form>
                            <Form.Group>
                                <Form.Label>Наименование</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={_data.title}
                                    onChange={handleChangeTitle}
                                />
                            </Form.Group>

                            <br />
                            <Form.Group>
                                <Form.Label>Сервер</Form.Label>
                                <Form.Select
                                    value={_data.server.id}
                                    onChange={handleChangeProductServer}
                                >
                                    { _data.server.id === 'default' && (
                                        <option
                                            value="default"
                                            disabled
                                        >
                                            Выберите сервер
                                        </option>
                                    )}
                                    {productServers && productServers.map(server => (
                                        <option
                                            key={server.id}
                                            value={server.id}
                                        >
                                            {server.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <br />
                            <Form.Group>
                                <Form.Label>Тип товара</Form.Label>
                                <Form.Select
                                    value={_data.type.id}
                                    onChange={handleChangeProductType}
                                >
                                    { _data.type.id === 'default' && (
                                        <option
                                            value="default"
                                            disabled
                                        >
                                            Выберите тип товара
                                        </option>
                                    )}
                                    {productTypes && productTypes.map(type => (
                                        <option
                                            key={type.id}
                                            value={type.id}
                                        >
                                            {type.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            { _data?.type?.slug === 'item' && (
                                <Button variant='link' onClick={handleClickSelectCatalogItem}>Выбрать вещь из каталога</Button>
                            )}

                            { _data?.type?.slug === 'command' && (
                                <Button variant='link' onClick={handleClickSelectCatalogCommand}>Выбрать команду</Button>
                            )}

                            { _data?.type?.slug === 'set' && (
                                <Button variant='link' onClick={handleClickSelectCatalogSet}>Выбрать набор</Button>
                            )}

                            <br />
                            <Form.Group>
                                <Form.Label>Категория</Form.Label>
                                <Form.Select
                                    value={_data.category.id}
                                    onChange={handleChangeProductCategory}
                                >
                                    { _data.category.id === 'default' && (
                                        <option
                                            value="default"
                                            disabled
                                        >
                                            Выберите категорию
                                        </option>
                                    )}
                                    {productCategories && productCategories.map(category => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <br />
                            <Form.Group>
                                <Form.Label>Стоимость</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="price"
                                    value={_data.price}
                                    onChange={handleChangePrice}
                                />
                            </Form.Group>

                            <br />
                            <Form.Group>
                                <Form.Group>
                                    <Form.Label>Количество за раз</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="amount"
                                        value={_data.amount}
                                        onChange={handleChangeAmount}
                                    />
                                </Form.Group>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Скидка</Form.Label>
                                <br />
                                <Form.Check
                                    inline
                                    type="radio"
                                    name="discount-type"
                                    label="Процент от стоимости"
                                    id="discount-type-percent"
                                    value="percent"
                                    checked={_data.discount_type === 'percent'}
                                    onChange={handleChangeProductDiscountType}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    name="discount-type"
                                    label="Точная сумма"
                                    id="discount-type-amount"
                                    value="amount"
                                    checked={_data.discount_type === 'amount'}
                                    onChange={handleChangeProductDiscountType}
                                />
                                <br />
                                <br />
                                <Form.Control
                                    type="text"
                                    name="discount"
                                    value={_data.discount || '0'}
                                    onChange={handleChangeDiscount}
                                />
                            </Form.Group>

                        </Form>
                    </Col>
                    { isOpenItemsCatalog && (
                        <Col>
                            <Row>
                            { catalogItems && catalogItems.length > 0 && catalogItems.map(item => (
                                <Col key={item.id} xs={4} onClick={() => handleSelectCatalogItem(item)}>
                                    <Figure>
                                        <Figure.Image
                                            src={`${import.meta.env.VITE_STORAGE_URL}/storage/${item.icon}`}
                                        />
                                    </Figure>
                                </Col>
                            ))}
                            </Row>
                        </Col>
                    )}

                    { isOpenCatalogCommands && (
                        <Col>
                            <Row>
                            { catalogCommands && catalogCommands.length > 0 && catalogCommands.map(command => (
                                <Col key={command.id} xs={4} onClick={() => handleSelectCommand(command)}>
                                    <div>
                                        <Figure>
                                            <Figure.Image
                                                src={`${import.meta.env.VITE_STORAGE_URL}/storage/${command.icon}`}
                                            />
                                        </Figure>
                                    </div>
                                </Col>
                            ))}
                            </Row>
                        </Col>
                    )}

                    { isOpenCatalogSets && (
                        <Col>
                            <Row>
                            { catalogSets && catalogSets.length > 0 && catalogSets.map(set => (
                                <Col key={set.id} xs={4} onClick={() => handleSelectSet(set)}>
                                    <div>
                                        <Figure>
                                            <Figure.Image
                                                src={`${import.meta.env.VITE_STORAGE_URL}/storage/${set.icon}`}
                                            />
                                        </Figure>
                                    </div>
                                </Col>
                            ))}
                            </Row>
                        </Col>
                    )}
                </Row>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={isUpdate}>
                    Отмена
                </Button>
                <Button variant="primary" onClick={handleSave} disabled={isUpdate}>
                    {isUpdate ? 'Сохраняем...' : 'Сохранить'}
                </Button>
            </Modal.Footer>
        </Fragment>
    )
}

export default ModalEditContent
