import { useEffect, useRef, useState } from "react";
import { stationService } from "../services/station.service";
import { useSelector } from "react-redux";
import { Card } from "react-bootstrap";
import omerAdamImage from '../assets/imgs/omerAdam.jpg'; // Import the image
import { MostPlayedList } from "../cmps/MostPlayedList";
import { CategoryList } from "../cmps/CategoryList";


export function HomePage() {
    const [ albums , setAlbums ] = useState([])

    const [ playlists , setplaylists ] = useState([])
    const [activeButton, setActiveButton] = useState(''); // Track which button is active

    let inputArtist = useRef('Taylor Swift')
    let foundArtists = useSelector ( storeState => storeState.foundArtists )

    useEffect( ()=>{           
        stationService.setAccessKey()
    }, [])

    return (
        <section className="spotify-homepage" >
            <div className="content-filters"  onClick={()=> getDateByArtist( inputArtist.current )}>
                <button>All</button>
                <button>Music</button>
                <button>Podcasts</button>
            </div>

            <MostPlayedList />

            <div className="made-for-you-section">
                <h2>Made For You</h2>
                <CategoryList categoryName='madeForU' />
            </div>

            <div className="top-mixes-section">
                <h2>Your Top Mixes</h2>
                <CategoryList categoryName='topMixes' />
            </div>

            <div className="recently-played-section">
                <h2>Recently Played</h2>
                <CategoryList categoryName='recentlyPlayed' />
            </div>

            <div className="favorite-artists-section">
                <h2>Your Favorite Artists</h2>
                <CategoryList categoryName='favoriteArtists' />
            </div>

            <div className="recommended-stations-section">
                <h2>Recommended Stations</h2>
                <CategoryList categoryName='recommendedStations' />
            </div>

            <div className="stay-tuned-section">
                <h2>Stay Tuned</h2>
                <CategoryList categoryName='stayTuned' />
            </div>  
        </section>
     
    )
}

