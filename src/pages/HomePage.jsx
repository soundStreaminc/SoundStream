import { useEffect, useRef, useState } from "react";
import { stationService } from "../services/station.service";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import playGreen from '../assets/svgs/playGreen.svg?react';
import omerAdamImage from '../assets/imgs/omerAdam.jpg'; // Import the image


export function HomePage() {
    const [ albums , setAlbums ] = useState([])

    const [ playlists , setplaylists ] = useState([])
    const [activeButton, setActiveButton] = useState(''); // Track which button is active
    let accessToken = useRef('')
    useEffect(() => { console.log(activeButton) }, [activeButton])

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
        setplaylists(artistId)

    }
    
    function handleChange( {target }){
        inputArtist.current = target.value
    }

    return (


        <section className="spotify-homepage" >
    <div className="content-filters"  onClick={()=> getDateByArtist( inputArtist.current )}>
        <button>All</button>
        <button>Music</button>
        <button>Podcasts</button>
    </div>

    <div className="playlists-section">
 
    <div className="horizontal-playlists">
        {/* First Playlist */}
        <Card className="playlist-item">
        <Card.Img src={omerAdamImage} alt="Omer Adam" />
        <Card.Body className="card-body">
            <Card.Title className="card-title">Omer Adam Playlist</Card.Title>
        </Card.Body>
        {/* Play button using the imported image */}
        <img src={playGreen} className="play-button"/>
    </Card>

        {/* Second Playlist */}
        <Card className="playlist-item">
        <Card.Img src={omerAdamImage} alt="Omer Adam" />
        <Card.Body className="card-body">
                <Card.Title>Latin Party 2024</Card.Title>
            </Card.Body>
        </Card>

        {/* Third Playlist */}
        <Card className="playlist-item">
        <Card.Img src={omerAdamImage} alt="Omer Adam" />
        <Card.Body className="card-body">
                <Card.Title>Osher Cohen Mix</Card.Title>
            </Card.Body>
        </Card>

        {/* Fourth Playlist */}
        <Card className="playlist-item">
        <Card.Img src={omerAdamImage} alt="Omer Adam" />
        <Card.Body className="card-body">
                <Card.Title>הלהיטים הגדולים של ישראל</Card.Title>
            </Card.Body>
        </Card>
    </div>
</div>

    <div className="made-for-you-section">
        <h2>Made For You</h2>
        <div className="cards-grid">
            {/* "Made for You" album cards */}
        </div>
    </div>

    <div className="top-mixes-section">
        <h2>Your Top Mixes</h2>
        <div className="cards-grid">
            {/* "Top Mixes" album cards */}
        </div>
    </div>

    <div className="recently-played-section">
        <h2>Recently Played</h2>
        <div className="cards-grid">
            {/* Recently played albums */}
        </div>
    </div>

    <div className="favorite-artists-section">
        <h2>Your Favorite Artists</h2>
        <div className="cards-grid">
            {/* Favorite artists cards */}
        </div>
    </div>

    <div className="recommended-stations-section">
        <h2>Recommended Stations</h2>
        <div className="cards-grid">
            {/* Recommended stations */}
        </div>
    </div>

    <div className="stay-tuned-section">
        <h2>Stay Tuned</h2>
        <div className="cards-grid">
            {/* Stay Tuned cards */}
        </div>
    </div>
</section>
        
    )
}

