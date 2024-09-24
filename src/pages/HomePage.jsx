import { useEffect, useRef } from "react";
import { Player } from "../cmps/Player";
import { stationService } from "../services/station.service";

export function HomePage() {
    let accessToken = useRef('')
    let inputArtist = useRef('Taylor Swift')


    
    

    useEffect( ()=>{
        accessToken.current = stationService.getAccessKey()        
    }, [])

    /**
     * Get request with artist Id: grab all the albums from that article
     * @param {*} artist 
     */
    async function getDateByArtist( artist ){
        var artistId = stationService.getArtistId ( accessToken.current , artist)
        var albums = stationService.getAlbumsByArtistId ( artistId)
        
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
                

         
        </section >
    )
}

