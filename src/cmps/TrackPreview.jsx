import Play from '../assets/svgs/play.svg?react'
import Pause from '../assets/svgs/pause.svg?react'
import { useState } from 'react';

export function TrackPreview({track, index, isPlayingPlaylist=false }) {
    const [isPlaying, setIsPlaying] = useState(isPlayingPlaylist);

    function onPlayPauseClick(  ){
        if (isPlaying) {
            //audioRef.current.pause();// this will pause the audio
            setIsPlaying(false)
        } else {
          //audioRef.current.play();
          setIsPlaying(true)
        }
    }

    function getFormattedDate(dateVar) {
        let date = new Date(dateVar);
        let year = date.getFullYear();
        let month = date.toLocaleString("en-US", { month: "short" })
        //let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
      
        return month + ' ' + day + '/' + year;
    }

    function convertMsToMinutes( miliSeconds ){
        const ms = miliSeconds 
        const mmss = new Date(ms).toLocaleTimeString().substring(3, 7)
        return mmss
    }

    return <section className="track-preview-container">
        <div className='track-number'>
            {index}
        </div>

        <div className='track-name'> 
            {track.track.name} 
            {/* <button type="button" onClick={() => onPlayTrack(track.track)}> PLay Song </button> */}
        </div>

        <div className='track-album'> 
            {track.track.album.name} 
        </div>

        <div className='track-date-added'> 
            {getFormattedDate(track.added_at)} 
        </div>
        
        <div className='track-duration'>
            {convertMsToMinutes(track.track.duration_ms)} 
        </div>
            {/* <div className="mini-details-container">
                <div className="mini-details-sub-container">
                    <div className="musicCover-container">
                        <img
                        className="musicCover"
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
            </div> */}
        </section>
}