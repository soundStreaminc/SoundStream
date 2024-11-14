import { TrackPreview } from "./TrackPreview";

export function TracksList({ trackList }){
    return (
        <section className="track-list-container">
            <div className='header-row'>
                # Title 
            </div>
            
            <div className="track-list">
                {trackList.map((track, index) => (
                    <TrackPreview track={track} index={index} key={track.track.id}/>       
                ))}
                </div>
            
        </section>
    )
}