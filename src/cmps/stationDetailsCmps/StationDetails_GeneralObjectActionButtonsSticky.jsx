import MoreOptionFor from '../../assets/svgs/moreOptionFor.svg?react';
import { setTrackJson } from "../../services/util.service";
import { useEffect, useRef, useState } from "react";
import Play from '../../assets/svgs/play.svg?react'
import Pause from '../../assets/svgs/pause.svg?react'

import { stationService } from "../../services/station.service";
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service";
import { setCurrentlyPlaying } from "../../store/song/song.actions";
import { usePalette } from 'react-palette';

export function StationDetails_GeneralObjectActionButtonsSticky({ isAlreadyAdded , imgSrc = null}){
    const [isAdded, setIsAdded] = useState( isAlreadyAdded )
    const [isPlaying, setIsPlaying] = useState( false );
    const MYUSER = 'ohad'
    const MAXRECENTPLAYED = 4
    const { data, loading, error } = usePalette(imgSrc)

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

    return (
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

            <div className="station-title3"> {/* TODO: for song details should be song and not track- capital S, then name of song- name of artist */}
                            {station.type} 
                            <span className="station-title3-container">
                                <h1> {station.name} </h1>
                            </span>
                        </div>

          
        </div>
    )
}