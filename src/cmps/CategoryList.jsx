import { useEffect, useState } from "react"
import { stationService } from "../services/station.service.js"
import { StationPreview } from "./StationPreview.jsx"

export function CategoryList( {categoryName} ){
    const [playlists, setPlaylists ] = useState( null )

    useEffect(() => {
        loadCategoryPlayedList( categoryName)
    }, [])

    async function loadCategoryPlayedList( categoryName){
        const playlists = await stationService.getCategoryPlaylists ( categoryName )
        setPlaylists ( playlists )
    }

    if( !playlists) return <div> loading, please wait. </div>
    return (
        <section className="most-played-container">
            <div className="most-played-list">
                {playlists.map((station) => (
                    <StationPreview station={station} isPlayingPlaylist={false} key={station.id}/>
                ))}
                </div>
            
        </section>
    )
}