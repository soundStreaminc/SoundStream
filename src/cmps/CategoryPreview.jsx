import Play from '../assets/svgs/play.svg?react'
import Pause from '../assets/svgs/pause.svg?react'
import { useState } from 'react';

export function CategoryPreview({category, isPlayingCategory= false }) {
    const [isPlaying, setIsPlaying] = useState(isPlayingCategory);

    function onPlayPauseClick(  ){
        if (isPlaying) {
            //audioRef.current.pause();// this will pause the audio
            setIsPlaying(false)
        } else {
          //audioRef.current.play();
          setIsPlaying(true)
        }
    };

    return <section className="category-preview-container">
            <div className="category-details-container">
                <div className="category-details-sub-container">
                    <div className="category-cover-container">
                        <img
                        className="category-cover"
                        src={category?.image || ''}
                        alt={`track artwork for ${category?.title || 'not found'}`}
                        />
                    </div>       
                </div>     
                <div className="category-details">
                    <div className="sub-category-details">
                        <div className="category-title"> {category?.title || 'not found'} </div>
                        
                        <div className='category-controll-btns'>
                            {!isPlaying ? (
                            <button type="button" aria-label="Play" className="play playerButton3" onClick={() => onPlayPauseClick(false)}>
                                <span aria-hidden="true" className="category-iconWrapper">         
                                    <Play className="action-btn3" />
                                </span>
                            </button>
                            ) : (
                            <button type="button" aria-label="Pause" className="pause playerButton3" onClick={() => onPlayPauseClick(true)}>
                                <Pause className="action-btn3" />
                            </button>
                            )}
                        </div>         
                    </div>
                </div> 
            </div>
        </section>
}