import { useParams } from "react-router"
import { stationService } from "../services/station.service"
import { useEffect, useRef, useState } from "react"
import { TrackPreview } from "../cmps/TrackPreview"
import { StationDetails_GeneralObjectActionButtons } from "../cmps/stationDetailsCmps/StationDetails_GeneralObjectActionButtons"
import { StationDetails_GeneralObjectHeader } from "../cmps/stationDetailsCmps/StationDetails_GeneralObjectHeader"
import { useSelector } from "react-redux"
import { setTrackJson } from "../services/util.service"
import { setCurrentlyPlayingArtist, setIsPlayingSong, setPlayingStationId } from "../store/song/song.actions"
import { StationDetails_GeneralObjectActionButtonsSticky } from "../cmps/stationDetailsCmps/StationDetails_GeneralObjectActionButtonsSticky"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"

export function ArtistDetails({ scrollableContainerRef  }) {
    const playingStationId = useSelector(storeState => storeState.playingStationId);
    const isPlaying = useSelector(storeState => storeState.isPlaying);
    const [isPlaylistPlaying, setIsPlaylistPlaying] = useState( false )
    const intialPlay = useRef(false)
    const params = useParams()
    let miniStation = useRef(null)
    const [ tracks , setTracks] = useState(null)
    const [fix, setFix] = useState(false);

    useEffect(() => {
        const scrollableElement = scrollableContainerRef?.current || window;
        scrollableElement.addEventListener("scroll", setFixed, true);
        return () => scrollableElement.removeEventListener("scroll", setFixed, true);
    }, [scrollableContainerRef]);

    function setFixed() {
        const scrollableElement = scrollableContainerRef?.current || document.documentElement;
        const y = scrollableElement.scrollTop || 0;

        if (y >= 200) {
            setFix(true);

        } else {
            setFix(false);
        }
    }

    function switchHader(isSticky) {
        if (isSticky) {
            return <StationDetails_GeneralObjectActionButtonsSticky station={miniStation.current} isAlreadyAdded={false}  imgSrc={miniStation.current.image} playlistTrack={tracks} isPlayingPlaylist={isPlaylistPlaying} onButtonClick={buttonClickFunc}/>

        }

        return <StationDetails_GeneralObjectActionButtons station={miniStation.current} isAlreadyAdded={false}  imgSrc={miniStation.current.image} playlistTrack={tracks} isPlayingPlaylist={isPlaylistPlaying} onButtonClick={buttonClickFunc}/>
    }

    useEffect(() => {
        loadTracks()
    }, [])

    async function loadTracks(){
        const foundArtist = await stationService.getStationById_SpotifyApi( 'artists', params.artistId ) 
        miniStation.current = {
            id: foundArtist.id, 
            type : foundArtist.type,
            name: foundArtist.name,
            image: foundArtist.images[0] ? foundArtist.images[0].url : null,
            followers: foundArtist.followers.total,
        }
        
        const getTopTracks = await stationService.getTopTracksByArtistId_SpotifiApi(foundArtist.id)
        setTracks(getTopTracks.tracks) 
    }

    async function buttonClickFunc(stationIdVar){
        try {
            console.log('here:')
            if (isPlaying && intialPlay.current) {
                setIsPlayingSong(false)
            } else {
                setIsPlaylistPlaying(true)
                intialPlay.current = true
                await onPlayArtist(tracks)
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

    async function onPlayArtist ( playlistTrack){
        try {      
            await setCurrentlyPlayingArtist ( playlistTrack)  
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

    if(!tracks) return 
    return (
        <section className="station-details-artist">
            <StationDetails_GeneralObjectHeader station={miniStation.current} />
                <div className={fix ? 'sticky-general-header' : 'general-header'}>
                    {switchHader(fix)}

                    <div className="os-scrollbar os-scrollbar-horizontal os-theme-spotify os-scrollbar-auto-hide os-scrollbar-handle-interactive os-scrollbar-track-interactive os-scrollbar-cornerless os-scrollbar-unusable os-scrollbar-auto-hide-hidden" >
                        <div className="os-scrollbar-track">
                            <div className="os-scrollbar-handle">
                            </div>
                        </div>
                    </div>
                    <h1>Popular</h1>
                    <div className='header-row-artist'>
                    </div>
                </div>
            <div className="tracks-container-artist">
                
                <br/>
                <div className="track-list-artist">
                    {tracks.map((track, index) => (
                        <TrackPreview track={track} trackAddedAt={track.added_at} tracksDisplayType={miniStation.current.type} index={index + 1} key={ track.id}/>       
                    ))}
                </div> 
            </div> 
        </section >
    )
}

