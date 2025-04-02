import Pagination from 'react-bootstrap/Pagination'
import { Paginator as Root } from './styles'

const Paginator = ({
    options = {
        currentPage: 1,
        lastPage: 1,
        pegPage: 15,
        total: 0
    },
    onClick = (page) => {}
}) => {

    const getPages = () => {

        const p = []
        p.push(<Pagination.First key="first" onClick={() => handleClickPage(1)} />)
        p.push(<Pagination.Prev key="prev" onClick={() => handleClickPage(options.currentPage - 1)} />)

        if (options.currentPage > 3) {
            p.push(<Pagination.Ellipsis key="prev-ellipsis" />)
        }

        for(let i = 1; i <= options.lastPage; i++) {
            if (options.currentPage === i) {
                p.push(<Pagination.Item key={i} onClick={() => handleClickPage(i)} active>{i}</Pagination.Item>)
            } else if (options.currentPage - 3 < i && i < options.currentPage) {
                p.push(<Pagination.Item key={i} onClick={() => handleClickPage(i)}>{i}</Pagination.Item>)
            } else if (options.currentPage < i && i < options.currentPage + 3) {
                p.push(<Pagination.Item key={i} onClick={() => handleClickPage(i)}>{i}</Pagination.Item>)
            }
        }

        if (options.lastPage > 6 && options.currentPage < options.lastPage - 2) {
            p.push(<Pagination.Ellipsis key="next-ellipsis" /> )
        }

        p.push(<Pagination.Next key="next" onClick={() => handleClickPage(options.currentPage + 1)} />)
        p.push(<Pagination.Last key="last" onClick={() => handleClickPage(options.lastPage)} />)

        return p
    }

    const handleClickPage = (page) => {
        if (page <= 0) return onClick(1)
        if (page > options.lastPage) return onClick(options.lastPage)
        onClick(page)
    }

    return (
        <Root>
            <Pagination>
                {getPages()}
            </Pagination>
        </Root>
    )
}

export default Paginator
