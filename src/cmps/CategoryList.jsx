import { useEffect, useRef, useState } from "react"
import { stationService } from "../services/station.service.js"
import { CategoryPreview } from "./CategoryPreview.jsx"

export function CategoryList( {categoryName} ){
    const [playlists, setPlaylists ] = useState( null )
    var categoryType = useRef("track")
    const DISPLAYEDCATEGORYONMAINPAGE = 12
    useEffect(() => {
        loadCategoryPlayedList( categoryName)
    }, [])
    async function loadCategoryPlayedList( categoryName){
        if ( categoryName === 'Recently Played'){
            var recentlyPlayedArray = await stationService.getRecentlyPlayedByUser('ohad') //TODO should be changed according to user
            categoryType.current = 'track'
            setPlaylists ( recentlyPlayedArray )
        } else {
            const categoryArray = await stationService.getCategoryPlaylists ( categoryName, DISPLAYEDCATEGORYONMAINPAGE )
            if( !categoryArray | categoryArray.length === 0 ) return
            categoryType.current = categoryArray ? categoryArray[0].type : null
            setPlaylists ( categoryArray )
        }
    }
    if( !playlists | !categoryType.current ) return <div> loading, please wait. </div>
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