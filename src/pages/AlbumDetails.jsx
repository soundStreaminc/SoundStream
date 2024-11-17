import { useParams } from "react-router"
import { stationService } from "../services/station.service"
import { useEffect, useRef, useState } from "react"

import { TracksList } from "../cmps/TracksList"
import { GeneralObjectHeader } from "../cmps/GeneralObjectHeader"

export function AlbumDetails(){
    const params = useParams()
    let album = useRef(null)
    let miniStation = useRef(null)
    const [ tracks , setTracks] = useState(null)

    useEffect(() => {
        loadTracks()
    }, [])

    async function loadTracks(){
        album.current = await stationService.getStationById_SpotifyApi( 'album', params.albumId ) 
        console.log('album.current:', album.current)
        miniStation.current = {
            id: album.current.id, 
            type : album.current.type,
            name: album.current.name,
            image: album.current.images ? album.current.images[0].url : 'not found',
            count: album.current.total_tracks,
            length: "about 4 hr 30 min",
            artist: album.current.artists[0].name
        }

        setTracks(album.current.tracks.items) 
    }
   
    if(!tracks || !album.current.images) return <span> loading in progress... </span>
    return (
        <section className="album-details">
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