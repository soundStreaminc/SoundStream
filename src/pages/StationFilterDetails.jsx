import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { stationService } from "../services/station.service";

export function StationFilterDetails(){
    let foundArtists = useSelector ( storeState => storeState.foundArtists )
    let foundSongs = useSelector ( storeState => storeState.foundSongs )

    const params = useParams()
    const [searchParams, setSearchParams] = useSearchParams()  
    const [searchTerm, setSearchTerm] = useState( params  ); // Declare and initialize searchTerm

    useEffect( ()=>{   
        setSearchParams(searchTerm.size > 0 ? { filterText: searchTerm }: '')
        console.log('StationFilterDetails useEffect searchTerm:', searchTerm)

    }, [ searchTerm ])

    if (!foundArtists[0] ) return <span> station filter details page loading.. </span>
    return (
        <section className="station-filter-container">
            <div className="filter-menu-container">
                <button className="filter-btn"> All </button>
                <button className="filter-btn"> Artists </button>
                <button className="filter-btn"> Songs </button>
            </div>
                <div className="filter-top-result-container">
                    <div className="title">
                        <h2>
                            <span> Top result </span>
                        </h2>
                    </div>
                
                    
                    <div className="top-result-container">
                        <div className="top-result-sub-container">
                            <div className="artist-image-container" >
                                <img className="artist-image" src={foundArtists[0].images? foundArtists[0].images[0].url : "not found"} />
                            </div>
                            <div className="artist-name">
                                {foundArtists[0].name ? foundArtists[0].name : "not found"}
                            </div>
                            <span> Artist </span>
                        </div>
                    </div>  
                </div>

                <div className="filter-songs-container">
                    <div className="title">
                        <h2>
                            <span> Songs </span>
                        </h2>
                    </div>
                
                    
                    <div className="songs-container">
                        { foundSongs.map( (song , i) =>{
                            console.log('song:', song);
                            return (

                                <div className="mini-details-container" key={i}>
                                    <div className="mini-details-sub-container" key={i + 'r'}>
                                        <div className="musicCover-container" key={i + 'a'}>
                                            <img
                                            className="musicCover"
                                            src={song.album.images[0].url}
                                            alt={`track artwork for ${song.name} by ${song.artists[0].name}`}
                                            key={i + 'q'}
                                            />
                                        </div>
                                        
                                        <div className="mini-details" key={i + 's'}>
                                            <div className="artist" key={i + 'o'}> {song.artists[0].name}  </div> { /*//get the details from the song  */}
                                            <p className="song-title" key={i + 'e'}> {song.name} </p>
                                        </div> 

                                        
                                    </div>
                                    
                                </div>
                            )
                        }
                        ) }
                    </div>  
                </div>
        </section>
    )
}