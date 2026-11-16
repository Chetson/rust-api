import queryString from 'query-string'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function Signin () {
    const { login } = useAuth()
    const search = useSearchParams()
    const query = queryString.parse(search.toString())
    const navigate = useNavigate()

    login(query, () => navigate('/'))
}
