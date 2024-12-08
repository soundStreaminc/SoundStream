import { useNavigate } from "react-router";

export function TrackPreview_Album({track, tracksDisplayType}){
    const isPlaylist = tracksDisplayType === 'playlist'
    const navigate = useNavigate()

    function onButtonClickHandler (  ) {
        navigate(`/album/${track.album?.id}`);
    }
    
    return (
        <div className="track-preview-album">
            {isPlaylist && <div className="track-album" onClick={onButtonClickHandler}>
                {track?.album?.name}
            </div>}
        </div>   
    )
}