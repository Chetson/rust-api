import { Figure } from 'react-bootstrap'
import './styles.scss'

const Sub = ({ data }) => {
    const _amount = (data) => {
        if (data?.amount && data?.pivot?.amount) return false

        return data?.amount || data?.pivot?.amount
    }

    return (
        <div className="subItem">
            <div className="subItem-icon">
                <Figure>
                    <Figure.Image src={`${import.meta.env.VITE_API_BASE_URL}/storage/${data?.icon}`} />
                </Figure>
            </div>

            <div className="subItem-title">
                {data.name}
            </div>

            { _amount(data) && _amount(data) > 1 && (
                <div className="subItem-amount">
                    x{_amount(data)}
                </div>
            )}

        </div>
    )
}

export default Sub
