import { useParams } from "react-router"
import { stationService } from "../services/station.service"
import { useEffect, useRef, useState } from "react"
import Play from '../assets/svgs/play.svg?react'
import Pause from '../assets/svgs/pause.svg?react'
import AddToLiked from '../assets/svgs/addToLiked.svg?react';
import Duration from '../assets/svgs/duration.svg?react'
import { TrackPreview } from "../cmps/TrackPreview"

export function PlaylistDetails(  ) {
    const params = useParams()
    let miniStation = useRef(null)
    const [ tracks , setTracks] = useState(null)
    const [isAdded, setIsAdded] = useState( false )
    const [isPlaying, setIsPlaying] = useState( false );
    const MYUSER = 'ohad'

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

    function getPlaylistCover(){
        if(miniStation.current.image === 'not found'){
            console.log('error: no cover found for the playlist')     
        }
        return miniStation.current.image   
    }

    function onPlayPauseClick(  ){
        if (isPlaying) {
            //audioRef.current.pause();// this will pause the audio
            setIsPlaying(false)
        } else {
            //onPlayTrack(miniStation.current)
            setIsPlaying(true)
        }
    };

    async function onAddRemoveClick(  ){
        if (isAdded) {
            //audioRef.current.pause();// this will pause the audio
            setIsAdded(false)
        } else {
            try {        
                await stationService.addPlaylist ( miniStation.current.id, miniStation.current.name, miniStation.current.type,  MYUSER)
                setIsAdded(true)
            } catch (err) {
                console.log('err:', err)
                showErrorMsg('problem Adding station: ', err)
            }            
        }
    }

    // async function onPlayTrack ( track ){
    //     try {      
    //         var playCurrent = track ? await setCurrentlyPlaying ( track ) : ''  
    //         console.log(`playing:`, playCurrent.title)
    //         showSuccessMsg(`playing: ${playCurrent.title}`)           
    //     } catch (err) {
    //         console.error(err);
    //     }
    // }

    if(!tracks || !miniStation.current.image) return <span> loading in progress... </span>
    return (
        <section className="station-details">
            {/* <StationDetails_GeneralObjectHeader station={miniStation.current} isAlreadyAdded={false}/> */}
            <div className="station-info">
                <div className="station-sub-info">
                    <div className="cover-station">
                        <img src={getPlaylistCover() || 'not found'} />
                    </div>
                    <div className="station-titles-container">
                        <div className="station-title3">
                            {miniStation.current.type} 
                            <span className="station-title3-container">
                                <h1> {miniStation.current.name} </h1>
                            </span>
                        </div>

                        <div className="station-title4">
                            <span className="station-title4-container">
                                {miniStation.current.description}
                            </span>
                            <div className="station-sub-title">
                                <b> {miniStation.current.owner} </b> *                        
                                {miniStation.current.followers} save *
                                {miniStation.current.count} songs, 
                                {/* TODO create a function to get the duration of the album. maybe api?*/}
                                {miniStation.current.length}
                            </div>
                        </div>  
                    </div>
                    
                    
                </div>
            </div>

            <div className="general-object-header-btns">
                <div className='controll-btns2'>
                    {!isPlaying ? (
                    <button type="button" aria-label="Play" className="play playerButton4" onClick={() => onPlayPauseClick(false)}>
                        <span aria-hidden="true" className="iconWrapper">         
                            <Play className="action-btn4" />
                        </span>
                    </button>
                    ) : (
                    <button type="button" aria-label="Pause" className="pause playerButton4" onClick={() => onPlayPauseClick(true)}>
                        <Pause className="action-btn4" />
                    </button>
                    )}
                </div>  

                <div className='controll-btns3'>
                    {!isAdded ? (
                        <button className="add-station-btn" type="button" aria-label="Save To Your Library" onClick={() => onAddRemoveClick(false)}>
                            <span aria-hidden="true" className="iconWrapper">         
                                <AddToLiked className="add-to-liked" />
                            </span>
                        </button> 
                    ) : (
                        <button className="remove-station-btn"  type="button" aria-label="Remove From Your Library" onClick={() => onAddRemoveClick(true)}>
                            <span aria-hidden="true" className="iconWrapper">         
                                <LikedSongAdded className="remove-from-liked" />
                            </span>
                        </button> 
                    )}
                </div>
            </div>

            <div className="tracks-container">
                {/* <TracksList trackList={tracks}  isPlaylist={true}/> */}
                <div className='header-row-playlist'>
                <div className="header-index">
                    <p> # </p> 
                </div>
                
                <div className="header-title">
                    <p> Title </p> 
                </div>

                <div className="header-album">
                    <p> Album </p> 
                </div>

                <div className="header-date-added">
                    <p> Date added </p> 
                </div>
                       
                <div className="header-duration-playlist">
                    <span aria-hidden="true" className="iconWrapper-playlist">         
                        <Duration className="duration-headerImage-playlist"/>
                    </span>   
                </div>
            </div>
            <br/>
            <div className="track-list-playlist">
                {tracks.map((track, index) => (
                    <TrackPreview track={track} index={index} key={track.track? track.track.id: track.id} isPlaylist={true}/>       
                ))}
                </div> 
            </div> 
        </section >
    )
}

