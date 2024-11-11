export function StationPreview({station}) {

    console.log('station:', station)
    return <section className="station-preview-container">
            <div className="mini-details-container" key={station.id}>
                <div className="mini-details-sub-container" key={station.id + 'r'}>
                    <div className="musicCover-container" key={station.id + 'a'}>
                        <img
                        className="musicCover"
                        src={station?.image || ''}
                        alt={`track artwork for ${station?.title || 'not found'}`}
                        key={station.id + 'q'}
                        />
                    </div>   
                    <div className="mini-details" key={station.id + 's'}>
                        <p className="station-title" key={station.id + 'e'}> {station?.title || 'not found'} </p>
                    </div>     
                </div>     
            </div>
        </section>
}