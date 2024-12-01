import { useParams } from "react-router"
import { stationService } from "../services/station.service"
import { useEffect, useRef, useState } from "react"
import { StationDetails_GeneralObjectHeader } from "../cmps/StationDetails_GeneralObjectHeader"
import { TrackPreview } from "../cmps/TrackPreview"

export function ArtistDetails(  ) {
    const params = useParams()
    let miniStation = useRef(null)
    const [ tracks , setTracks] = useState(null)

    useEffect(() => {
        loadTracks()
    }, [])

    async function loadTracks(){
        const foundArtist = await stationService.getStationById_SpotifyApi( 'artists', params.artistId ) 
        miniStation.current = {
            id: foundArtist.id, 
            type : foundArtist.type,
            name: foundArtist.name,
            image: foundArtist.images[0] ? foundArtist.images[0].url : 'not found',
            followers: foundArtist.followers.total,
        }
        const getTopTracks = await stationService.getTopTracksByArtistId_SpotifiApi(foundArtist.id)
        setTracks(getTopTracks.tracks) 
    }

    if(!tracks || !miniStation.current.image) return <span> loading in progress... </span>
    return (
        <section className="station-details-artist">
            <StationDetails_GeneralObjectHeader station={miniStation.current} isAlreadyAdded={false}/>

            <div className="tracks-container-artist">
                <h1>Popular</h1>
                <div className='header-row-artist'>
                </div>
                <br/>
                <div className="track-list-artist">
                    {tracks.map((track, index) => (
                        <TrackPreview track={track} trackAddedAt={track.added_at} tracksDisplayType={miniStation.current.type} index={index + 1} key={ track.id}/>       
                    ))}
                </div> 
            </div> 
        </section >
    )
}

