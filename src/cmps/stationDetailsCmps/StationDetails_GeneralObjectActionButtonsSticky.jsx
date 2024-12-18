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

export function StationDetails_GeneralObjectActionButtonsSticky({ isAlreadyAdded, station, imgSrc = null, playlistTrack = null }) {
    const isPlaying = useSelector(storeState => storeState.isPlaying);
    
    const [isAdded, setIsAdded] = useState(isAlreadyAdded)
    const MYUSER = 'ohad'
    const MAXRECENTPLAYED = 4
    const { data, loading, error } = usePalette(imgSrc)

    console.log('export function StationDetails_GeneralObjectActionButtonsSticky({ isAlreadyAdded, station, imgSrc = null, playlistTrack = null }) isPlaying:', isPlaying)
    async function onPlayPauseClick() {
        if (isPlaying) {
            setIsPlayingSong(false)
        } else {
            await onPlayStation(station)
            setIsPlayingSong(true) //TODO only if the youtubeId is different. else it was paused and need to be played without adding.
            await addToRecentlyPlayed(station)
        }
    };

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

    async function onPlayStation(station) {
        try {
            switch (station.type) {
                case 'track':
                    onPlayTrack(station)
                    break;
                case 'playlist':
                    onPlayPlaylist(playlistTrack)
                    break;
                default:
                    console.log('error with the station type: ', station.type)
                    showErrorMsg('should not be here')
            }
            //TODO if playlist set store to playlist
            return
        } catch (err) {
            console.error(err);
        }
    }

    async function onPlayPlaylist(playlistTrack) {
        try {
            const songToPlay = {
                name: playlistTrack[0].track.name,
                artist: playlistTrack[0].track.artists[0].name,
                image: playlistTrack[0].track.album.images[0].url
            }

            const youtubeId = await youtubeService.getSongByName(songToPlay.artist + ' ' + songToPlay.name);
            var playCurrent = songToPlay ? await setCurrentlyPlayingTrack(songToPlay, youtubeId) : ''
            console.log(`playing:`, playCurrent)
            showSuccessMsg(`playing: ${playCurrent.title}`)
            return youtubeId
        } catch (err) {
            console.error(err);
        }
    }

    async function onPlayTrack(track) {
        try {
            const songToPlay = station.type === 'track' ? track : playlistTrack[0].track
            //TODO if playlist set store to playlist
            const youtubeId = await youtubeService.getSongByName(songToPlay.artist + ' ' + songToPlay.name);
            var playCurrent = songToPlay ? await setCurrentlyPlayingTrack(songToPlay, youtubeId) : ''
            console.log(`playing:`, playCurrent)
            showSuccessMsg(`playing: ${playCurrent.title}`)
            return youtubeId
        } catch (err) {
            console.error(err);
        }
    }

    async function addToRecentlyPlayed(track) {
        try {
            if (station.type !== 'track') return
            const trackJson = setTrackJson(track)
            await stationService.addToRecentlyPlayedByUser(trackJson, MAXRECENTPLAYED, 'ohad')     //TODO should be changed according to user    
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
            <span className="station-title3-container-stcky">
                    <h1> {station.name} </h1>
                </span>

        </div>
    )
}