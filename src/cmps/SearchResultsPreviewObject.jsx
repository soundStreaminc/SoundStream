import { useState } from 'react';
import Play from '../assets/svgs/play.svg?react'

export function SearchResultsPreviewObject({ miniObject , isPlayingSearchResult = false}){
    const [isPlaying, setIsPlaying] = useState(isPlayingSearchResult);

    function onPlayPauseClick(  ){
        if (isPlaying) {
            setIsPlaying(false)
        } else {
          setIsPlaying(true)
        }
    };
    return (
        <section className="search-results-preview-object">
            <a href={`/${miniObject.type}/${miniObject.id}`}
                className="search-results-mini-details-container">      
                <div className="search-result-object-mini-details-sub-container">
                    <div className="search-result-object-music-cover-container">
                        {miniObject.image ? (
                            <img className="search-result-object-music-cover" src={miniObject.image}
                            alt={`track artwork for ${miniObject.name}`}
                        />): ''}
                         {!isPlaying ? (
                        <button type="button" aria-label="Play" className="play playerButton7" onClick={() => onPlayPauseClick(false)}>
                            <span aria-hidden="true" className="search-result-object-play-wrapper">
                                <Play className="action-btn5" />
                            </span>
                        </button>
                        ) : (
                        <button type="button" aria-label="Pause" className="pause playerButton7" onClick={() => onPlayPauseClick(true)}>
                            <span aria-hidden="true" className="search-result-object-play-wrapper">
                                <Pause className="action-btn5" />
                            </span>
                        </button>
                    )}
                    </div>
            
                    <div className="search-result-object-mini-details">
                        <p className="search-result-object-title">{miniObject.name}</p>
                        {miniObject.type === 'playlist' ? (
                            <p className="search-result-object-subtitle">By {miniObject.owner}</p>
                        ): ''}
                        {miniObject.type === 'album' ? (
                            <p className="search-result-object-subtitle">By {miniObject.artist}</p>
                        ): ''}
                       
                    </div>
                </div>
            </a>
                
        </section>
    )
}