import { useParams } from "react-router"
import { stationService } from "../services/station.service"
import { useEffect, useRef, useState } from "react"
import Duration from '../assets/svgs/duration.svg?react'
import { TrackPreview } from "../cmps/TrackPreview"
import { StationDetails_GeneralObjectActionButtons } from "../cmps/stationDetailsCmps/StationDetails_GeneralObjectActionButtons"
import { StationDetails_GeneralObjectHeader } from "../cmps/stationDetailsCmps/StationDetails_GeneralObjectHeader"
import { StationDetails_GeneralObjectActionButtonsSticky } from "../cmps/stationDetailsCmps/StationDetails_GeneralObjectActionButtonsSticky"
import { useSelector } from "react-redux"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"
import { setCurrentlyPlayingAlbum, setCurrentlyPlayingArtist, setCurrentlyPlayingPlaylist, setIsPlayingSong, setPlayingStationId } from "../store/song/song.actions"
import { setTrackJson } from "../services/util.service"

export function AlbumDetails({ scrollableContainerRef }) {
    const playingStationId = useSelector(storeState => storeState.playingStationId);
    const isPlaying = useSelector(storeState => storeState.isPlaying);
    const [isPlaylistPlaying, setIsPlaylistPlaying] = useState( false )
    const params = useParams();
    const intialPlay = useRef(false)
    const miniStation = useRef({
        id: null,
        type: '',
        name: '',
        image: '',
        owner: '',
        followers: 0,
        count: 0,
        length: '',
        description: ''
    });
    const [tracks, setTracks] = useState(null);
    const [fix, setFix] = useState(false);

    useEffect(() => {
        loadTracks();
    }, []);

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
            return <StationDetails_GeneralObjectActionButtonsSticky isAlreadyAdded={false} station={miniStation.current} imgSrc={miniStation.current.image} playlistTrack={tracks} isPlayingPlaylist={isPlaylistPlaying} onButtonClick={buttonClickFunc}/>

        }

        return <StationDetails_GeneralObjectActionButtons isAlreadyAdded={false} station={miniStation.current} imgSrc={miniStation.current.image} playlistTrack={tracks} isPlayingPlaylist={isPlaylistPlaying} onButtonClick={buttonClickFunc}/>
    }

    async function loadTracks() {
        const foundAlbum = await stationService.getStationById_SpotifyApi('album', params.albumId)
        console.log('foundAlbum:', foundAlbum)
        miniStation.current = {
            id: foundAlbum.id,
            type: foundAlbum.type,
            name: foundAlbum.name,
            image: foundAlbum.images ? foundAlbum.images[0].url : 'not found',
            count: foundAlbum.total_tracks,
            length: "about 4 hr 30 min",
            artist: foundAlbum.artists? foundAlbum.artists[0].name: null,
            artistId: foundAlbum.artists? foundAlbum.artists[0].id: null,
            releaseDate: foundAlbum.release_date
        }
        setTracks(foundAlbum.tracks.items)
    }
    console.log('tracks:', tracks)
    async function buttonClickFunc(stationIdVar){
        try {
            console.log('here:')
            if (isPlaying && intialPlay.current) {
                setIsPlayingSong(false)
            } else {
                setIsPlaylistPlaying(true)
                intialPlay.current = true
                await onPlayAlbum(tracks)
                setIsPlayingSong(true)
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

    async function onPlayAlbum ( playlistTrack){
        try {      
            await setCurrentlyPlayingAlbum ( playlistTrack, miniStation.current.image)  
            console.log(`playing:`, playlistTrack)
            showSuccessMsg(`playing: ${playlistTrack.name}`)  
        } catch (err) {
            console.error(err);
        }
    }

    if (!tracks || !miniStation.current.image) return 
    return (
        <section className="album-details">
            <StationDetails_GeneralObjectHeader station={miniStation.current} />
            <div className={fix ? 'sticky-general-header' : 'general-header'}>
                {switchHader(fix)}

                <div className="os-scrollbar os-scrollbar-horizontal os-theme-spotify os-scrollbar-auto-hide os-scrollbar-handle-interactive os-scrollbar-track-interactive os-scrollbar-cornerless os-scrollbar-unusable os-scrollbar-auto-hide-hidden" >
                    <div className="os-scrollbar-track">
                        <div className="os-scrollbar-handle">
                        </div>
                    </div>
                </div>
                <div className='header-row-album'>
                    <div className="header-index-album">
                        <p> # </p>
                    </div>

                    <div className="header-title-album">
                        <p> Title </p>
                    </div>

                    <div className="header-duration-album">
                        <span aria-hidden="true" className="iconWrapper-album">
                            <Duration className="duration-headerImage-album" />
                        </span>
                    </div>
                </div>
                <br />
            </div>
            <div className="track-list-album">
                {tracks.map((track, index) => (
                    // <TrackPreview track={track} index={index} key={track.track? track.track.id: track.id} isPlaylist={false}/>    
                    <TrackPreview track={track} index={index + 1} key={track.id} />
                ))}
            </div>
        </section >
    )
}