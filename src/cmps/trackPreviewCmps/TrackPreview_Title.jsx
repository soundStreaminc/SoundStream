import { useNavigate } from "react-router";

export function TrackPreview_Title({track, tracksDisplayType}){
    const isPlaylist = tracksDisplayType === 'playlist'
    const isArtist = tracksDisplayType === 'artist'
    const navigate = useNavigate()

    function navigateTo(path){
        navigate(path)
    }

    return (
        <div className="track-title">
            {(isPlaylist || isArtist) && track?.album?.images[0]?.url && (
                <div className="track-image">
                    <img src={track.album.images[0].url} className="album-cover-image" alt="Album Cover" />
                </div>
            )}
            <div className="name-artist-container">
                <div className="track-preview-name-container">
                    <div onClick={() => navigateTo(`track/${track.id}`)} className="track-name">
                        {track?.name || track.name}
                    </div>
                </div>
                {(!isArtist) && (<div className="track-preview-artist-container">
                    <div onClick={() => navigateTo(`/artist/${track.artists[0].id}`)} className="track-artist">
                        {track.artists[0].name}
                    </div>
                </div>)
                }
            </div>
        </div>
    )
}