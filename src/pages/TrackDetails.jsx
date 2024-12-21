import { useParams } from "react-router"
import { stationService } from "../services/station.service"
import { useEffect, useRef, useState } from "react"
import { duration } from "@mui/material"
import { StationDetails_GeneralObjectActionButtons } from "../cmps/stationDetailsCmps/StationDetails_GeneralObjectActionButtons"
import { StationDetails_GeneralObjectHeader } from "../cmps/stationDetailsCmps/StationDetails_GeneralObjectHeader"
import { useSelector } from "react-redux"
import { setTrackJson } from "../services/util.service"
import { setCurrentlyPlayingTrack, setIsPlayingSong, setPlayingStationId } from "../store/song/song.actions"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"

export function TrackDetails(){
    const params = useParams()
    let miniStation = useRef(null)
    const [track, setTrack] = useState( null)
    const playingStationId = useSelector(storeState => storeState.playingStationId);
    const isPlaying = useSelector(storeState => storeState.isPlaying);
    const [isPlaylistPlaying, setIsPlaylistPlaying] = useState( false )
    const intialPlay = useRef(false)
    const MAXRECENTPLAYED = 10

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

    async function buttonClickFunc(stationIdVar){
        try {
            console.log('here:')
            if (isPlaying && intialPlay.current) {
                setIsPlayingSong(false)
            } else {
                setIsPlaylistPlaying(true)
                intialPlay.current = true
                await onPlayTrack(track)
                setIsPlayingSong(true)
                await addToRecentlyPlayed(miniStation.current)
                const currentStationPlayingId = playingStationId === stationIdVar ? true : false
                await setPlayingStationId(stationIdVar)
                console.log('currentStationPlayingId:', currentStationPlayingId)
                return currentStationPlayingId
            }
        } catch (err) {
            console.log('err:', err)
            showErrorMsg("could not search email")
        }
       
    }

    async function onPlayTrack ( playlistTrack){
        try {      
            await setCurrentlyPlayingTrack ( playlistTrack)  
            console.log(`playing:`, playlistTrack)
            showSuccessMsg(`playing: ${playlistTrack.name}`)  
        } catch (err) {
            console.error(err);
        }
    }

    async function addToRecentlyPlayed ( track ){
        try {      
            if (miniStation.current.type !== 'track') return  
            const trackJson = setTrackJson( track )
            await stationService.addToRecentlyPlayedByUser( trackJson ,MAXRECENTPLAYED, 'ohad')     //TODO should be changed according to user    
        } catch (err) {
            console.error(err);
        }
    }
    if(!track) return 
    return (
        <section className="track-details-container">
                <StationDetails_GeneralObjectHeader station={track} />
                <StationDetails_GeneralObjectActionButtons station={miniStation.current} isAlreadyAdded={false}  imgSrc={miniStation.current.image}  isPlayingPlaylist={isPlaylistPlaying} onButtonClick={buttonClickFunc}/>

        </section >
    )
}