import { useEffect, useRef, useState } from "react";
import { stationService } from "../services/station.service";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export function HomePage() {
    let tracks = useSelector ( storeState => storeState.currentPlaylist )
    let foundArtist = useSelector ( storeState => storeState.foundArtist )

    const [ albums , setAlbums ] = useState([])

    let inputArtist = useRef('Taylor Swift')

    useEffect( ()=>{           
        stationService.setAccessKey()
    }, [])

    /**
     * Get request with artist Id: grab all the albums from that article
     * @param {*} artist 
     */
    async function getDateByArtist( artist ){
        var artistId = await stationService.getArtistId (  artist)
        var returnedAlbums = await stationService.getAlbumsByArtistId ( artistId)

        setAlbums ( returnedAlbums )
        
    }
    
    function handleChange( {target }){
        inputArtist.current = target.value
    }

    return (
        <section className="home-container">
            <div className="filter-menu-container">
                <button className="filter-btn"> All </button>
                <button className="filter-btn"> Artists </button>
                <button className="filter-btn"> Songs </button>
            </div>
            <div className="filter-results-container">
                <div className="title">
                    <h2>
                        <span> Top result </span>
                    </h2>
                </div>
               
                <div className="top-result-container">
                    <div className="top-result-sub-container">
                        <div className="artist-image-container" >
                            <img className="artist-image" src={foundArtist.images? foundArtist.images[0].url : "not found"} />
                        </div>
                        <div className="artist-name">
                            {foundArtist.name? foundArtist.name : "not found"}
                        </div>
                        <span> Artist </span>
                    </div>
                </div>
                
            </div>
            {/* <div className="station-container">
                <pre> 
                    playlist: {JSON.stringify(tracks, null, "\t") }  
                </pre>   
            </div> */}
            {/* <div className="found-artist-container">
                <pre> 
                    foundArtist: {JSON.stringify(foundArtist, null, "\t") }  
                </pre>   
            </div> */}
            {/* <div className="input-filed-container">
                <label htmlFor="input-field"> Search For Artist:</label>
                <input type="text" id="input-field"  placeholder="Please Insert Artist" onChange={handleChange}/>
            </div>
            

            <input type="button" className="testApi" onClick={()=> getDateByArtist( inputArtist.current )} value="Click to Test"/>
            <div className="albums-container">
                { albums.map( (album , i) =>{
                    console.log('album:', album);
                    return (

                        <Card key={i}> 
                            <Card.Img src={album.images[0].url} key={album.images[0].url}/>
                            <Card.Body key={album + 'body'}>
                                <Card.Title key={album + 'title'}> {album.name} </Card.Title>
                            </Card.Body> 
                            <Link to={`/${album.id}?access-token=${accessToken.current}`}> click </Link>              
                        </Card>
                    )
                }
                ) }
            </div>      */}
        </section >
    )
}

