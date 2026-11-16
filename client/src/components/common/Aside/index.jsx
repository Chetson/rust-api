import { useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import ServerStats from "../ServerStats";

export default function Aside () {

    const { auth, isAuth } = useAuth()

    useEffect(() => {}, [auth])

    return (
        <aside className="main-aside mt-5">
            <section className="card aside-card">
                <div className="card-body">
                    {isAuth() && (
                        <span>Мой баланс {auth.balance} RC</span>
                    )}
                </div>

            </section>

            <section className="card aside-card">
                <div className="card-body">
                    Скидки при пополнении
                </div>
            </section>

            <section className="card aside-card">
                <div className="card-body">
                    ссылка в дискорд
                </div>
            </section>

            <ServerStats />
        </aside>
    )
}
