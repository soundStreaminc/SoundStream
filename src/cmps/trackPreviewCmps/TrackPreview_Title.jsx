export function TrackPreview_Title({track, tracksDisplayType}){
    const isPlaylist = tracksDisplayType === 'playlist'
    const isArtist = tracksDisplayType === 'artist'

    return (
        <div className="track-title">
            {(isPlaylist || isArtist) && track?.album?.images[0]?.url && (
                <div className="track-image">
                    <img src={track.album.images[0].url} className="album-cover-image" alt="Album Cover" />
                </div>
            )}
            <div className="name-artist-container">
                <div className="track-preview-name-container">
                    <a href={`/track/${track?.id || track.id}`} className="track-name">
                        {track?.name || track.name}
                    </a>
                </div>
                {(!isArtist) && (<div className="track-preview-artist-container">
                    <a href={`/artist/${track?.artists[0]?.id || track.artists[0]?.id}`} className="track-artist">
                        {track?.artists[0]?.name || track.artists[0]?.name}
                    </a>
                </div>)
                }
            </div>
        </div>
    )
}