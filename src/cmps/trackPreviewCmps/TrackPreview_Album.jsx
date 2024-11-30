export function TrackPreview_Album({track, tracksDisplayType}){
    const isPlaylist = tracksDisplayType === 'playlist'

    return (
        <div className="track-preview-album">
            {isPlaylist && <div className="track-album">{track?.album?.name}</div>}
        </div>   
    )
}