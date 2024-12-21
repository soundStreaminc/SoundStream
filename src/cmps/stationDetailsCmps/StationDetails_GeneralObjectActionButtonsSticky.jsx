import MoreOptionFor from '../../assets/svgs/moreOptionFor.svg?react';
import { setTrackJson } from "../../services/util.service";
import { useEffect, useRef, useState } from "react";
import Play from '../../assets/svgs/play.svg?react'
import Pause from '../../assets/svgs/pause.svg?react'
import AddToLiked from '../../assets/svgs/addToLiked.svg?react';
import LikedSongAdded from '../../assets/svgs/likedSongAdded.svg?react';
import { stationService } from "../../services/station.service";
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service";
import { setCurrentlyPlayingTrack } from "../../store/song/song.actions";
import { usePalette } from 'react-palette';
import { youtubeService } from '../../services/youtube.service';
import { useSelector } from 'react-redux';
import { useFirstRenderEffect } from '../useFirstRenderEffect';

export function StationDetails_GeneralObjectActionButtonsSticky({ isAlreadyAdded, station, imgSrc = null, playlistTrack = null, isPlayingPlaylist, onButtonClick}) {
    const [isPlayButtonClicked, setIsPlayButtonClicked] = useState(isPlayingPlaylist)
    const [isThisStationPlaying, setIsThisStationPlaying] = useState( false )
    const isPlaying = useSelector(storeState => storeState.isPlaying);

    const [isAdded, setIsAdded] = useState(isAlreadyAdded)
    const MYUSER = 'ohad'
    const MAXRECENTPLAYED = 4
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

    async function onAddRemoveClick() {
        if (isAdded) {
            //audioRef.current.pause();// this will pause the audio
            setIsAdded(false)
        } else {
            try {
                if (station.type === 'album') {
                    await stationService.addAlbum(station.id, station.name, station.type, MYUSER)
                }
                else if (station.type === 'playlist') {
                    await stationService.addPlaylist(station.id, station.name, station.type, MYUSER)
                } else if (station.type === 'track') {
                    await stationService.addTrackToLiked(station.id, station.name, station.type, MYUSER)
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
            <span className="station-title3-container-stcky">
                    <h1> {station.name} </h1>
                </span>

        </div>
    )
}