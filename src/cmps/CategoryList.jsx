import { useEffect, useRef, useState } from "react"
import { stationService } from "../services/station.service.js"
import { CategoryPreview } from "./CategoryPreview.jsx"
import {DISPLAYEDSONGSNUMBER} from "../pages/StationFilterDetails.jsx"

export function CategoryList( {categoryName} ){
    const [playlists, setPlaylists ] = useState( null )
    var categoryType = useRef("track")

    useEffect(() => {
        loadCategoryPlayedList( categoryName)
    }, [])

    async function loadCategoryPlayedList( categoryName){
        const categoryArray = await stationService.getCategoryPlaylists ( categoryName, DISPLAYEDSONGSNUMBER )
        categoryType.current = categoryArray[0].type
        setPlaylists ( categoryArray )
    }

    if( !playlists) return <div> loading, please wait. </div>
    return (
        <section className="category-list-container">
            <div className="category-list">
                {playlists.map((category) => (
                    <CategoryPreview category={category} categoryType={categoryType.current} isPlayingPlaylist={ false } key={category.id}/>
                ))}
                </div>
            
        </section>
    )
}