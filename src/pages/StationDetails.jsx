import { useParams } from "react-router"
import { stationService } from "../services/station.service"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { setCurrentlyPlaying } from "../store/song/song.actions"

export function StationDetails() {
    const params = useParams()
    const [ station , setStation] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()  

    useEffect(() => {
        loadTracks()
    }, [])

    async function loadTracks(){
        const station = await stationService.getPlaylistById_SpotifyApi( params.stationId )
        const tracks = station.tracks.items
        setStation(tracks)
    }

    function onPlayTrack ( track ){
        try {            
            var playCurrent = track ? setCurrentlyPlaying ( track ) : ''             
        } catch (e) {
        console.error(e);
        }
    }

    if(!station) return <span> loading in progress... </span>
    return (
        <section className="station-details">
            <div className="tracks-container">
                { station.map( (track , i) =>{
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

