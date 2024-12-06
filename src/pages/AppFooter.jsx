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
import { useFirstRenderEffect } from "../cmps/useFirstRenderEffect";

export function Appfooter() {
  const tracks = useSelector(storeState => storeState.currentPlaylist);
  const [trackIndex, setTrackIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(tracks[trackIndex] || {}); //const currentTrack = useMemo(() => tracks[trackIndex] || {}, [trackIndex, tracks]);
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const rangeRef = useRef(null);
  const intervalRef = useRef(null);
  const hasMounted = useRef(false);
  
  // Handle Redux store changes to `tracks`
  useFirstRenderEffect(() => {
    // Prepare the first song when tracks are updated
    if (tracks.length > 0) {
      var trackPrepared = tracks[trackIndex]
      if(!trackPrepared.youtubeId){
        const trackPrepared = addYoutubeProperty(trackPrepared)
      }    
    }
  }, [tracks]);

  useEffect(() => {
    tracks[trackIndex]
    if (tracks.length > 0 && tracks[trackIndex].youtubeId) {
      const currentTrack = tracks[trackIndex];
  
      // Stop previous progress tracking and reset state
      stopTrackingProgress();
      setCurrentTime(0);
      setDuration(0);
  
      // Load and play the new track
      if (player) {
        player.loadVideoById(currentTrack.youtubeId);
        player.playVideo();
        startTrackingProgress();
        setIsPlaying(true);
      }
    }
  }, [tracks, trackIndex]); // Trigger this when `tracks` or `trackIndex` changes

  async function addYoutubeProperty(track){
    const youtubeId = await youtubeService.getSongByName(track.artist + " " +  track.title)
    const playTrack = { ...track, youtubeId}
    return playTrack
  } 

  // YouTube Player Options
  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 0, // Auto-play off
    },
  };
  
  
  // Modify onPlayerReady to handle auto-playing if needed
  function onPlayerReady(event) {
    setPlayer(event.target);
    event.target.setVolume(volume);
    setDuration(event.target.getDuration());

    // Optional: If you want to auto-play after track change
    if (isPlaying) {
      event.target.playVideo();
      startTrackingProgress();
    }
  }

  // Modify togglePlayPause to handle player state more robustly
  function togglePlayPause() {
    if (!player) return;

    if (isPlaying) {
      player.pauseVideo();
      stopTrackingProgress();
    } else {
      // Check if youtubeId exists before playing
      if (currentTrack.youtubeId) {
        player.playVideo();
        startTrackingProgress();
      } else {
        // If no youtubeId, prepare the song first
        prepareSong(trackIndex);
      }
    }
    
    setIsPlaying(!isPlaying);
  }

  function startTrackingProgress() {
    if (intervalRef.current) return; // Avoid multiple intervals
    intervalRef.current = setInterval(() => {
      if (player) {
        setCurrentTime(player.getCurrentTime());
      }
    }, 1000); // Update every second
  }

    // Stop progress tracking
  function stopTrackingProgress() {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => stopTrackingProgress();
  }, []);

  // Update the current time in the state
  function handleTimeUpdate() {
    if (player) {
      setCurrentTime(player.getCurrentTime());
      setDuration(player.getDuration());
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

  
  // Previous track logic
  function toPrevTrack() {
      const newIndex = trackIndex - 1 < 0 ? tracks.length - 1 : trackIndex - 1;
      prepareSong(newIndex);
  }

  // Next track logic
  function toNextTrack() {
      const newIndex = trackIndex + 1 >= tracks.length ? 0 : trackIndex + 1;
      prepareSong(newIndex);
  }

  function formatTime(timeInSeconds) {
      if (timeInSeconds === null) return '0:00';  // Handle case if duration is not available yet

      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = Math.floor(timeInSeconds % 60);

      // Ensure two digits for seconds (e.g., "01" instead of "1")
      return `${minutes.toString().padStart(1, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  function prepareSong(newTrackIndex) {
    console.log('prepareSong newTrackIndex:', newTrackIndex);
    // Stop current playback and tracking
    stopTrackingProgress();
  
    if (player) {
      player.stopVideo(); // Completely stop the current video
      setIsPlaying(false); // Ensure play state is reset
    }
  
    // Reset player-related states
    setCurrentTime(0);
    setDuration(0);
  
    const trackToPrepare = tracks[newTrackIndex];
    if (!trackToPrepare.youtubeId) {
      const fetchYouTubeId = async () => {
        try {
          const youtubeId = await youtubeService.getSongByName(`${trackToPrepare.artist} ${trackToPrepare.title}`);
          trackToPrepare.youtubeId = youtubeId;
  
          // Update states to trigger re-render and track change
          setCurrentTrack(trackToPrepare);
          setTrackIndex(newTrackIndex);
        } catch (error) {
          console.error("Error fetching YouTube ID:", error);
        }
      };
      fetchYouTubeId();
    } else {
      // If youtubeId already exists, update states directly
      setCurrentTrack(trackToPrepare);
      setTrackIndex(newTrackIndex);
    }
  }

  return (
    <div className="app-footer-container">
      <YouTube
        videoId={currentTrack.youtubeId}
        key={currentTrack.youtubeId}
        opts={opts}
        onReady={onPlayerReady}
        onStateChange={handleTimeUpdate}
        className="youtube-player"
      />

      <div className="player-sub-container">
              <div className="mini-details-player-container">
                  <div className="mini-details-sub-player-container">
                      <div className="media-player-musicCover-container">
                          <img
                          className="media-player-musicCover"
                          src={currentTrack.image}
                          alt={`track artwork for ${currentTrack.title} by ${currentTrack.artist}`}
                          />
                      </div>
                      
                      <div className="mini-details-player">
                          <div className="artist"> {currentTrack.artist}  </div> { /*//get the details from the song  */}
                          <p className="song-title"> {currentTrack.title} </p>
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
                            value={currentTime}
                            step="0.1"
                            onChange={handleRangeChange}
                            type="range"
                            min="0"
                            max={duration || 0} // Ensure `max` updates dynamically
                            className="timeline"
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

