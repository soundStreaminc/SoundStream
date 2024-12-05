import Play from '../assets/svgs/play.svg?react'
import Pause from '../assets/svgs/pause.svg?react'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export function CategoryPreview({category, categoryType = 'track',  isPlayingCategory= false }) {
    const [isPlaying, setIsPlaying] = useState(isPlayingCategory)
    const [track, setTrack] = useState(null)
    const navigate = useNavigate()

    useEffect( () =>{
        loadTrack()
    },[])

    function loadTrack(){
        if( categoryType === 'track')
            setTrack(category)
        if( categoryType === 'playlist' | categoryType === 'artist')
            setTrack({
                id: category.id,
                title: category.name,
                image: category.images? category.images[0].url :'not found' 
            })
    }

    function onPlayPauseClick( event ){
        event.preventDefault();
        event.stopPropagation();
        if (isPlaying) {
            //audioRef.current.pause();// this will pause the audio
            setIsPlaying(false)
        } else {
          //audioRef.current.play();
          setIsPlaying(true)
        }
    }

    function truncateText(text, maxLength) {
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    }

    function onButtonClickHandler (  ) {
        navigate(`/${categoryType}/${track.id}`);
    }

    if( !track) return <div> loading, please wait. </div>
    return (
        <section className="category-preview-container">
            <div onClick={onButtonClickHandler}
                className="category-mini-details-container">    
                <div className="category-mini-details-sub-container">
                    <div className="category-music-cover-container">
                        {track.image ? (
                            <img className="category-cover" src={track.image}
                                alt={`track artwork for ${track?.title || 'not found'}`}/>
                        ): ''}
                        <div className='category-btn-container'>
                            {!isPlaying ? (
                                <button type="button" aria-label="Play" className="category-btn" onClick={(e) => onPlayPauseClick(false)}>
                                    <span aria-hidden="true" className="category-svg-wrapper">
                                        <Play />
                                    </span>
                                </button>
                                ) : (
                                <button type="button" aria-label="Pause" className="category-btn" onClick={(e) => onPlayPauseClick(true)}>
                                    <span aria-hidden="true" className="category-svg-wrapper">
                                        <Pause className="action-btn6" />
                                    </span>
                                </button>
                            )}
                        </div>
                        
                        
                    </div>
            
                    <div className="category-details">
                        <div className="sub-category-details">
                            <div className="category-title"> {truncateText(track?.title || 'not found', 30)} </div>      
                        </div>
                    </div> 
                </div>
            </div>
        </section>
    )
}