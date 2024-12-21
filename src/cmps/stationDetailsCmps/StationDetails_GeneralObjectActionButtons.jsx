import MoreOptionFor from '../../assets/svgs/moreOptionFor.svg?react';
import { setTrackJson } from "../../services/util.service";
import { useEffect, useState } from "react";
import Play from '../../assets/svgs/play.svg?react'
import Pause from '../../assets/svgs/pause.svg?react'
import AddToLiked from '../../assets/svgs/addToLiked.svg?react';
import LikedSongAdded from '../../assets/svgs/likedSongAdded.svg?react';
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service";
import { addStationToLibrary, removeStationFromLibrary, setCurrentlyPlayingAlbum, setCurrentlyPlayingArtist, setCurrentlyPlayingPlaylist, setCurrentlyPlayingTrack } from "../../store/song/song.actions";
import { usePalette } from 'react-palette';
import { youtubeService } from '../../services/youtube.service';
import { useFirstRenderEffect } from '../useFirstRenderEffect';
import { useSelector } from 'react-redux';

export function StationDetails_GeneralObjectActionButtons({ isAlreadyAdded, station, imgSrc = null, playlistTrack = null, isPlayingPlaylist, onButtonClick}){
    const [isAdded, setIsAdded] = useState( isAlreadyAdded )
    const [isPlayButtonClicked, setIsPlayButtonClicked] = useState(isPlayingPlaylist)
    const [isThisStationPlaying, setIsThisStationPlaying] = useState( false )
    const isPlaying = useSelector(storeState => storeState.isPlaying);

    const MYUSER = 'ohad'
    const { data, loading, error } = usePalette(imgSrc)

    useFirstRenderEffect(() => {
        setIsThisStationPlaying(onButtonClick(station.id))
    }, [isPlayButtonClicked])

    async function onPlayPauseClick(  ){
        if (isPlaying) {
            setIsPlayButtonClicked(false)
        } else {
            setIsThisStationPlaying(true)
            setIsPlayButtonClicked(true)
        }
    }

    async function onAddRemoveClick(  ){
        if (isAdded) {
            try {    
                if( station.type === 'album' || station.type === 'playlist'){
                    await removeStationFromLibrary( station.id, station.name, station.type,  MYUSER)                      
                } else if (station.type === 'track'){
                    //await stationService.addTrackToLiked ( station.id, station.name, station.type,  MYUSER)
                }
                setIsAdded(false)
            }   catch (err) {
                console.log('err:', err)
                showErrorMsg('problem Removing station: ', err)
            }        
        } else {
            try {    
                if( station.type === 'album' || station.type === 'playlist'){
                    await addStationToLibrary( station.id, station.name, station.type,  MYUSER)                      
                } else if (station.type === 'track'){
                    //await stationService.addTrackToLiked ( station.id, station.name, station.type,  MYUSER)
                }
                setIsAdded(true)
            } catch (err) {
                console.log('err:', err)
                showErrorMsg('problem Adding station: ', err)
            }            
        }
    }

    return (
        <div className="general-object-header-btns" style={{
            'backgroundImage': 'linear-gradient(oklch(from ' + data.vibrant + ' calc(l - .5) c h), black)'
            }}>
            <div className='controll-btns2'>
                {(isThisStationPlaying ? !isPlaying: true) ? (
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
            {station.type !== 'artist' && (
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
            </div>)}

            {station.type === 'artist' && (
        <button className='following-artist'>
            Follow
        </button>
    )}

            <button className="general-object-header-icon">
                <span aria-hidden="true" className="general-object-header-iconWrapper">
                    <MoreOptionFor className="general-object-header-more-option-for" />
                </span>
            </button>
        </div>
    )
}