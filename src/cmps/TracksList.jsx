import { TrackPreview } from "./TrackPreview";
import Duration from '../assets/svgs/duration.svg?react'

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
                    <span aria-hidden="true" className="iconWrapper">         
                        <Duration className="duration headerImage"/>
                    </span>
                </div>
            </div>
            <br/>
            <div className="track-list">
                {trackList.map((track, index) => (
                    <TrackPreview track={track} index={index} key={track.track.id}/>       
                ))}
                </div>
            
        </section>
    )
}