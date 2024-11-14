import { useParams } from "react-router"
import { stationService } from "../services/station.service"
import { useEffect, useRef, useState } from "react"
import { setCurrentlyPlaying } from "../store/song/song.actions"
import { showSuccessMsg } from "../services/event-bus.service"

export function StationDetails() {
    const params = useParams()
    let station = useRef(null);
    const [ tracks , setTracks] = useState(null)

    useEffect(() => {
        loadTracks()
    }, [])

    async function loadTracks(){
        station.current = await stationService.getPlaylistById_SpotifyApi( params.stationId ) 
        setTracks(station.current.tracks.items) 
    }

    async function onPlayTrack ( track ){
        try {            
            var playCurrent = track ? await setCurrentlyPlaying ( track ) : ''  
            console.log(`playing:`, playCurrent.title)
            showSuccessMsg(`playing: ${playCurrent.title}`)           
        } catch (err) {
            console.error(err);
        }
    }

    function getPlaylistCover(){
        if(station.current.images){
            return station.current.images[0].url
        }
        console.log('error: no cover found for the playlist')
    }
    console.log('station2:', station)
    if(!tracks || !station.current.images) return <span> loading in progress... </span>
    return (
        <section className="station-details">
            <div className="station-info">
                <div className="station-sub-info">
                    <div className="cover-station">
                        <img src={getPlaylistCover() || 'not found'} />
                    </div>
    
                    <div className="station-title2">
                        Playlist <h2> {station.current.name} </h2>
                        <div className="station-sub-title">
                            <b> {station.current.owner.display_name} </b> *                        
                            {station.current.followers.total} save *
                            {station.current.tracks.items.length} songs, 
                            {/* TODO create a function to get the duration of the album. maybe api?*/}
                            about 4 hr 30 min
                        </div>
                    </div>
                    
                </div>
            </div>

            <div className="tracks-container">
                { tracks.map( (track , i) =>{
                    return (

                        <div key={i}> 
                            <div key={track + 'body'}>
                                <div key={track + 'title'}> {track.track.name} </div>
                                <button type="button" onClick={() => onPlayTrack(track.track)}> PLay Song </button>
                            </div> 
                        </div>
                    )
                }
                ) }
            </div> 
        </section >
    )
}

