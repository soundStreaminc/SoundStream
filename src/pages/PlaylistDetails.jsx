import { useParams } from "react-router"
import { stationService } from "../services/station.service"
import { useEffect, useRef, useState } from "react"
import Duration from '../assets/svgs/duration.svg?react'
import { TrackPreview } from "../cmps/TrackPreview"
import { StationDetails_GeneralObjectActionButtons } from "../cmps/stationDetailsCmps/StationDetails_GeneralObjectActionButtons"
import { StationDetails_GeneralObjectHeader } from "../cmps/stationDetailsCmps/StationDetails_GeneralObjectHeader"

export function PlaylistDetails() {
    const params = useParams()
    let miniStation = useRef(null)
    const [tracks, setTracks] = useState(null)
    const [fix, setFix] = useState(false)

    useEffect(() => {
        loadTracks()
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            const stickyOffset = 200; // Replace with your desired pixel value
            const y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
            console.log("y",y)

            if (y >= stickyOffset) {
                setFix(true);
            } else {
                setFix(false);
            }
        };

        window.addEventListener("scroll", handleScroll, true);
        return () => window.removeEventListener("scroll", handleScroll, true);
    }, []);

    // function setFixed() {
    //     const y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    //     console.log('y:', y)
    //     if (window.scrollY >= 1392) {
    //         console.log('hrereree:', window.scrollY)
    //         setFix(true)
    //     } else {
    //         setFix(false)
    //     }
    // }

    async function loadTracks() {
        const foundPlaylist = await stationService.getStationById_SpotifyApi('playlist', params.stationId)
        miniStation.current = {
            id: foundPlaylist.id,
            type: foundPlaylist.type,
            name: foundPlaylist.name,
            image: foundPlaylist.images ? foundPlaylist.images[0].url : 'not found',
            owner: foundPlaylist.owner.display_name,
            followers: foundPlaylist.followers.total,
            count: foundPlaylist.tracks.items.length,
            length: "about 4 hr 30 min",
            description: foundPlaylist.description
        }
        setTracks(foundPlaylist.tracks.items)
    }

    if (!tracks || !miniStation.current.image) return <span> loading in progress... </span>
    return (
        <section className="station-details">
            <StationDetails_GeneralObjectHeader station={miniStation.current} />
            <div className="sticky-container">
                <div className="sticky-header-general-object">
                {fix ? (<StationDetails_GeneralObjectActionButtons
                        isAlreadyAdded={false}
                        imgSrc={miniStation.current.image}
                    />):(  <StationDetails_GeneralObjectActionButtons
                        isAlreadyAdded={false}
                        imgSrc={miniStation.current.image}
                    />)}
                </div>
                <div className="header-row-playlist">
                    <div className="header-index">
                        <p>#</p>
                    </div>
                    <div className="header-title">
                        <p>Title</p>
                    </div>
                    <div className="header-album">
                        <p>Album</p>
                    </div>
                    <div className="header-date-added">
                        <p>Date added</p>
                    </div>
                    <div className="header-duration-playlist">
                        <span aria-hidden="true" className="iconWrapper-playlist">
                            <Duration className="duration-headerImage-playlist" />
                        </span>
                    </div>
                </div>
            </div>
            <div className="tracks-container">
                <div className="track-list-playlist">
                    {tracks.map((track, index) => (
                        <TrackPreview
                            track={track.track}
                            trackAddedAt={track.added_at}
                            tracksDisplayType={miniStation.current.type}
                            index={index + 1}
                            key={track.track ? track.track.id : track.id}
                        />
                    ))}
                </div>
            </div>
        </section >
    )
}

