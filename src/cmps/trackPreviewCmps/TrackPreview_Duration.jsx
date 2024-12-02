import AddToLiked from '../../assets/svgs/addToLiked.svg?react';
import MoreOptionFor from '../../assets/svgs/moreOptionFor.svg?react';

export function TrackPreview_Duration({track, tracksDisplayType}){
    const isPlaylist = tracksDisplayType === 'playlist'
    const isArtist = tracksDisplayType === 'artist'

    function convertMsToMinutes(miliSeconds) {
        const ms = miliSeconds
        const mmss = new Date(ms).toLocaleTimeString().substring(3, 7)
        return mmss
    }
    
    return (
        <div className={(isPlaylist) ? "track-actions-playlist" : "track-actions-album"}>
            <button className="track-preview-action-icon">
                <span aria-hidden="true" className="iconWrapper">
                    <AddToLiked className="add-to-liked" />
                </span>
            </button>
            <div className="track-duration">
                {convertMsToMinutes(track?.duration_ms || track.duration_ms)}
            </div>
            <button className="track-preview-action-icon-more">
                <span aria-hidden="true" className="iconWrapper">
                    <MoreOptionFor className="more-option-for" />
                </span>
            </button>
        </div>  
    )
}