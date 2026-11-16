import { Outlet } from 'react-router-dom'
import Aside from '../components/common/Aside'
import Navigation from '../components/common/Navigation'

export default function PublicLayout () {
    return (
        <>
            <section>
                <Navigation />
            </section>
            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-xl-3">
                            <Aside />
                        </div>
                        <div className="col-lg-8 col-xl-9">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
