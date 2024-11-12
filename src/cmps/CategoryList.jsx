import { useEffect, useState } from "react"
import { stationService } from "../services/station.service.js"
import { CategoryPreview } from "./CategoryPreview.jsx"

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
        <section className="category-list-container">
            <div className="category-list">
                {playlists.map((category) => (
                    <CategoryPreview category={category} isPlayingPlaylist={false} key={category.id}/>
                ))}
                </div>
            
        </section>
    )
}