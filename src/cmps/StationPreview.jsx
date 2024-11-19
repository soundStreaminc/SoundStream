import Play from '../assets/svgs/play.svg?react'
import Pause from '../assets/svgs/pause.svg?react'
import { useState } from 'react';

export function StationPreview({station, isPlayingPlaylist=false }) {
    const [isPlaying, setIsPlaying] = useState(isPlayingPlaylist);

    function onPlayPauseClick(  ){
        if (isPlaying) {
            //audioRef.current.pause();// this will pause the audio
            setIsPlaying(false)
        } else {
          //audioRef.current.play();
          setIsPlaying(true)
        }
    };

    return <section className="station-preview-container">
            <div className="mini-details-container">
                <div className="mini-details-sub-container">
                    <div className="station-preview-musicCover-container">
                        <img
                        className="station-preview-musicCover"
                        src={station?.image || ''}
                        alt={`track artwork for ${station?.title || 'not found'}`}
                        />
                    </div>       
                </div>     
                <div className="mini-details">
                    <div className="sub-mini-details">
                        <div className="station-title"> {station?.title || 'not found'} </div>
                        
                        <div className='controll-btns'>
                            {!isPlaying ? (
                            <button type="button" aria-label="Play" className="play playerButton3" onClick={() => onPlayPauseClick(false)}>
                                <span aria-hidden="true" className="iconWrapper">         
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