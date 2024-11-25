import { useState } from "react";
import Play from '../assets/svgs/play.svg?react'
import Pause from '../assets/svgs/pause.svg?react'
import AddToLiked from '../assets/svgs/addToLiked.svg?react';
import LikedSongAdded from '../assets/svgs/likedSongAdded.svg?react';
import { stationService } from "../services/station.service";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service";
import { setCurrentlyPlaying } from "../store/song/song.actions";

export function StationDetails_GeneralObjectHeader({ station , isAlreadyAdded = false}){
    const [isAdded, setIsAdded] = useState( isAlreadyAdded )
    const [isPlaying, setIsPlaying] = useState( false );
    const MYUSER = 'ohad'

    function getPlaylistCover(){
        if(station.image === 'not found'){
            console.log('error: no cover found for the playlist')     
        }
        return station.image   
    }

    function onPlayPauseClick(  ){
        if (isPlaying) {
            //audioRef.current.pause();// this will pause the audio
            setIsPlaying(false)
        } else {
            onPlayTrack(station)
            setIsPlaying(true)
        }
    };

    async function onAddRemoveClick(  ){
        if (isAdded) {
            //audioRef.current.pause();// this will pause the audio
            setIsAdded(false)
        } else {
            try {    
                if( station.type === 'album'){
                    await stationService.addAlbum (station.id, station.name, station.type,  MYUSER)
                }
                else if (station.type === 'playlist'){
                    await stationService.addPlaylist ( station.id, station.name, station.type,  MYUSER)
                } else if (station.type === 'track'){
                    await stationService.addTrackToLiked ( station.id, station.name, station.type,  MYUSER)
                }
                setIsAdded(true)
            } catch (err) {
                console.log('err:', err)
                showErrorMsg('problem Adding station: ', err)
            }            
        }
    }

    async function onPlayTrack ( track ){
        try {      
            if (station.type !== 'track') return      
            var playCurrent = track ? await setCurrentlyPlaying ( track ) : ''  
            console.log(`playing:`, playCurrent.title)
            showSuccessMsg(`playing: ${playCurrent.title}`)           
        } catch (err) {
            console.error(err);
        }
    }

    if (!station) return
    return(
        <section className="general-object-header">
            <div className="station-info-general">
                <div className="station-sub-info">
                    <div className="cover-station">
                        <img src={getPlaylistCover() || 'not found'} />
                    </div>
                    <div className="station-titles-container">
                        <div className="station-title3">
                            {station.type} 
                            <span className="station-title3-container">
                                <h1> {station.name} </h1>
                            </span>
                        </div>

                        <div className="station-title4">
                            <span className="station-title4-container">
                                {station.description}
                            </span>
                            <div className="station-sub-title">
                                <b> {station.owner} </b> *                        
                                {station.followers} save *
                                {station.count} songs, 
                                {/* TODO create a function to get the duration of the album. maybe api?*/}
                                {station.length}
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
        </section>
    )
}