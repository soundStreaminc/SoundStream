import { useEffect, useRef, useState } from "react"; 
import useSound from "use-sound"; // for handling the sound
import sunrise from "../assets/sounds/sunrise.mp3"; // importing the music
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai"; // icons for play and pause
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi"; // icons for next and previous track
import { IconContext } from "react-icons"; // for customazing the icons

import NowPlayingView from '../assets/svgs/nowPlayingView.svg?react'
import Lyrics from '../assets/svgs/lyrics.svg?react'
import Queue from '../assets/svgs/queue.svg?react'
import ConnectToDevice from '../assets/svgs/connectToDevice.svg?react'
import Mute from '../assets/svgs/mute.svg?react'
import MiniPlayer from '../assets/svgs/miniplayer.svg?react'
import FullScreen from '../assets/svgs/fullScreen.svg?react'
import AddToLiked from '../assets/svgs/addToLiked.svg?react'

//TODO change pictures. and size of player
//TODO add the last icon

export function Player(){
    const [ volume, setVolume ] = useState(0.5);
    const [isPlaying, setIsPlaying] = useState(false);
    const [play, { pause, duration, sound }] = useSound(sunrise, { volume }); //Enter the audio here, instead of qala
    const [seconds, setSeconds] = useState(0); // current position of the audio in seconds
    const [currTime, setCurrTime] = useState({
        min: "",
        sec: "",
      }); // current position of the audio in minutes and seconds
      const [time, setTime] = useState({
        min: "",
        sec: ""
      });
    const imgRef = useRef()

    useEffect( () => {
        // console.log('time:', time)
        // const progress = (seconds / time.sec) * 100;
        // console.log('progress:', progress)

        const rangeInput = document.getElementById('range1');
        const updateRangeProgress = () => {
          const progress = (rangeInput.value / rangeInput.max) * 100;
          

          rangeInput.style.setProperty('--progress', `${progress}%`);
          console.log('updateRange1Progress:', rangeInput)
        };
        
        rangeInput.addEventListener('input', updateRangeProgress);
        updateRangeProgress(); // Initial call to set the progress
        //setProgressBar(progress)
        return () => {
          rangeInput.removeEventListener('input', updateRangeProgress);
        };
        
    }, [seconds])

    useEffect( () => {
        const rangeInput = document.getElementById('range2');
        const updateRangeProgress = () => {
          const progress = volume*100;
          

          rangeInput.style.setProperty('--progress', `${progress}%`);
          console.log('updateRange2Progress:', rangeInput)
        };
        
        rangeInput.addEventListener('input', updateRangeProgress);
        updateRangeProgress(); // Initial call to set the progress
        //setProgressBar(progress)
        return () => {
          rangeInput.removeEventListener('input', updateRangeProgress);
        };
        
    }, [volume])


    useEffect(() => {
    const sec = duration / 1000;
    const min = ('0'+ (Math.floor(sec / 60))).slice(-2);
    const secRemain = ('0'+  (Math.floor(sec % 60))).slice(-2);
    setTime({
        min: min,
        sec: secRemain
      });
    }, [isPlaying]);

    useEffect(() => {
        const interval = setInterval(() => {
          if (sound) {
            setSeconds(sound.seek([])); // setting the seconds state with the current state
            const min = ('0'+ Math.floor(sound.seek([]) / 60)).slice(-2);
            const sec = ('0'+ Math.floor(sound.seek([]) % 60)).slice(-2);
                setCurrTime({
                    min,
                    sec
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [sound]);
      
    
    const playingButton = () => {
        if (isPlaying) {
          pause(); // this will pause the audio
          setIsPlaying(false);
        } else {
          play();// this will play the audio
          setIsPlaying(true);
        }
    };

    function changeVolume({target}){
        setVolume(target.value)
    }

    // function setProgressBar( progressVal ){
    //     const sliderEl = document.querySelector("#range1")
    //     sliderEl.style.background = `linear-gradient(to right, #f50 ${progressVal}%, #ccc ${progressVal}%)`;

    // }

    return (
        <div className="player-container">
            <div className="player-sub-container">
                <div className="mini-details-container">
                    <div className="mini-details-sub-container">
                        <div className="musicCover-container">
                            <img
                            className="musicCover"
                            src="https://picsum.photos/200/200"
                            />
                        </div>
                        
                        <div className="mini-details">
                            <div className="song-title"> Edenbridge  </div> { /*//get the details from the song  */}
                            <p className="song-subTitle"> Sunrise in Eden </p>
                        </div> 

                        <button className="add-to-liked-btn">
                            <span aria-hidden="true" className="iconWrapper">
                        
                                <AddToLiked className="add-to-liked smallImage"/>
                            </span>
                        </button>
                    </div>
                       
                </div>
            
                <div className="mini-player-container">
                    <div className="player-btn-container">
                        <button className="prev playerButton">
                        <IconContext.Provider value={{ size: "3em", color: "white" }}>
                            <BiSkipPrevious />
                        </IconContext.Provider>
                        </button>
                        {!isPlaying ? (
                        <button className="play playerButton" onClick={playingButton}>
                            <IconContext.Provider value={{ size: "3em", color: "white" }}>
                            <AiFillPlayCircle />
                            </IconContext.Provider>
                        </button>
                        ) : (
                        <button className="pause playerButton" onClick={playingButton}>
                            <IconContext.Provider value={{ size: "3em", color: "white" }}>
                            <AiFillPauseCircle />
                            </IconContext.Provider>
                        </button>
                        )}
                        <button className="next playerButton">
                        <IconContext.Provider value={{ size: "3em", color: "white" }}>
                            <BiSkipNext />
                        </IconContext.Provider>
                        </button>
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
                                max={duration / 1000}
                                default="0"
                                value={seconds}
                                className="timeline"
                                onChange={(e) => {
                                    sound.seek([e.target.value]);
                                }}
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
                                {/* <input type="range" 
                                min='0' 
                                max="1" 
                                step='0.01' 
                                value={volume} 
                                className='slider' 
                                id="myRange" 
                                onChange={changeVolume}
                            /> */}
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
