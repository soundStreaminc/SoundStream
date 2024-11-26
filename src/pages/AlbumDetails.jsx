import { useParams } from "react-router"
import { stationService } from "../services/station.service"
import { useEffect, useRef, useState } from "react"
import Duration from '../assets/svgs/duration.svg?react'
import { StationDetails_GeneralObjectHeader } from "../cmps/StationDetails_GeneralObjectHeader"
import { TrackPreview } from "../cmps/TrackPreview"

export function AlbumDetails(){
    const params = useParams()
    let miniStation = useRef(null)
    const [ tracks , setTracks] = useState(null)

    useEffect(() => {
        loadTracks()
    }, [])

    async function loadTracks(){
        const foundAlbum = await stationService.getStationById_SpotifyApi( 'album', params.albumId ) 
        miniStation.current = {
            id: foundAlbum.id, 
            type : foundAlbum.type,
            name: foundAlbum.name,
            image: foundAlbum.images ? foundAlbum.images[0].url : 'not found',
            count: foundAlbum.total_tracks,
            length: "about 4 hr 30 min",
            artist: foundAlbum.artists[0].name,
            releaseDate: foundAlbum.release_date

        }
        setTracks(foundAlbum.tracks.items) 
    }
   
    if(!tracks || !miniStation.current.image) return <span> loading in progress... </span>
    return (
        <section className="album-details">
            <StationDetails_GeneralObjectHeader station={miniStation.current} isAlreadyAdded={false}/>
            <div className="os-scrollbar os-scrollbar-horizontal os-theme-spotify os-scrollbar-auto-hide os-scrollbar-handle-interactive os-scrollbar-track-interactive os-scrollbar-cornerless os-scrollbar-unusable os-scrollbar-auto-hide-hidden" >
                <div className="os-scrollbar-track">
                    <div className="os-scrollbar-handle">
                    </div>
                </div>
            </div>
            <div className='header-row-album'>
                <div className="header-index-album">
                    <p> # </p> 
                </div>
                
                <div className="header-title-album">
                    <p> Title </p> 
                </div>
                
                <div className="header-duration-album">
                    <span aria-hidden="true" className="iconWrapper-album">         
                        <Duration className="duration-headerImage-album"/>
                    </span>
                </div>
            </div>
            <br/>
            <div className="track-list-album">
                {tracks.map((track, index) => (
                    // <TrackPreview track={track} index={index} key={track.track? track.track.id: track.id} isPlaylist={false}/>    
                    <TrackPreview track={track} index={index + 1} key={track.id} isPlaylist={false} />   
                ))}
            </div> 
        </section >
    )
}