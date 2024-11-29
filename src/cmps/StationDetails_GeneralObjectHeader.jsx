import { useEffect, useRef, useState } from "react";
import Play from '../assets/svgs/play.svg?react'
import Pause from '../assets/svgs/pause.svg?react'
import AddToLiked from '../assets/svgs/addToLiked.svg?react';
import LikedSongAdded from '../assets/svgs/likedSongAdded.svg?react';
import { stationService } from "../services/station.service";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service";
import { setCurrentlyPlaying, setRecentlyPlayed } from "../store/song/song.actions";
import { StationDetails_GeneralObjectMiniTitle } from "./StationDetails_GeneralObjectMiniTitle";
import { usePalette } from "react-palette";
import MoreOptionFor from '../assets/svgs/moreOptionFor.svg?react';
import { useSelector } from "react-redux";
import { setTrackJson } from "../services/util.service";

export function StationDetails_GeneralObjectHeader({ station , isAlreadyAdded = false}){
    const [isAdded, setIsAdded] = useState( isAlreadyAdded )
    const [isPlaying, setIsPlaying] = useState( false );
    const MYUSER = 'ohad'
    const imgSrc = station.image 
    const { data, loading, error } = usePalette(imgSrc)
    var recentlyPlayedArray = useSelector ( storeState => storeState.recentlyPlayed )
    const MAXRECENTPLAYED = 4

    async function onPlayPauseClick(  ){
        if (isPlaying) {
            //audioRef.current.pause();// this will pause the audio
            setIsPlaying(false)
        } else {
            await onPlayTrack(station)
            setIsPlaying(true)
            await addToRecentlyPlayed(station)
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
            if( !track.audio) console.log("this song has no preview url and will not be played")
            var playCurrent = track ? await setCurrentlyPlaying ( track ) : ''  
            console.log(`playing:`, playCurrent.title)
            showSuccessMsg(`playing: ${playCurrent.title}`)           
        } catch (err) {
            console.error(err);
        }
    }

    async function addToRecentlyPlayed ( track ){
        try {      
            if (station.type !== 'track') return  
            const trackJson = setTrackJson( track )
            await stationService.addToRecentlyPlayedByUser( trackJson ,MAXRECENTPLAYED, 'ohad')     //TODO should be changed according to user    
        } catch (err) {
            console.error(err);
        }
    }

    if (!station) return
    return(
        <section className="general-object-header">
            <div className="station-info-general"  style={{
                'backgroundImage': 'linear-gradient(' + data.vibrant + ', oklch(from ' + data.vibrant + ' calc(l - .5) c h))'
                }}>
                <div className="station-sub-info">
                    <div className="cover-station">
                        <img src={imgSrc} />
                    </div>
                    <div className="station-titles-container">
                        <div className="station-title3">
                            {station.type} 
                            <span className="station-title3-container">
                                <h1> {station.name} </h1>
                            </span>
                        </div>

                        <StationDetails_GeneralObjectMiniTitle miniStation={station}/>
                    </div>
                    
                    
                </div>
            </div>

            <div className="general-object-header-btns" style={{
                'backgroundImage': 'linear-gradient(oklch(from ' + data.vibrant + ' calc(l - .5) c h), black)'
                }}>
                <div className='controll-btns2'>
                    {!isPlaying ? (
                    <button type="button" aria-label="Play" className="play playerButton4" onClick={() => onPlayPauseClick(false)}>
                        <span className="button-inner">         
                            <span aria-hidden="true" className="station-details-iconWrapper">         
                                <Play className="action-btn4" />
                            </span>
                        </span>
                    </button>
                    ) : (
                    <button type="button" aria-label="Pause" className="pause playerButton4" onClick={() => onPlayPauseClick(true)}>
                        <span className="button-inner">         
                            <span aria-hidden="true" className="station-details-iconWrapper">         
                                <Pause className="action-btn4" />
                            </span>
                        </span>            
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
                            <span aria-hidden="true" className="remove-station-btn-iconWrapper">         
                                <LikedSongAdded className="remove-from-liked" />
                            </span>
                        </button> 
                    )}
                </div>

                <button className="general-object-header-icon">
                    <span aria-hidden="true" className="general-object-header-iconWrapper">
                        <MoreOptionFor className="general-object-header-more-option-for" />
                    </span>
                </button>
            </div>
        </section>
    )
}