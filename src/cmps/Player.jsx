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
    let tracks = useSelector ( storeState => storeState.currentPlaylist )
    const [audio, setAudio] = useState(  )
    const [trackIndex, setTrackIndex] = useState(0);
    const [trackProgress, setTrackProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [ volume, setVolume ] = useState(0.5);

    const intervalRef = useRef();
    const isReady = useRef(false);
    const { title, artist, color, image, audioSrc } = tracks[trackIndex]
    
    let audioRef = useRef(new Audio(audioSrc));
    let duration = audioRef.current.duration;



    const [currTime, setCurrTime] = useState({
        min: "00",
        sec: "00",
      }); // current position of the audio in minutes and seconds
      const [time, setTime] = useState({
        min: "",
        sec: ""
      });

      useEffect(() => {
        // Update the audio source when `audioSrc` changes
        audioRef.current.src = audioSrc;
        audioRef.current.volume = volume;
        duration = audioRef.current.duration;
        
        // Play the new track if it's already playing
        if (isPlaying) {
          audioRef.current.play();
        }
      
        // Clean up when the component unmounts
        return () => {
          audioRef.current.pause();
        };
      }, [audioSrc]);

    useEffect(() => {
        loadDuration()
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

    useEffect( () => {

        audioRef.current.volume = volume
        const rangeInput = document.getElementById('range2');
        const updateRangeProgress = () => {
          const progress = volume*100;
          

          rangeInput.style.setProperty('--progress', `${progress}%`);
        };
        
        rangeInput.addEventListener('input', updateRangeProgress);
        updateRangeProgress(); // Initial call to set the progress
        //setProgressBar(progress)
        return () => {
          rangeInput.removeEventListener('input', updateRangeProgress);
        };
        
    }, [volume])

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
                    min: ('0'+ (Math.floor(audioRef.current.currentTime / 60))).slice(-2)
                })
            }
        }, [1000]);
    }

    function loadDuration(){
        audioRef.current.onloadedmetadata = function() {
            duration = audioRef.current.duration;

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
                <div className="mini-details-container">
                    <div className="mini-details-sub-container">
                        <div className="musicCover-container">
                            <img
                            className="musicCover"
                            src={image}
                            alt={`track artwork for ${title} by ${artist}`}
                            />
                        </div>
                        
                        <div className="mini-details">
                            <div className="artist"> {artist}  </div> { /*//get the details from the song  */}
                            <p className="song-title"> {title} </p>
                        </div> 

                        <button className="add-to-liked-btn">
                            <span aria-hidden="true" className="iconWrapper">
                        
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
                            {time.min}:{time.sec}
                        </p>             
                    </div>
                </div>

                      {/* TODO : add image factory to remove code repitition */}

                <div className="player-settings-container">
                    <div className="player-settings-sub-container">
                        <button className="now-playing-view-btn">
                            <span aria-hidden="true" className="iconWrapper">
                        
                                <NowPlayingView className="now-playing-view smallImage"/>
                            </span>
                        </button>

                        <button className="lyrics-btn">
                            <span aria-hidden="true" className="iconWrapper">
                        
                                <Lyrics className="lyrics smallImage"/>
                            </span>
                        </button>

                        <button className="queue-btn">
                            <span aria-hidden="true" className="iconWrapper">
                        
                                <Queue className="queue smallImage"/>
                            </span>
                        </button>

                        <button className="connectToDevice-btn">
                            <span aria-hidden="true" className="iconWrapper">
                        
                                <ConnectToDevice className="connectToDevice smallImage"/>
                            </span>
                        </button>

                        <div className="volume-control">
                            <button className="mute-btn">
                                <span aria-hidden="true" className="iconWrapper">
                            
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
                            <span aria-hidden="true" className="iconWrapper">
                        
                                <MiniPlayer className="miniPlayer smallImage"/>
                            </span>
                        </button>

                        <button className="fullScreen-btn">
                            <span aria-hidden="true" className="iconWrapper">
                        
                                <FullScreen className="fullScreen smallImage"/>
                            </span>
                        </button>
        
                    </div>
                    
                </div>
            </div>
            
        </div>
    );
}
