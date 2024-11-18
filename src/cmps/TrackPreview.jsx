import Play from '../assets/svgs/play.svg?react'
import Pause from '../assets/svgs/pause.svg?react'
import { useState } from 'react';

export function TrackPreview({track, index, isPlaylist, isPlayingPlaylist=false }) {
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

        <div className='track-title'>
            {isPlaylist ? (
                <div className='track-image'> 
                <img src={track.track.album.images[0].url} className='album-cover-image'/>
                {/* <button type="button" onClick={() => onPlayTrack(track.track)}> PLay Song </button> */}
                </div>
            ):''}
           
            <div className='name-artist-container'>
                <a href={`/track/${track.track ? track.track.id : track.id}`} className='track-name'> 
                    {track.track ? track.track.name: track.name} 
                    {/* <button type="button" onClick={() => onPlayTrack(track.track)}> PLay Song </button> */}
                </a>
                <div className='track-artist'> 
                    {track.track ? track.track.artists[0].name: track.artists[0].name} 
                    {/* <button type="button" onClick={() => onPlayTrack(track.track)}> PLay Song </button> */}
                </div>
            </div>
            
        </div>

        {isPlaylist ? (
        <div className='track-album'> 
            {track.track.album.name} 
        </div>):''}

        {isPlaylist ? (
        <div className='track-date-added'> 
            {getFormattedDate(track.added_at)} 
        </div>):''}
        
        <div className='track-duration'>
            {convertMsToMinutes(track.track ? track.track.duration_ms : track.duration_ms)} 
        </div>
    </section>
}