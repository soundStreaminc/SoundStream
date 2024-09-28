import { useParams } from "react-router"
import { stationService } from "../services/station.service"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Card } from "react-bootstrap";


export function StationDetails() {
    const params = useParams()
    const [ station , setStation] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()  

    useEffect(() => {
        loadTracks()
    }, [params])

    async function loadTracks(){
        const tracks = await stationService.getTracksByAlbumId( searchParams.get('access-token') ,params.stationId)
        setStation(tracks)
    }

    function setSong ( url){
        try {
            //var currentSong = SoundPlayer.playUrl(url);
           } catch (e) {
            console.error(e);
           }
    }

    if(!station) return <span> loading in progress... </span>
    return (
        <section className="station-details">
            <div className="tracks-container">
                { station.map( (track , i) =>{
                    console.log('track:', track);
                    return (

                        <Card key={i}> 
                            <Card.Body key={track + 'body'}>
                                <Card.Title key={track + 'title'}> {track.name} </Card.Title>
                            </Card.Body> 
                        </Card>
                    )
                }
                ) }
            </div> 
        </section >
    )
}

