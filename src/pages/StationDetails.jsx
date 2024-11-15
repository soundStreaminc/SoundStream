import { useParams } from "react-router"
import { stationService } from "../services/station.service"
import { useEffect, useRef, useState } from "react"
import { setCurrentlyPlaying } from "../store/song/song.actions"
import { showSuccessMsg } from "../services/event-bus.service"
import Play from '../assets/svgs/play.svg?react'
import Pause from '../assets/svgs/pause.svg?react'
import { TracksList } from "../cmps/TracksList"

export function StationDetails(  ) {
    const params = useParams()
    let station = useRef(null);
    const [ tracks , setTracks] = useState(null)
    const [isPlaying, setIsPlaying] = useState( false );

    useEffect(() => {
        loadTracks()
    }, [])

    async function loadTracks(){
        station.current = await stationService.getPlaylistById_SpotifyApi( params.stationId ) 
        setTracks(station.current.tracks.items) 
    }

    async function onPlayTrack ( track ){
        try {            
            var playCurrent = track ? await setCurrentlyPlaying ( track ) : ''  
            console.log(`playing:`, playCurrent.title)
            showSuccessMsg(`playing: ${playCurrent.title}`)           
        } catch (err) {
            console.error(err);
        }
    }

    function getPlaylistCover(){
        if(station.current.images){
            return station.current.images[0].url
        }
        console.log('error: no cover found for the playlist')
    }

    function onPlayPauseClick(  ){
        if (isPlaying) {
            //audioRef.current.pause();// this will pause the audio
            setIsPlaying(false)
        } else {
          //audioRef.current.play();
          setIsPlaying(true)
        }
    };

    if(!tracks || !station.current.images) return <span> loading in progress... </span>
    return (
        <section className="station-details">
            <div className="station-info">
                <div className="station-sub-info">
                    <div className="cover-station">
                        <img src={getPlaylistCover() || 'not found'} />
                    </div>
    
                    <div className="station-title2">
                        Playlist <h2> {station.current.name} </h2>
                        <div className="station-sub-title">
                            <b> {station.current.owner.display_name} </b> *                        
                            {station.current.followers.total} save *
                            {station.current.tracks.items.length} songs, 
                            {/* TODO create a function to get the duration of the album. maybe api?*/}
                            about 4 hr 30 min
                        </div>
                    </div>
                    
                </div>
            </div>

            <div className='controll-btns2'>
                {!isPlaying ? (
                <button type="button" aria-label="Play" className="play playerButton4" onClick={() => onPlayPauseClick(false)}>
                    <span aria-hidden="true" className="iconWrapper">         
                        <Play className="action-btn4" />
                    </span>
                </button>
                ) : (
                <button type="button" aria-label="Pause" className="pause playerButton4" onClick={() => onPlayPauseClick(true)}>
                    <Pause className="action-btn4" />
                </button>
                )}
            </div>   

            <div className="tracks-container">
                <TracksList trackList={tracks}/>
                {/* { tracks.map( (track , i) =>{
                    return (

                        <div key={i}> 
                            <div key={track + 'body'}>
                                <div key={track + 'title'}> {track.track.name} </div>
                                <button type="button" onClick={() => onPlayTrack(track.track)}> PLay Song </button>
                            </div> 
                        </div>
                    )
                }
                ) } */}
            </div> 
        </section >
    )
}

