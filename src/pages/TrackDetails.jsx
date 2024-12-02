import { useParams } from "react-router"
import { stationService } from "../services/station.service"
import { useEffect, useRef, useState } from "react"
import { duration } from "@mui/material"
import { StationDetails_GeneralObjectActionButtons } from "../cmps/stationDetailsCmps/StationDetails_GeneralObjectActionButtons"
import { StationDetails_GeneralObjectHeader } from "../cmps/stationDetailsCmps/StationDetails_GeneralObjectHeader"

export function TrackDetails(){
    const params = useParams()
    let miniStation = useRef(null)
    const [track, setTrack] = useState( null)

    useEffect(() => {
        loadTracks()
    }, [])

    async function loadTracks(){
        const foundTrack = await stationService.getStationById_SpotifyApi( 'tracks', params.trackId ) 

        miniStation.current = {
            id: foundTrack.id, 
            type : foundTrack.type,
            name: foundTrack.name,
            image: foundTrack.album ? foundTrack.album.images[0].url : 'not found',
            length: foundTrack.duration_ms,
            artist: foundTrack.artists[0].name,
            audio: foundTrack.preview_url,
            album: foundTrack.album.name,
            releaseDate: foundTrack.album.release_date,
            duration: foundTrack.duration_ms
        }
        setTrack(miniStation.current)
    }
    if(!track) return <span> loading in progress... </span>
    return (
        <section className="track-details-container">
                <StationDetails_GeneralObjectHeader station={track} />
                <StationDetails_GeneralObjectActionButtons isAlreadyAdded={false}  imgSrc={miniStation.current.image} />

        </section >
    )
}