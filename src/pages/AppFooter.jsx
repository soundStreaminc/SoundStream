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
import { setAlbumJson, setArtistJson, setPlaylistJson, setTrackJson } from "../services/util.service";
import { youtubeService } from "../services/youtube.service";
import { showErrorMsg } from "../services/event-bus.service";
import { size } from 'lodash';

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
  const [hasInitialized, setHasInitialized] = useState(false);
  
  // Handle Redux store changes to `tracks`
  useFirstRenderEffect(() => {
    // Prepare the first song when tracks are updated
    if (tracks) {
      setProperties(trackIndex) 
    }
  }, [tracks]);
  // useEffect(() => {
  //   console.log('tracks:', tracks)
  //   if (tracks.length > 0 && tracks[trackIndex].youtubeId) {
  //     const currentTrack = tracks[trackIndex];
  
  //     // Stop previous progress tracking and reset state
  //     stopTrackingProgress();
  //     setCurrentTime(0);
  //     setDuration(0);
  
  //     // Load and play the new track
  //     if (player) {
  //       player.loadVideoById(currentTrack.youtubeId);
  //       player.playVideo();
  //       startTrackingProgress();
  //       setIsPlaying(true);
  //     }
  //   }
  // }, [currentTrack]); // Trigger this when `tracks` or `trackIndex` changes

  useFirstRenderEffect(() => {
    // This effect will run whenever currentTrack changes
    async function playNewTrack() {
      // Ensure we have a valid track and player
      if (currentTrack?.youtubeId && player) {
        try {
          // Stop any existing progress tracking
          stopTrackingProgress();
    
          // Reset time-related states
          setCurrentTime(0);
          setDuration(0);
    console.log("currentTrack.youtubeId",currentTrack.youtubeId)
          // Load the new video
          player.loadVideoById(currentTrack.youtubeId);
    
          // Play the video
          player.playVideo();
    
          // Start tracking progress
          startTrackingProgress();
    
          // Optional: Get the duration of the new track
          const newDuration = player.getDuration();
          setDuration(newDuration);
  
          // Immediately pause and set playing state to false
          player.pauseVideo();
          setIsPlaying(false);
        } catch (error) {
          console.error('Error playing new track:', error);
          setIsPlaying(false);
        }
      }
    }
    
    // Call the async function to play the new track
    playNewTrack();
  }, [currentTrack, player]); // Keep currentTrack and player as dependencies

  async function addYoutubeProperty(track){
    const youtubeId = await youtubeService.getSongByName(track.artist + " " +  track.title)
    console.log('youtubeId:', youtubeId)
    console.log('playTrack:', track)
    const playTrack = { ...track, youtubeId}
    console.log('playTrack:', playTrack)
    return playTrack
  } 

  async function setProperties(newTrackIndex) {
    try {
      let trackToPrepare;
      const stationType = tracks.stationType;
  
      console.log('tracks:', tracks)

      switch (tracks.stationType){
          case 'track':
            trackToPrepare = tracks;
            console.log('trackToPrepare:', trackToPrepare)
            break
          case 'playlist':
console.log("tracks[newTrackIndex]",tracks[newTrackIndex])
            trackToPrepare = tracks.tracks?tracks.tracks.items[newTrackIndex].track:tracks[newTrackIndex].track
            trackToPrepare = setPlaylistJson(trackToPrepare)
            break
          case 'artist':
            trackToPrepare = tracks[newTrackIndex]
            trackToPrepare = setArtistJson(trackToPrepare)
            break
          case 'album':
            trackToPrepare = tracks[newTrackIndex]
            trackToPrepare = setAlbumJson(trackToPrepare, tracks.albumImage)
            break
          default: 
            console.log('error with the station type: ', tracks.stationType)
            showErrorMsg('should not be here')
            return          
      }
    
      console.log('final trackToPrepare:', trackToPrepare)
      // Ensure we have a YouTube ID
      if (!trackToPrepare.youtubeId) {
        trackToPrepare = await addYoutubeProperty(trackToPrepare);
      }
  
      // Update the current track
      setCurrentTrack(trackToPrepare);
      
      // Optionally update track index
      setTrackIndex(newTrackIndex);
    } catch (error) {
      console.error('Error setting track properties:', error);
    }
  }

  // YouTube Player Options
  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 0, // Auto-play off
    },
  };
  
  
 // Modify your YouTube component to handle track changes
function onPlayerReady(event) {
  setPlayer(event.target);
  event.target.setVolume(volume);
  setDuration(event.target.getDuration());

  // Optional: If you want to handle track changes here
  if (currentTrack?.youtubeId) {
    event.target.loadVideoById(currentTrack.youtubeId);
    event.target.pauseVideo();
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
        setProperties(tracks[trackIndex]);
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

  
  function toPrevTrack() {
    const totalTracks = tracks.stationType === 'playlist' 
      ? tracks.tracks.items.length 
      : tracks.length;
    
    const newIndex = trackIndex - 1 < 0 
      ? totalTracks - 1 
      : trackIndex - 1;
    
    setProperties(newIndex);
  }
  
  function toNextTrack() {

   const tracksSize = size( tracks);
    
    const totalTracks = tracks.stationType === 'playlist' 
      ? tracks.tracks?.items.length | tracksSize 
      : tracks.length | tracksSize;
    
    const newIndex = trackIndex + 1 >= totalTracks 
      ? 0 
      : trackIndex + 1;
    
    setProperties(newIndex);
  }

  function formatTime(timeInSeconds) {
      if (timeInSeconds === null) return '0:00';  // Handle case if duration is not available yet

      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = Math.floor(timeInSeconds % 60);

      // Ensure two digits for seconds (e.g., "01" instead of "1")
      return `${minutes.toString().padStart(1, '0')}:${seconds.toString().padStart(2, '0')}`;
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

