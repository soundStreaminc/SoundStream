import MoreOptionFor from '../../assets/svgs/moreOptionFor.svg?react';
import { setTrackJson } from "../../services/util.service";
import { useEffect, useRef, useState } from "react";
import Play from '../../assets/svgs/play.svg?react'
import Pause from '../../assets/svgs/pause.svg?react'
import AddToLiked from '../../assets/svgs/addToLiked.svg?react';
import LikedSongAdded from '../../assets/svgs/likedSongAdded.svg?react';
import { stationService } from "../../services/station.service";
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service";
import { setCurrentlyPlayingPlaylist, setCurrentlyPlayingTrack } from "../../store/song/song.actions";
import { usePalette } from 'react-palette';
import { youtubeService } from '../../services/youtube.service';

export function StationDetails_GeneralObjectActionButtons({ isAlreadyAdded, station, imgSrc = null, playlistTrack = null}){
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
            const youtubeId = await onPlayStation(station)
            setIsPlaying(true)
            await addToRecentlyPlayed(station, youtubeId)
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

    async function onPlayStation ( station ){
        try {      
            switch (station.type){
                case 'track':
                    return onPlayTrack(station)
                case 'playlist':
                    return onPlayPlaylist(playlistTrack)
                default: 
                    console.log('error with the station type: ', station.type)
                    showErrorMsg('should not be here')
                    return          
            }
        } catch (err) {
            console.error(err);
            return
        }
    }

    async function onPlayPlaylist ( playlistTrack){
        try {      
            await setCurrentlyPlayingPlaylist ( playlistTrack)  
            console.log(`playing:`, playlistTrack)
            showSuccessMsg(`playing: ${playlistTrack.name}`)  
        } catch (err) {
            console.error(err);
        }
    }

    async function onPlayTrack ( track ){
        try {      
            const songToPlay = station.type === 'track' ? track : playlistTrack[0].track
            console.log('songToPlay:', songToPlay)
            console.log("songToPlay.artist + ' ' + songToPlay.name:", songToPlay.artist + ' ' + songToPlay.name)
            const youtubeId = await youtubeService.getSongByName(songToPlay.artist + ' ' + songToPlay.name);
            console.log('youtubeId:', youtubeId)
            var playCurrent = songToPlay ? await setCurrentlyPlayingTrack ( songToPlay , youtubeId) : ''  
            console.log(`playing:`, playCurrent)
            showSuccessMsg(`playing: ${playCurrent.title}`)  
            return youtubeId         
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
    )
}