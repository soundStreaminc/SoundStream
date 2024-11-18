import { useParams } from "react-router"
import { stationService } from "../services/station.service"
import { useEffect, useRef, useState } from "react"

import { TracksList } from "../cmps/TracksList"
import { GeneralObjectHeader } from "../cmps/GeneralObjectHeader"

export function ArtistDetails(  ) {
    const params = useParams()
    let miniStation = useRef(null)
    const [ tracks , setTracks] = useState(null)

    useEffect(() => {
        loadTracks()
    }, [])

    async function loadTracks(){
        const foundArtist = await stationService.getStationById_SpotifyApi( 'artists', params.artistId ) 
        miniStation.current = {
            id: foundArtist.id, 
            type : foundArtist.type,
            name: foundArtist.name,
            image: foundArtist.images ? foundArtist.images[0].url : 'not found',
            followers: foundArtist.followers.total,
        }
        const getTopTracks = await stationService.getTopTracksByArtistId_SpotifiApi(foundArtist.id)
        setTracks(getTopTracks.tracks) 
    }
    if(!tracks || !miniStation.current.image) return <span> loading in progress... </span>
    return (
        <section className="station-details">
            <GeneralObjectHeader station={miniStation.current} isAlreadyAdded={false}/>

            <div className="tracks-container">
                <TracksList trackList={tracks}  isPlaylist={false}/>
            </div> 
        </section >
    )
}

