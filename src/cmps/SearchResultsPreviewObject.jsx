import { useState } from 'react';
import Play from '../assets/svgs/play.svg?react'
import Pause from '../assets/svgs/pause.svg?react'
import NoImageArtist from '../assets/svgs/noImageArtist.svg?react';
import { useNavigate } from 'react-router';

export function SearchResultsPreviewObject({ miniObject , isPlayingSearchResult = false}){
    const [isPlaying, setIsPlaying] = useState(isPlayingSearchResult);
    const isArtistImageExist= miniObject.image ? true : false
    const navigate = useNavigate();

    function onPlayPauseClick( event ){
        event.preventDefault();
        event.stopPropagation();
        if (isPlaying) {
            setIsPlaying(false)
        } else {
          setIsPlaying(true)
        }
    }

    function onButtonClickHandler (  ) {
        navigate(`/${miniObject.type}/${miniObject.id}`);
    }

    return (
        <section className="search-results-preview-object">
            <div onClick={onButtonClickHandler}
                className="search-results-mini-details-container">      
                <div className="search-result-object-mini-details-sub-container">
                    <div className="search-result-object-music-cover-container">
                        {isArtistImageExist ? (
                            <img className="search-result-object-music-cover" src={miniObject.image}
                            alt={`track artwork for ${miniObject.name}`}
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
                        <p className="search-result-object-title">{miniObject.name}</p>
                        {miniObject.type === 'playlist' ? (
                            <p className="search-result-object-subtitle">By {miniObject.owner}</p>
                        ): ''}
                        {miniObject.type === 'album' ? (
                            <p className="search-result-object-subtitle">By {miniObject.artist}</p>
                        ): ''}
                       
                    </div>
                </div>
            </div>
                
        </section>
    )
}