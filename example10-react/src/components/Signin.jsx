import queryString from 'query-string'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppStore } from '../shared/store/appStore'

export default function Signin () {
    const login = useAppStore(state => state.login)
    const search = useSearchParams()
    const query = queryString.parse(search.toString())
    const navigate = useNavigate()

    login(query, () => navigate('/'))
}
