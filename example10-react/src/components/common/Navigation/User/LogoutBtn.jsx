
import { Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import CustomToggle from './CustomToggle'
import './logoutButton.scss'
const LogoutButton = () => {

    return (
        <Dropdown>
            <Dropdown.Toggle as={CustomToggle}>
            </Dropdown.Toggle>

            <Dropdown.Menu align="end">
                <Dropdown.Item as={Link} to="/profile">
                    Профиль
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item as={Link} to="/auth/logout">
                    Выйти
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default LogoutButton
