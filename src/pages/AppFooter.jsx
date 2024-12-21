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
import { setIsPlayingSong } from "../store/song/song.actions";

export function Appfooter() {
  const isPlaying = useSelector(storeState => storeState.isPlaying);
  const tracks = useSelector(storeState => storeState.currentPlaylist);
  const [trackIndex, setTrackIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(tracks[trackIndex] || {}); //const currentTrack = useMemo(() => tracks[trackIndex] || {}, [trackIndex, tracks]);
  const [player, setPlayer] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const rangeRef = useRef(null);
  const intervalRef = useRef(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const playerRef = useRef(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Handle Redux store changes to `tracks`
  useFirstRenderEffect(() => {
    // Prepare the first song when tracks are updated
    if (tracks) {
      setProperties(trackIndex) 
    }
  }, [tracks]);

  // useFirstRenderEffect(() => {
  //   if(player){
  //     player.pauseVideo();
  //     stopTrackingProgress();
  //     onPauseSong()
  //   }
  // }, [isPlaying])

  useEffect(() => {


    const rangeInput = document.getElementById('range2');
    const updateRangeProgress = () => {
        const progress = volume;
        rangeInput.style.setProperty('--progress', `${progress}%`);
    };
    
    rangeInput.addEventListener('input', updateRangeProgress);
    updateRangeProgress(); // Initial call to set the progress
    
  }, [volume]);

  useEffect( () => {

    const rangeInput = document.getElementById('range1');
    const updateRangeProgress = () => {
    const progress = (rangeInput.value / rangeInput.max) * 100;
      

      rangeInput.style.setProperty('--progress', `${progress}%`);
    };
    
    rangeInput.addEventListener('input', updateRangeProgress);
    updateRangeProgress(); // Initial call to set the progress
    //setProgressBar(progress)
    return () => {
      rangeInput.removeEventListener('input', updateRangeProgress);
    };
    
}, [currentTime])

  useFirstRenderEffect(() => {
    console.log('Current Track Changed:', {
      track: currentTrack,
      youtubeId: currentTrack?.youtubeId,
      playerRef: playerRef.current,
      isInitialLoad: isInitialLoad
    });
    // Skip during the first initialization
  if (!hasInitialized) {
    setHasInitialized(true);
    return;
  }

  // Only trigger when switching tracks
  if (currentTrack) {
    handleTrackChange(currentTrack);
  }

    // This effect will run whenever currentTrack changes
    async function playNewTrack() {
      // Ensure we have a valid track and player
      if (currentTrack?.youtubeId && player) {
        
        try {
          console.log('Attempting to play new track');

          console.log("Waiting for player to be ready...");
          await waitForPlayerReady(playerRef.current); // Wait for readiness
    
          console.log("Player is ready. Loading track:", currentTrack);

          // Stop any existing progress tracking
          stopTrackingProgress();
    
          // Reset time-related states
          setCurrentTime(0);
          setDuration(0);

          // Load the new video
          playerRef.current.loadVideoById(currentTrack.youtubeId);
    
          // Play the video
          playerRef.current.playVideo();
    
         
          // Start tracking progress
          startTrackingProgress();
     
          // Set playing state
          onPlaySong()

          console.log('Track should now be playing');

        } catch (error) {
          console.error('Error playing new track:', error);
          onPauseSong()
        }
      }
    }
    
    // Call the async function to play the new track
    playNewTrack();
  }, [currentTrack, player]); // Keep currentTrack and player as dependencies

  async function onPlaySong() {
      try {
          await setIsPlayingSong(true) 
      } catch (err) {
          console.log('err:', err)
          showErrorMsg('problem on Play Song: ', err)
      }
  }

  async function onPauseSong() {
    try {
        await setIsPlayingSong(false) 
    } catch (err) {
        console.log('err:', err)
        showErrorMsg('problem on Pause Song: ', err)
    }
}

  function waitForPlayerReady(player, maxAttempts = 3, interval = 400) {
    return new Promise((resolve, reject) => {
      let attempts = 0;
  
      const checkPlayerState = () => {
        const state = player.getPlayerState();
        console.log(`Checking player state (attempt ${attempts + 1}):`, state);
  
        if (state >= 0) { // Ensure state is valid
          resolve();
        } else if (++attempts >= maxAttempts) {
          reject(new Error("Player not ready within timeout."));
        } else {
          setTimeout(checkPlayerState, interval);
        }
      };
  
      checkPlayerState();
    });
  }

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
      switch (tracks.stationType) {
        case "track":
          trackToPrepare = tracks;
          break;
        case "playlist":
          console.log('testesetetsettsetstracks.tracks:', tracks)
          trackToPrepare = tracks.tracks
            ? tracks.tracks.items[newTrackIndex].track
            : tracks[newTrackIndex].track;
          trackToPrepare = setPlaylistJson(trackToPrepare);
          break;
        case "artist":
          trackToPrepare = setArtistJson(tracks[newTrackIndex]);
          break;
        case "album":
          trackToPrepare = setAlbumJson(tracks[newTrackIndex], tracks.albumImage);
          break;
        default:
          console.error("Invalid station type:", tracks.stationType);
          showErrorMsg("Unexpected error");
          return;
      }
  
      if (!trackToPrepare.youtubeId) {
        trackToPrepare = await addYoutubeProperty(trackToPrepare);
      }
  
      setCurrentTrack(trackToPrepare);
      setTrackIndex(newTrackIndex);
  
      // Ensure the player loads the new video and starts playing only after initial load
      if (player && trackToPrepare.youtubeId) {
        player.loadVideoById(trackToPrepare.youtubeId);
  
        if (!isInitialLoad) {
          player.playVideo();
        }
      }
  
      // Mark the initial load as complete
      setIsInitialLoad(false);
    } catch (error) {
      console.error("Error in setProperties:", error);
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

  // Modify togglePlayPause to handle player state more robustly
  function togglePlayPause() {
    console.log('am i actually here?:')
    if (!player) return;

    if (isPlaying) {
      player.pauseVideo();
      stopTrackingProgress();
      onPauseSong()
    } else {
      // Check if youtubeId exists before playing
      if (currentTrack.youtubeId) {
        player.playVideo();
        startTrackingProgress();
        console.log('should start chenge here:')
        onPlaySong()
      } else {
        // If no youtubeId, prepare the song first
        setProperties(tracks[trackIndex]);
      }
    }
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
    const tracksSize = size( tracks);

    const totalTracks = tracks.stationType === 'playlist' 
      ? tracks.tracks.items.length | tracksSize 
      : tracks.length | tracksSize;
    
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

  async function handleTrackChange(newTrack) {
    if (!newTrack?.youtubeId || !playerRef.current) {
      console.warn("Cannot change track: Player or new track is missing.");
      return;
    }
  
    console.log("Switching to new track:", newTrack);
  
    try {
      // Wait for the player to be ready
      await waitForPlayerReady(playerRef.current);
  
      // Stop progress tracking and reset state
      stopTrackingProgress();
      setCurrentTime(0);
      setDuration(0);
  
      // Load and pause the new video
      playerRef.current.loadVideoById(newTrack.youtubeId);
      playerRef.current.pauseVideo();
      onPauseSong()
  
      // Update duration and start progress tracking
      const newDuration = playerRef.current.getDuration();
      setDuration(newDuration);
      startTrackingProgress();
    } catch (error) {
      console.error("Error during track change:", error);
    }
  }
  

   function onPlayerReady(event) {
    console.log('Player Ready Event');
    
    playerRef.current = event.target;
    setPlayer(event.target);

    // Set initial volume
    event.target.setVolume(volume);

    // Only start playing if it's not the initial load and we have a track
    if (!isInitialLoad && currentTrack?.youtubeId) {
      console.log('Playing track after initial load');
      event.target.loadVideoById(currentTrack.youtubeId);
      
      setTimeout(() => {
        event.target.playVideo();
        onPlaySong()
      }, 500);
    }
  }

  return (
    <div className="app-footer-container">
      <YouTube
        videoId={currentTrack.youtubeId}
        key={currentTrack?.youtubeId || "default"}
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
                            id="range1"
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

