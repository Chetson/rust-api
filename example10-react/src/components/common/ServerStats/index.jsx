import Server from "./Server"

export default function ServerStats () {
    const servers = [
        {
            name: 'server 1',
            slots: 150,
            players: 45,
            connectAddress: 'steam://connect/31.184.218.75:28015',
            online: true,
        },
        {
            name: 'server 2',
            slots: 250,
            players: 186,
            connectAddress: 'steam://connect/31.184.218.75:28025',
            online: true,
        },
        {
            name: 'server 3',
            slots: 0,
            players: 0,
            connectAddress: 'steam://connect/31.184.218.75:28017',
            online: false,
        },
        {
            name: 'server 4',
            slots: 120,
            players: 12,
            connectAddress: 'steam://connect/31.184.218.75:28078',
            online: true,
        }
    ]
    return (
        <section className="card aside-card">
            <div className="card-body">
                <h6>мониторинг серверов</h6>
                <div>
                {
                    servers && servers.map(server => <Server key={server.name} data={server} />)
                }
                </div>

            </div>
        </section>
    )
}
