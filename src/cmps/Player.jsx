import { useEffect, useRef, useState } from "react"; 
import useSound from "use-sound"; // for handling the sound

import NowPlayingView from '../assets/svgs/nowPlayingView.svg?react'
import Lyrics from '../assets/svgs/lyrics.svg?react'
import Queue from '../assets/svgs/queue.svg?react'
import ConnectToDevice from '../assets/svgs/connectToDevice.svg?react'
import Mute from '../assets/svgs/mute.svg?react'
import MiniPlayer from '../assets/svgs/miniplayer.svg?react'
import FullScreen from '../assets/svgs/fullScreen.svg?react'
import AddToLiked from '../assets/svgs/addToLiked.svg?react'
import { AudioControls } from "./AudioControls";
import { useSelector } from "react-redux";
import { loadTracks } from "../store/song/song.actions";

export function Player(){
    var tracks = useSelector ( storeState => storeState.currentPlaylist )
    const [audio, setAudio] = useState(  )
    const [trackIndex, setTrackIndex] = useState(0)
    const [trackProgress, setTrackProgress] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [ volume, setVolume ] = useState(0.5)

    const intervalRef = useRef()
    const isReady = useRef(false)
    const { title, artist, image, audioSrc } = tracks[trackIndex]
    
    var audioRef = useRef(new Audio(audioSrc))
    const [duration, setDuration] = useState(null)

    const [currTime, setCurrTime] = useState({
        min: "00",
        sec: "00",
    }); // current position of the audio in minutes and seconds
    
    useEffect(() => {
        setAudio(audioRef.current)

        // Pause and clean up on unmount
        return () => {
            audioRef.current.pause();
            clearInterval(intervalRef.current);
        }
    }, []);

    // Handle setup when changing tracks
    useEffect(() => {
        audioRef.current.pause();

        audioRef.current = new Audio(audioSrc);
        setTrackProgress(audioRef.current.currentTime);
    
        if (isReady.current) {
        audioRef.current.play();
        setIsPlaying(true);
        startTimer();
        } else {
        // Set the isReady ref as true for the next pass
        isReady.current = true;
        }
    }, [trackIndex]);

    useEffect(() => {

        if (isPlaying) {
            startTimer();
            audioRef.current.play();
        } else {
            clearInterval(intervalRef.current);
            audioRef.current.pause();
        }
      }, [isPlaying]);

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
        
    }, [trackProgress])


    useEffect(() => {
        // Set the source and volume whenever these props change
        if (audioRef.current) {
            audioRef.current.volume = volume;

        const rangeInput = document.getElementById('range2');
        const updateRangeProgress = () => {
            const progress = volume*100;
            rangeInput.style.setProperty('--progress', `${progress}%`);
        };
        
        rangeInput.addEventListener('input', updateRangeProgress);
        updateRangeProgress(); // Initial call to set the progress

        // Event listener for loadedmetadata (when duration is available)
        const handleLoadedMetadata = () => {
        //show('problem searching for artist: ', err)
        console.log('The duration and dimensions of the media are now known.');
        setDuration(audioRef.current.duration);  // Store the duration
        };
    }
    }, [volume]);

    useEffect(() => {
        console.log('tracks[trackIndex]:', tracks[trackIndex].youtubeId)

        // Set the source and volume whenever these props change
        if (audioRef.current) {
            audioRef.current.src = audioSrc
        }

        // Event listener for loadedmetadata (when duration is available)
        const handleLoadedMetadata = () => {
        //show('problem searching for artist: ', err)
        console.log('The duration and dimensions of the media are now known.');
        setDuration(audioRef.current.duration);  // Store the duration
        }

        // Play the new track if it's already playing
        if (isPlaying) {
            audioRef.current.volume = volume;
            audioRef.current.play();
        }

        // Add the event listener to the audio element
        audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

        // Clean up the event listener when the component unmounts
        return () => {
            audioRef.current.pause();
            if (audioRef.current) {
                audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
            }
        };
    }, [audioSrc]);

    const startTimer = () => {
        // Clear any timers already running
        clearInterval(intervalRef.current);
        
        
        intervalRef.current = setInterval(() => {

            if (audioRef.current.ended) {
                toNextTrack();
            } else {
                setTrackProgress(audioRef.current.currentTime);
                setCurrTime( {
                    sec: ('0'+  (Math.floor(audioRef.current.currentTime % 60))).slice(-2),
                    min: ('0'+ (Math.floor(audioRef.current.currentTime / 60))).slice(-1)
                })
            }
        }, [1000]);
    }

    function loadDuration(){
        audioRef.current.onloadedmetadata = function() {
            setDuration(audioRef.current.duration)

            const min = ('0'+ (Math.floor(duration / 60))).slice(-2);
            const secRemain = ('0'+  (Math.floor(duration % 60))).slice(-2);
            setTime({
                min: min,
                sec: secRemain
            });
          };
    }

    function onPlayPauseClick(  ){
        if (isPlaying) {
            audioRef.current.pause();// this will pause the audio
          setIsPlaying(false);
        } else {
          audioRef.current.play();
          setIsPlaying(true);
        }
    };

    const onScrub = (value) => {
        // Clear any timers already running
      clearInterval(intervalRef.current);
      audioRef.current.currentTime = value;
      setTrackProgress(audioRef.current.currentTime);
    }
    
    const onScrubEnd = () => {
      // If not already playing, start
      if (!isPlaying) {
        setIsPlaying(true);
      }
      startTimer();
    }

    function changeVolume({target}){
        setVolume(target.value)
    }

    // Function to convert seconds to a "MM:SS" format
    const formatTime = (timeInSeconds) => {
        if (timeInSeconds === null) return '0:00';  // Handle case if duration is not available yet

        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);

        // Ensure two digits for seconds (e.g., "01" instead of "1")
        return `${minutes.toString().padStart(1, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // function setProgressBar( progressVal ){
    //     const sliderEl = document.querySelector("#range1")
    //     sliderEl.style.background = `linear-gradient(to right, #f50 ${progressVal}%, #ccc ${progressVal}%)`;

    // }

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

    return (
        <div className="player-container">
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
                        onPlayPauseClick={onPlayPauseClick}
                    />
                    
                    </div>
                    <div className="time-duration-container">
                        <p className="current-time">
                            {currTime.min}:{currTime.sec}
                        </p>
                        <div className="timeline-wrapper">
                            <div className="range">
                                <input
                                type="range"
                                id="range1"
                                min="0"
                                max={duration ? duration : `${duration}`}
                                default="0"
                                value={trackProgress}
                                className="timeline"
                                onChange={(e) => onScrub(e.target.value)}
                                onMouseUp={onScrubEnd}
                                onKeyUp={onScrubEnd}
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
                                        step='0.01' 
                                        max="1" 
                                        default="0"
                                        value={volume} 
                                        className="slider"
                                        onChange={changeVolume}
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
}
