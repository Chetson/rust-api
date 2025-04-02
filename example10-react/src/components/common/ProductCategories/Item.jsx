
const getCategoryBg = (name) => {
    switch (name) {
        case 'Оружие': return 'bg-purple-gradient'
        case 'Постройки': return 'bg-cyan-gradient'
        case 'Предметы': return 'bg-orange-gradient'
        default: return 'bg-default'
    }
}


const Item = ({ label = '', onClick = () => {} }) => {
    return (
        <div
            className={`product-category ${getCategoryBg(label)}`}
            onClick={onClick}
        >
            {label}
        </div>
    )
}

export default Item
