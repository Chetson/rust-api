export default function Server ({ data }) {
    return (
        <div className="container-fluid px-0 mt-3">
            <div className="row justify-content-between mb-2">
                <div className="col-auto flex-grow-1">{data.name}</div>
                {data.online && (
                    <a href={data.connectAddress} className="col-auto">
                        play
                    </a>
                )}
            </div>
            <div className={`progress server-progress mb-1${!data.online && ' offline'}`}>
                <div
                    className="progress-bar"
                    role="progressbar"
                    aria-label="Basic example"
                    style={{ width: data.players/data.slots * 100 + '%'}}
                    aria-valuenow="50"
                    aria-valuemin="0"
                    aria-valuemax="100"
                />
            </div>
            <div>
                {data.online ? (
                    <>{data.slots} / {data.players}</>
                ) : (
                    <>offline</>
                )}
            </div>
        </div>
    )
}
