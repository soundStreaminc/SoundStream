import { useParams } from "react-router"
import { stationService } from "../services/station.service"
import { useEffect, useRef, useState } from "react"

import { TracksList } from "../cmps/TracksList"
import { GeneralObjectHeader } from "../cmps/GeneralObjectHeader"

export function AlbumDetails(){
    const params = useParams()
    let miniStation = useRef(null)
    const [ tracks , setTracks] = useState(null)

    useEffect(() => {
        loadTracks()
    }, [])

    async function loadTracks(){
        const foundAlbum = await stationService.getStationById_SpotifyApi( 'album', params.albumId ) 
        miniStation.current = {
            id: foundAlbum.id, 
            type : foundAlbum.type,
            name: foundAlbum.name,
            image: foundAlbum.images ? foundAlbum.images[0].url : 'not found',
            count: foundAlbum.total_tracks,
            length: "about 4 hr 30 min",
            artist: foundAlbum.artists[0].name
        }
        setTracks(foundAlbum.tracks.items) 
    }
   
    if(!tracks || !miniStation.current.image) return <span> loading in progress... </span>
    return (
        <section className="album-details">
            <GeneralObjectHeader station={miniStation.current} isAlreadyAdded={false}/>

            <div className="tracks-container">
                <TracksList trackList={tracks}/>
            </div> 
        </section >
    )
}