import { useParams } from "react-router"
import { stationService } from "../services/station.service"
import { useEffect, useRef, useState } from "react"
import Duration from '../assets/svgs/duration.svg?react'
import { TrackPreview } from "../cmps/TrackPreview"
import { StationDetails_GeneralObjectActionButtons } from "../cmps/stationDetailsCmps/StationDetails_GeneralObjectActionButtons"
import { StationDetails_GeneralObjectHeader } from "../cmps/stationDetailsCmps/StationDetails_GeneralObjectHeader"
import { StationDetails_GeneralObjectActionButtonsSticky } from "../cmps/stationDetailsCmps/StationDetails_GeneralObjectActionButtonsSticky"
export function PlaylistDetails({ scrollableContainerRef }) {
    const params = useParams();
    const miniStation = useRef({
        id: null,
        type: '',
        name: '',
        image: '',
        owner: '',
        followers: 0,
        count: 0,
        length: '',
        description: ''
    });
    const [tracks, setTracks] = useState(null);
    const [fix, setFix] = useState(false);

    useEffect(() => {
        loadTracks();
    }, []);

    useEffect(() => {
        const scrollableElement = scrollableContainerRef?.current || window;
        scrollableElement.addEventListener("scroll", setFixed, true);
        return () => scrollableElement.removeEventListener("scroll", setFixed, true);
    }, [scrollableContainerRef]);

    function setFixed() {
        const scrollableElement = scrollableContainerRef?.current || document.documentElement;
        const y = scrollableElement.scrollTop || 0;

        if (y >= 200) {
            setFix(true);

        } else {
            setFix(false);
        }
    }

    function switchHader(isSticky) {
        if (isSticky) {
            return <StationDetails_GeneralObjectActionButtonsSticky isAlreadyAdded={false} imgSrc={miniStation.current.image} station={miniStation.current} />

        }

        return <StationDetails_GeneralObjectActionButtons isAlreadyAdded={false} imgSrc={miniStation.current.image} />
    }

    async function loadTracks() {
        const foundPlaylist = await stationService.getStationById_SpotifyApi('playlist', params.stationId);
        miniStation.current = {
            id: foundPlaylist.id,
            type: foundPlaylist.type,
            name: foundPlaylist.name,
            image: foundPlaylist.images?.[0]?.url || 'Image not found',
            owner: foundPlaylist.owner.display_name,
            followers: foundPlaylist.followers.total,
            count: foundPlaylist.tracks.items.length,
            length: "about 4 hr 30 min",
            description: foundPlaylist.description
        };
        setTracks(foundPlaylist.tracks.items);
    }
  
    if (!tracks || !miniStation.current.image) return <span>Loading in progress...</span>

    return (
        <section className="station-details">
            <StationDetails_GeneralObjectHeader station={miniStation.current} />


            <div className={fix ? 'sticky-general-header' : 'general-header'}>
                {switchHader(fix)}
                {/* <StationDetails_GeneralObjectActionButtons isAlreadyAdded={false} imgSrc={miniStation.current.image} /> */}
                <div className="tracks-header-container-playlist">
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
            </div>
            <div className="tracks-container-playlist">
                <div className="track-list-playlist">
                    {tracks.map((track, index) => (
                        <TrackPreview
                            track={track.track}
                            trackAddedAt={track.added_at}
                            tracksDisplayType={miniStation.current.type}
                            index={index + 1}
                            key={track.track?.id || track.id}
                        />
                    ))}
                </div>
            </div>

        </section>
    )
}
