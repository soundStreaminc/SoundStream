import Play from '../assets/svgs/play.svg?react'
import Pause from '../assets/svgs/pause.svg?react'; 
import NoImageArtist from '../assets/svgs/noImageArtist.svg?react';
import {  useState } from 'react';

export function StationFilterDetails_TopResult({ topResult, isPlayingSearchResult = false }){ //TODO: search between artist/track/playlist. for now it is hard coded for artist.
    const [isPlaying, setIsPlaying] = useState(isPlayingSearchResult);
    const isArtistImageExist= topResult.images[0] ? true : false

    function onPlayPauseClick() {
        if (isPlaying) {
            setIsPlaying(false)
        } else {
            setIsPlaying(true)
        }
    }

    return(
        <div className="top-result-container">
        <div className="top-result-sub-container">
            <div className="artist-image-container" >
                {isArtistImageExist ? (<img className="artist-image" src={topResult.images[0].url} />  ):
                <NoImageArtist />}                         
            </div>
            <div className="artist-name">
                {topResult.name ? topResult.name : "not found"}
            </div>

            <span> Artist </span>
            <div className='top-result-item-btn-container'>
                {!isPlaying ? (
                    <button type="button" aria-label="Play" className="search-results-item-btn" onClick={() => onPlayPauseClick(false)}>
                        <span aria-hidden="true" className="search-results-item-svg-wrapper">
                            <Play />
                        </span>
                    </button>      
                ) : (
                    <button type="button" aria-label="Pause" className="search-results-item-btn" onClick={() => onPlayPauseClick(true)}>
                        <span aria-hidden="true" className="search-results-item-svg-wrapper">
                            <Pause />
                        </span>
                    </button>
                )}
            </div>
        </div>
    </div>
    )
}