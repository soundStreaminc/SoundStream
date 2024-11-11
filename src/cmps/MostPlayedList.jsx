import { useEffect, useState } from "react"
import { stationService } from "../services/station.service.js"
import { StationPreview } from "./StationPreview.jsx"

export function MostPlayedList(){
    const [playlists, setPlaylists ] = useState( null )

    useEffect(() => {
        loadMostPlayedList()
    }, [])

    async function loadMostPlayedList(){
        const playlists = await stationService.getMostPlayed_SpotifiApi()
        console.log('playlists:', playlists)
        setPlaylists ( playlists )
    }

    if( !playlists) return <div> loading, please wait. </div>
    return (
        <section className="most-played-container">
            <ul className="most-played-list">
                {playlists.map((station) => (
                    <div className="most-played-preview" key={station._id}>
                        <StationPreview station={station} />
                    </div>
                ))}
                </ul>
            
        </section>
    )
}