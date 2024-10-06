import { useEffect, useRef, useState } from "react";
import { stationService } from "../services/station.service";
import { useSelector } from "react-redux";
import { StationFilter } from "./StationFilter";

export function HomePage() {
    let foundArtists = useSelector ( storeState => storeState.foundArtists )

    useEffect( ()=>{           
        stationService.setAccessKey()
    }, [])

    return (
        <section className="home-container">
            <div className="filter-menu-container">
                <button className="filter-btn"> All </button>
                <button className="filter-btn"> Artists </button>
                <button className="filter-btn"> Songs </button>
            </div>
            
            {/* make this better by not using the use selector and getting from service the search input */}
            {foundArtists[0] && (
                <StationFilter / > 
            
            )}  

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

