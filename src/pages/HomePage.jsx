import { useEffect, useRef, useState } from "react";
import { stationService } from "../services/station.service";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export function HomePage() {
    const [ albums , setAlbums ] = useState([])
    let accessToken = useRef('')
    let inputArtist = useRef('Taylor Swift')

    useEffect( ()=>{
        stationService.getAccessKey().then( result => result.json())
        .then( data =>   accessToken.current = data.access_token ) 
    }, [])

    /**
     * Get request with artist Id: grab all the albums from that article
     * @param {*} artist 
     */
    async function getDateByArtist( artist ){
        console.log('accessToken.current:', accessToken.current)
        var artistId = await stationService.getArtistId ( accessToken.current , artist)
        var returnedAlbums = await stationService.getAlbumsByArtistId ( accessToken.current ,artistId)
        setAlbums ( returnedAlbums )
    }
    
    function handleChange( {target }){
        inputArtist.current = target.value
    }

    return (
        <section className="home-container">
            <h1>    Home sweet Home     </h1> 
            <div className="input-filed-container">
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
            </div> 

            
         
        </section >
    )
}

