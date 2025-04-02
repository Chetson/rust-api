import { Route, Routes }    from 'react-router-dom'
import { useEffect }        from 'react'
import { useAppStore }      from './shared/store/appStore'
import { Spinner }          from 'react-bootstrap'

import RequireAuth          from './components/RequireAuth'

// Общие контейнера страниц
import PublicLayout         from './layouts/PublicLayout'
import AuthLayout           from './layouts/AuthLayout'
import EmptyLayout          from './layouts/EmptyLayout'
import AdminLayout          from './layouts/AdminLayout'

// Пользовательские вьюшки
import SelectServer         from './components/SelectServer'
import Homepage             from './components/Homepage'
import Logout               from './components/Logout'
import Login                from './components/Login'
import Signin               from './components/Signin'
import Profile              from './components/Profile'

// Админские вьюшки
import AdminDashboard       from './components/admin/Dashboard'
import AdminServerPage      from './components/admin/Server'
import AdminProductType     from './components/admin/Type'
import AdminProductCommand  from './components/admin/Command'
import AdminProductSet      from './components/admin/Set'
import AdminItemLibrary     from './components/admin/Item'
import AdminProductCategory from './components/admin/Category'


export default function App () {

    const fetchUser = useAppStore(state => state.fetchUser)
    const setAppLoadStatus = useAppStore(state => state.setAppLoadStatus)
    const { loaded } = useAppStore()

    useEffect(() => {
        /**
         * @returns {void}
         */
        const fetchData = async () => {
            const server = localStorage.getItem('currentServer');
            if (!server) {
                localStorage.removeItem('currentServer');
                setAppLoadStatus(true);
            } else {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    await fetchUser();
                } else {
                    setAppLoadStatus(true);
                }
            }
        };

        fetchData();
    }, []);

    if (!loaded) return (
        <EmptyLayout>
            <Spinner animation="border" variant="primary" />
        </EmptyLayout>
    )

    return (
        <Routes>
            <Route path="/" element={<PublicLayout />}>
                <Route index element={<Homepage />} />
                <Route path="/profile/*" element={<RequireAuth allowedRoles={['user']} />}>
                    <Route index element={<Profile />} />
                </Route>
            </Route>

            <Route path="/select/server" element={<EmptyLayout />}>
                <Route index element={<SelectServer />} />
            </Route>

            <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="signin" element={<Signin />} />
                <Route path="logout" element={<Logout />} />
            </Route>

            <Route path="/admin" element={<RequireAuth allowedRoles={['admin']} />}>
                <Route element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="product/categories" element={<AdminProductCategory />} />
                    <Route path="product/types" element={<AdminProductType />} />
                    <Route path="product/commands" element={<AdminProductCommand />} />
                    <Route path="product/sets" element={<AdminProductSet />} />
                    <Route path="servers" element={<AdminServerPage />} />
                    <Route path="items" element={<AdminItemLibrary />} />
                </Route>
            </Route>

            <Route path="*" element={<div>404</div>} />
        </Routes>
    )
}
