import { useParams } from "react-router"
import { stationService } from "../services/station.service"
import { useEffect, useRef, useState } from "react"

import { TracksList } from "../cmps/TracksList"
import { GeneralObjectHeader } from "../cmps/GeneralObjectHeader"

export function PlaylistDetails(  ) {
    const params = useParams()
    let miniStation = useRef(null)
    const [ tracks , setTracks] = useState(null)

    useEffect(() => {
        loadTracks()
    }, [])

    async function loadTracks(){
        const foundPlaylist = await stationService.getStationById_SpotifyApi( 'playlist', params.stationId ) 
        miniStation.current = {
            id: foundPlaylist.id, 
            type : foundPlaylist.type,
            name: foundPlaylist.name,
            image: foundPlaylist.images ? foundPlaylist.images[0].url : 'not found',
            owner: foundPlaylist.owner.display_name,
            followers: foundPlaylist.followers.total,
            count: foundPlaylist.tracks.items.length,
            length: "about 4 hr 30 min",
            description: foundPlaylist.description
        }
        setTracks(foundPlaylist.tracks.items) 
    }
    if(!tracks || !miniStation.current.image) return <span> loading in progress... </span>
    return (
        <section className="station-details">
            <GeneralObjectHeader station={miniStation.current} isAlreadyAdded={false}/>

            <div className="tracks-container">
                <TracksList trackList={tracks}  isPlaylist={true}/>
            </div> 
        </section >
    )
}

