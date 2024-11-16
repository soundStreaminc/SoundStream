import { useParams } from "react-router"
import { stationService } from "../services/station.service"
import { useEffect, useRef, useState } from "react"

import { TracksList } from "../cmps/TracksList"
import { GeneralObjectHeader } from "../cmps/GeneralObjectHeader"

export function PlaylistDetails(  ) {
    const params = useParams()
    let station = useRef(null)
    const [ tracks , setTracks] = useState(null)
    let miniStation = useRef()

    useEffect(() => {
        loadTracks()
    }, [])

    async function loadTracks(){
        station.current = await stationService.getStationById_SpotifyApi( 'playlist', params.stationId ) 
        miniStation.current = {
            id: station.current.id, 
            type : station.current.type,
            name: station.current.name,
            image: station.current.images ? station.current.images[0].url : 'not found',
            owner: station.current.owner.display_name,
            followers: station.current.followers.total,
            count: station.current.tracks.items.length,
            length: "about 4 hr 30 min",
        }

        setTracks(station.current.tracks.items) 
        console.log('station.current:', station.current)
    }
   
    if(!tracks || !station.current.images) return <span> loading in progress... </span>
    return (
        <section className="station-details">
            <GeneralObjectHeader station={miniStation.current}/>

            <div className="tracks-container">
                <TracksList trackList={tracks}/>
                {/* { tracks.map( (track , i) =>{
                    return (

                        <div key={i}> 
                            <div key={track + 'body'}>
                                <div key={track + 'title'}> {track.track.name} </div>
                                <button type="button" onClick={() => onPlayTrack(track.track)}> PLay Song </button>
                            </div> 
                        </div>
                    )
                }
                ) } */}
            </div> 
        </section >
    )
}

