import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../axios'
import { useAppStore } from '../shared/store/appStore'

export default function SelectServer () {
    const { setCurrentServer } = useAppStore()
    const [servers, setServers] = useState()
    const navigate = useNavigate()

    const handleSelectCurrentServer = (server) => {
        localStorage.setItem('currentServer', server.id)
        setCurrentServer(server.id)
        return navigate('/')
    }

    useEffect(() => {
        axios.get('/servers')
        .then(({ data }) => {
            setServers(data)
        })
    }, [])

    return (
        <div className='container'>
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8">
                    <div className="server-select-description mb-5 text-center">
                        <h1>Выбор сервера</h1>
                        <p>
                            Чтобы игра принесла вам больше удовольствия пожалуйста ознакомьтесь со списком наших серверов.
                            Все сервера отобраны вручную, чтобы принести вам максимум удовольствия и наслаждения от игры.
                            Внимательно ознакомьтесь с правилами и начните играть вместе на нашем проекте VolevRust
                        </p>
                    </div>
                </div>
            </div>

            <div className='row'>
            {
                servers && servers.map((server, index) => (
                    <div className='col-12 col-sm-12 col-lg-6' key={index}>
                        <div className="server-card">
                            <h1>{server.id} - {server.name}</h1>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, dignissimos. Dolores exercitationem nostrum corporis mollitia ratione voluptatibus excepturi tenetur, fugit, cum, eius voluptatum eum consequuntur nam voluptates hic? Ea, repellendus?</p>

                            <div className='my-4 server-card-options'>
                                <span className="badge text-bg-dark">Loot x2</span>
                                <span className="badge text-bg-dark">Max player x3</span>
                                <span className="badge text-bg-dark">Classic</span>
                                <span className="badge text-bg-dark">Kits</span>
                            </div>

                            <button onClick={() => handleSelectCurrentServer(server)} className='btn btn-outline-warning'>Выбрать сервер</button>
                        </div>
                    </div>
                ))
            }
            </div>
        </div>
    )
}
