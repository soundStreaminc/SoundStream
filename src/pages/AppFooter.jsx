import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import YouTube from "react-youtube";
import NowPlayingView from '../assets/svgs/nowPlayingView.svg?react'
import Lyrics from '../assets/svgs/lyrics.svg?react'
import Queue from '../assets/svgs/queue.svg?react'
import ConnectToDevice from '../assets/svgs/connectToDevice.svg?react'
import Mute from '../assets/svgs/mute.svg?react'
import MiniPlayer from '../assets/svgs/miniplayer.svg?react'
import FullScreen from '../assets/svgs/fullScreen.svg?react'
import AddToLiked from '../assets/svgs/addToLiked.svg?react'
import { AudioControls } from "../cmps/AudioControls";

export function Appfooter() {
    var tracks = useSelector ( storeState => storeState.currentPlaylist )
    const [trackIndex, setTrackIndex] = useState(0)

    const { title, artist, image, youtubeId } = tracks[trackIndex]

    const [player, setPlayer] = useState(null); // Reference to the YouTube player
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0); // Current playback time
    const [duration, setDuration] = useState(0); // Total duration
    const [volume, setVolume] = useState(50); // Volume (0-100)
    const rangeRef = useRef(null);
    const intervalRef = useRef(null); // Reference to the interval

    // YouTube Player Options
    const opts = {
      height: "390",
      width: "640",
      playerVars: {
        autoplay: 0, // Auto-play off
      },
    };
  
    // Event triggered when the YouTube player is ready
    function onPlayerReady(event) {
      setPlayer(event.target);
      setDuration(event.target.getDuration());
      event.target.setVolume(volume); // Set initial volume
    }
  
    // Play or Pause video
    function togglePlayPause() {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
        startTrackingProgress(); // Start progress tracking
      }
      setIsPlaying(!isPlaying);
    }

    function startTrackingProgress() {
        intervalRef.current = setInterval(() => {
          if (player) {
            setCurrentTime(player.getCurrentTime());
          }
        }, 1000); // Update every second
    }

    // Stop tracking when the component unmounts
    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);
  
    // Update the current time in the state
    function handleTimeUpdate() {
      if (player) {
        setCurrentTime(player.getCurrentTime());
      }
    }
  
    // Seek to a specific time
    function handleRangeChange(e) {
      const newTime = parseFloat(e.target.value);
      player.seekTo(newTime);
      setCurrentTime(newTime);
    }
  
    // Update volume
    function handleVolumeChange(e) {
      const newVolume = parseInt(e.target.value, 10);
      setVolume(newVolume);
      player.setVolume(newVolume); // Adjust player volume
    }

    const toPrevTrack = () => {
        if (trackIndex - 1 < 0) {
            setTrackIndex(tracks.length - 1);
          } else {
            setTrackIndex(trackIndex - 1);
          }
    }

    const toNextTrack = () => {
        if (trackIndex < tracks.length - 1) {
            setTrackIndex(trackIndex + 1);
          } else {
            setTrackIndex(0);
          }
    }

    const formatTime = (timeInSeconds) => {
        if (timeInSeconds === null) return '0:00';  // Handle case if duration is not available yet

        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);

        // Ensure two digits for seconds (e.g., "01" instead of "1")
        return `${minutes.toString().padStart(1, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
  
    return (
      <div className="app-footer-container">
        <YouTube
          videoId={youtubeId} // Replace with your video ID
          opts={opts}
          onReady={onPlayerReady}
          onStateChange={handleTimeUpdate}
          className="youtube-player"
        />
  
        {/* <div>
          <button onClick={togglePlayPause}>
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
  
        <div>
          <input
            ref={rangeRef}
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            step="0.1"
            onChange={handleRangeChange}
          />
          <span>
            {Math.floor(currentTime)} / {Math.floor(duration)} seconds
          </span>
        </div> */}
  
        {/* <div>
          <label htmlFor="volume-control">Volume:</label>
          <input
            id="volume-control"
            type="range"
            min="0"
            max="100"
            value={volume}
            step="1"
            onChange={handleVolumeChange}
          />
          <span>{volume}%</span>
        </div> */}

        <div className="player-sub-container">
                <div className="mini-details-player-container">
                    <div className="mini-details-sub-player-container">
                        <div className="media-player-musicCover-container">
                            <img
                            className="media-player-musicCover"
                            src={image}
                            alt={`track artwork for ${title} by ${artist}`}
                            />
                        </div>
                        
                        <div className="mini-details-player">
                            <div className="artist"> {artist}  </div> { /*//get the details from the song  */}
                            <p className="song-title"> {title} </p>
                        </div> 

                        <button className="add-to-liked-btn">
                            <span aria-hidden="true" className="player-icon-wrapper">                 
                                <AddToLiked className="add-to-liked"/>
                            </span>
                        </button>
                    </div>
                       
                </div>
            
                <div className="mini-player-container">
                    <div className="player-btn-container">
                    <AudioControls
                        isPlaying={isPlaying}
                        onPrevClick={toPrevTrack}
                        onNextClick={toNextTrack}
                        onPlayPauseClick={togglePlayPause}
                    />
                    
                    </div>
                    <div className="time-duration-container">
                        <p className="current-time">
                            {currentTime !== null ? formatTime(currentTime) : '0:00'}

                            {/* {currTime.min}:{currTime.sec} */} 
                        </p>
                        <div className="timeline-wrapper">
                            <div className="range">
                                <input
                                ref={rangeRef}
                                //max={duration}
                                value={currentTime}
                                step="0.1"
                                onChange={handleRangeChange}
                                type="range"
                                id="range1"
                                min="0"
                                max={duration ? duration : `${duration}`}
                                default="0"
                                //value={trackProgress}
                                className="timeline"
                                //onChange={(e) => onScrub(e.target.value)}
                                //onMouseUp={onScrubEnd}
                                //onKeyUp={onScrubEnd}
                        />
                            </div>
                        </div>
                        
                        <p className="time-duration">
                            {duration !== null ? formatTime(duration) : '0:00'}
                        </p>             
                    </div>
                </div>

                      {/* TODO : add image factory to remove code repitition */}

                <div className="player-settings-container">
                    <div className="player-settings-sub-container">
                        <button className="now-playing-view-btn">
                            <span aria-hidden="true" className="media-player-icon-wrapper">
                        
                                <NowPlayingView className="now-playing-view smallImage"/>
                            </span>
                        </button>

                        <button className="lyrics-btn">
                            <span aria-hidden="true" className="media-player-icon-wrapper">
                        
                                <Lyrics className="lyrics smallImage"/>
                            </span>
                        </button>

                        <button className="queue-btn">
                            <span aria-hidden="true" className="media-player-icon-wrapper">
                        
                                <Queue className="queue smallImage"/>
                            </span>
                        </button>

                        <button className="connectToDevice-btn">
                            <span aria-hidden="true" className="media-player-icon-wrapper">
                        
                                <ConnectToDevice className="connectToDevice smallImage"/>
                            </span>
                        </button>

                        <div className="volume-control">
                            <button className="mute-btn">
                                <span aria-hidden="true" className="media-player-icon-wrapper">
                            
                                    <Mute className="mute smallImage"/>
                                </span>
                            </button>
                                <div className="wrapper">
                                    <div className="range">
                                        <input
                                        type="range"
                                        id="range2"
                                        min="0"
                                        step='1' 
                                        max="100" 
                                        default="0"
                                        value={volume} 
                                        className="slider"
                                        onChange={handleVolumeChange}
                                />
                                    </div>
                                </div>
                        </div>
                        

                        <button className="miniPlayer-btn">
                            <span aria-hidden="true" className="media-player-icon-wrapper">
                        
                                <MiniPlayer className="miniPlayer smallImage"/>
                            </span>
                        </button>

                        <button className="fullScreen-btn">
                            <span aria-hidden="true" className="media-player-media-player-icon-wrapper">
                        
                                <FullScreen className="fullScreen smallImage"/>
                            </span>
                        </button>
        
                    </div>
                    
                </div>
            </div>
      </div>
    );
};

