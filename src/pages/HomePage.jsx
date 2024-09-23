import { useEffect, useRef } from "react";
import { Player } from "../cmps/Player";

export function HomePage() {
    let accessToken = useRef('')
    let inputArtist = useRef('Taylor Swift')

    const clientId = import.meta.env.VITE_CLIENT_ID
    const clientSecret = import.meta.env.VITE_CLIENT_SECRET
    
    

    useEffect( ()=>{
        //TODO add error handling
        //API ACESS TOKEN
        var authParameters = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials&client_id=' + 
                clientId + '&client_secret=' + clientSecret
        }
        console.log('authParameters:', authParameters)
        fetch ( 'https://accounts.spotify.com/api/token', authParameters )
            .then( result => result.json())
            .then( data => accessToken.current = data.access_token)
        
    }, [])

    /**
     * Get request with artist Id: grab all the albums from that article
     * @param {*} artist 
     */
    async function getDateByArtist( artist ){
        var searchParameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken.current
            }
        }
        var artistId = await fetch ( 'https://api.spotify.com/v1/search?q=' + 
            artist + '&type=artist' , searchParameters)
            .then( response => response.json())
            .then( data => { return  data.artists.items[0].id }

            )
        
         console.log('artistId:', artistId)

         var albums = await fetch ('https://api.spotify.com/v1/artists/' + 
            artistId + '/albums' + '?', searchParameters )
            .then( response => response.json())
            .then( data => { return  data }
            )
        console.log('albums:', albums)
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

