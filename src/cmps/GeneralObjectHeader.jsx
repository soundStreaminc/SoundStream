import { useState } from "react";
import Play from '../assets/svgs/play.svg?react'
import Pause from '../assets/svgs/pause.svg?react'
import AddToLiked from '../assets/svgs/addToLiked.svg?react';

export function GeneralObjectHeader({ station }){
    const [isPlaying, setIsPlaying] = useState( false );

    function getPlaylistCover(){
        if(station.image === 'not found'){
            console.log('error: no cover found for the playlist')     
        }
        return station.image   
    }

    function onPlayPauseClick(  ){
        if (isPlaying) {
            //audioRef.current.pause();// this will pause the audio
            setIsPlaying(false)
        } else {
          //audioRef.current.play();
          setIsPlaying(true)
        }
    };

    async function onPlayTrack ( track ){
        try {            
            var playCurrent = track ? await setCurrentlyPlaying ( track ) : ''  
            console.log(`playing:`, playCurrent.title)
            showSuccessMsg(`playing: ${playCurrent.title}`)           
        } catch (err) {
            console.error(err);
        }
    }
    console.log('station:', station)
    return(
        <section className="general-object-header">
            <div className="station-info">
                <div className="station-sub-info">
                    <div className="cover-station">
                        <img src={getPlaylistCover() || 'not found'} />
                    </div>
    
                    <div className="station-title2">
                        {station.type} <h2> {station.name} </h2>
                        {station.description}
                        <div className="station-sub-title">
                            <b> {station.owner} </b> *                        
                            {station.followers} save *
                            {station.count} songs, 
                            {/* TODO create a function to get the duration of the album. maybe api?*/}
                            {station.length}
                        </div>
                    </div>
                    
                </div>
            </div>
            <div className="general-object-header-btns">
                <div className='controll-btns2'>
                    {!isPlaying ? (
                    <button type="button" aria-label="Play" className="play playerButton4" onClick={() => onPlayPauseClick(false)}>
                        <span aria-hidden="true" className="iconWrapper">         
                            <Play className="action-btn4" />
                        </span>
                    </button>
                    ) : (
                    <button type="button" aria-label="Pause" className="pause playerButton4" onClick={() => onPlayPauseClick(true)}>
                        <Pause className="action-btn4" />
                    </button>
                    )}
                </div>  
                <button className="add-station-btn">
                    <span aria-hidden="true" className="iconWrapper">         
                        <AddToLiked className="add-to-liked" />
                    </span>
                </button> 
            </div>
            
        </section>
    )
}