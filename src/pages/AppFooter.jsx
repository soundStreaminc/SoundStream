import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import ReactPlayer from 'react-player';
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
import { setIsPlayingSong, setPlayingStationId } from "../store/song/song.actions";

export function Appfooter() {
  const isPlaying = useSelector(storeState => storeState.isPlaying);
  const tracks = useSelector(storeState => storeState.currentPlaylist);
  const [trackIndex, setTrackIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(tracks[trackIndex] || {}); //const currentTrack = useMemo(() => tracks[trackIndex] || {}, [trackIndex, tracks]);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const rangeRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const playerRef = useRef(null);

  // Handle Redux store changes to `tracks`
  useFirstRenderEffect(() => {
    // Prepare the first song when tracks are updated
    if (tracks) {
      setProperties(trackIndex) 
    }
  }, [tracks]);

  useEffect(() => {
    const rangeInput = document.getElementById('range2');
    const updateRangeProgress = () => {
        const progress = volume*100;
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
  }, [progress])

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
      console.log('trackToPrepare:', trackToPrepare)
      if (!trackToPrepare.youtubeId) {
        trackToPrepare = await addYoutubeProperty(trackToPrepare);
      }
  
      setCurrentTrack(trackToPrepare);
      setTrackIndex(newTrackIndex);
  

    } catch (error) {
      console.error("Error in setProperties:", error);
    }
  }

  // Modify togglePlayPause to handle player state more robustly
  function togglePlayPause() {
    console.log('am i actually here?:')

    if (isPlaying) {
      onPauseSong()
    } else {
      // Check if youtubeId exists before playing
      if (currentTrack.youtubeId) {
        onPlaySong()
      } else {
        // If no youtubeId, prepare the song first
        setProperties(tracks[trackIndex]);
        onPlaySong()
      }
    }
  }

  function formatTime(timeInSeconds) {
      if (timeInSeconds === null) return '0:00';  // Handle case if duration is not available yet

      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = Math.floor(timeInSeconds % 60);

      // Ensure two digits for seconds (e.g., "01" instead of "1")
      return `${minutes.toString().padStart(1, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  const handleNext = () => {
    const tracksSize = size( tracks);
    
    const totalTracks = tracks.stationType === 'playlist' 
      ? tracks.tracks?.items.length | tracksSize 
      : tracks.length | tracksSize;
    
    const newIndex = trackIndex + 1 >= totalTracks 
      ? 0 
      : trackIndex + 1;
    
    setProperties(newIndex);
  };

  const handlePrevious = () => {
    const tracksSize = size( tracks);

    const totalTracks = tracks.stationType === 'playlist' 
    ? tracks.tracks?.items.length | tracksSize 
    : tracks.length | tracksSize;
    
    const newIndex = trackIndex - 1 < 0 
      ? totalTracks - 1 
      : trackIndex - 1;
    
    setProperties(newIndex);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleProgress = (state) => {
    setProgress(state.played * duration); // Update progress based on actual duration
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value); // Use the slider value directly
    playerRef.current.seekTo(newTime, 'seconds'); // Seek to the specific time in seconds
  };

  const handleReady = () => {
    if (isPlaying) {
      playerRef.current.getInternalPlayer().playVideo();
    }
  };

  const handleDuration = (duration) => {
    setDuration(duration); // Set the duration when the track's duration is known
  };

  return (
    <div className="app-footer-container">
      <ReactPlayer 
        ref={playerRef}
        url={`https://www.youtube.com/watch?v=${currentTrack.youtubeId}`}
        className="youtube-player"
        playing={isPlaying}
        volume={volume}
        onProgress={handleProgress}
        onDuration={handleDuration} // Capture the duration of the track
        onReady={handleReady}
        onEnded={handleNext} 
        controls={false}
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
                      onPrevClick={handlePrevious}
                      onNextClick={handleNext}
                      onPlayPauseClick={togglePlayPause}
                  />
                  
                  </div>
                  <div className="time-duration-container">
                      <p className="current-time">
                          {progress !== null ? formatTime(progress) : '0:00'}

                          {/* {currTime.min}:{currTime.sec} */} 
                      </p>
                      <div className="timeline-wrapper">
                          <div className="range">
                          <input
                            id="range1"
                            ref={rangeRef}
                            value={progress}
                            onChange={handleSeek}
                            step="0.1"
                            //onChange={handleRangeChange}
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
                                          min="0"
                                          max="1"
                                          step="0.01"
                                          value={volume} // Directly use the volume state
                                          onChange={handleVolumeChange}
                                          className="slider"
                                          id="range2"
                                          default="0"
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

