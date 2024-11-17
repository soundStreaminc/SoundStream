import { TrackPreview } from "./TrackPreview";

export function TracksList({ trackList }){
    return (
        <section className="track-list-container">
            <div className='header-row'>
                <div className="header-index">
                    <p> # </p> 
                </div>
                
                <div className="header-title">
                    <p> Title </p> 
                </div>

                <div className="header-album">
                    <p> Album </p> 
                </div>

                <div className="header-date-added">
                    <p> Date added </p> 
                </div>

                <div className="header-duration">
                    <p> addDurationIcon </p> 
                </div>
            </div>
            
            <div className="track-list">
                {trackList.map((track, index) => (
                    <TrackPreview track={track} index={index} key={track.track.id}/>       
                ))}
                </div>
            
        </section>
    )
}