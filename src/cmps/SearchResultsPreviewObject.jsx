import { useState } from 'react';
import Play from '../assets/svgs/play.svg?react'
import Pause from '../assets/svgs/pause.svg?react'
import NoImageArtist from '../assets/svgs/noImageArtist.svg?react';
import { useNavigate } from 'react-router';
import { setCurrentlyPlayingPlaylist, setCurrentlyPlayingTrack } from '../store/song/song.actions';
import { setTrackJson } from '../services/util.service';

export function SearchResultsPreviewObject({ miniObject , isPlayingSearchResult = false, playlistTrack = null }){
    const [isPlaying, setIsPlaying] = useState(isPlayingSearchResult);
    const isArtistImageExist= miniObject.image ? true : false
    const isArtistImage= miniObject.type === "artist" ? true : false
    const navigate = useNavigate();

    async function onPlayPauseClick( event ){
        event.preventDefault();
        event.stopPropagation();
        if (isPlaying) {
            setIsPlaying(false)
        } else {
            const youtubeId = await onPlayStation(miniObject)
            setIsPlaying(true)
            await addToRecentlyPlayed(station, youtubeId)
        }
    }

    function onButtonClickHandler (  ) {
        navigate(`/${miniObject.type}/${miniObject.id}`);
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

    
    function truncateText(text, maxLength) {
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    }

    return (
        <section className="search-results-preview-object">
            <div onClick={onButtonClickHandler}
                className="search-results-mini-details-container">      
                <div className="search-result-object-mini-details-sub-container">
                    <div className="search-result-object-music-cover-container">
                        {isArtistImageExist ? (
                            <img className={isArtistImage ? "search-result-object-music-cover-artist" : "search-result-object-music-cover"} src={miniObject.image}
                            alt={`track artwork for ${truncateText(miniObject?.name || 'not found', 20)}`}
                        />): <NoImageArtist />}
                        
                        <div className='search-results-item-btn-container'>
                            {!isPlaying ? (
                            <button type="button" aria-label="Play" className="search-results-item-btn" onClick={(e) => onPlayPauseClick(e)}>
                                <span aria-hidden="true" className="search-results-item-svg-wrapper">         
                                    <Play />
                                </span>
                            </button>
                            ) : (
                            <button type="button" aria-label="Pause" className="search-results-item-btn" onClick={(e) => onPlayPauseClick(e)}>
                                <span aria-hidden="true" className="search-results-item-svg-wrapper">         
                                    <Pause />
                                </span>
                            </button>
                            )}
                        </div> 
                    </div>
            
                    <div className="search-result-object-mini-details">
                        <p className="search-result-object-title">{truncateText(miniObject?.name || 'not found', 20)}</p>
                        {miniObject.type === 'playlist' ? (
                            <p className="search-result-object-subtitle">By {truncateText(miniObject?.owner || 'not found', 20)}</p>
                        ): ''}
                        {miniObject.type === 'album' ? (
                            <p className="search-result-object-subtitle">By {truncateText(miniObject?.artist || 'not found', 20)}</p>
                        ): ''}
                       
                    </div>
                </div>
            </div>
                
        </section>
    )
}