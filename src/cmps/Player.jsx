import { useEffect, useRef, useState } from "react"; 
import useSound from "use-sound"; // for handling the sound
import sunrise from "../assets/sounds/sunrise.mp3"; // importing the music
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai"; // icons for play and pause
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi"; // icons for next and previous track
import { IconContext } from "react-icons"; // for customazing the icons
import nowPlayingView from '../assets/imgs/open-view-button.png'
import lyrics from '../assets/imgs/lyrics.jpeg'
import queue from '../assets/imgs/queue.jpg'
import NowPlayingView from '../assets/svgs/nowPlayingView.svg?react'
import Lyrics from '../assets/svgs/lyrics.svg?react'



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

    useEffect(() => {
    const sec = duration / 1000;
    const min = Math.floor(sec / 60);
    const secRemain = Math.floor(sec % 60);
    setTime({
        min: min,
        sec: secRemain
      });
    }, [isPlaying]);

    useEffect(() => {
        const interval = setInterval(() => {
          if (sound) {
            setSeconds(sound.seek([])); // setting the seconds state with the current state
            const min = Math.floor(sound.seek([]) / 60);
            const sec = Math.floor(sound.seek([]) % 60);
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
                    <input
                        type="range"
                        min="0"
                        max={duration / 1000}
                        default="0"
                        value={seconds}
                        className="timeline"
                        onChange={(e) => {
                            sound.seek([e.target.value]);
                        }}
                    />
                    <p className="time-duration">
                        {time.min}:{time.sec}
                    </p>             
                </div>
            </div>

                        {/* TODO : add image factory to remove code repitition */}

                <div className="player-settings-container">
                    <button className="now-playing-view-btn">
                        <span aria-hidden="true" className="iconWrapper">
                       
                            <NowPlayingView className="now-playing-view smallImage"/>
                        </span>
                    </button>

                    <button className="now-playing-view-btn">
                        <span aria-hidden="true" className="iconWrapper">
                       
                            <Lyrics className="now-playing-view smallImage"/>
                        </span>
                    </button>


                
                   
                    <img ref={imgRef} src={lyrics} alt="" className="lyrics smallImage"/>
                    <img ref={imgRef} src={queue} alt="" className="queue smallImage"/>
                    <input type="range" 
                        min='0' 
                        max="1" 
                        step='0.01' 
                        value={volume} 
                        className='slider' 
                        id="myRange" 
                        onChange={changeVolume}
                    />
    
                </div>
            </div>
            
        </div>
    );
}
