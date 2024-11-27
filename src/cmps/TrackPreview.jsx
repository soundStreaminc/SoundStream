import { useState } from 'react';
import AddToLiked from '../assets/svgs/addToLiked.svg?react';
import MoreOptionFor from '../assets/svgs/moreOptionFor.svg?react';
export function TrackPreview({ track, index, isPlaylist, isPlayingPlaylist = false }) {
    const [isPlaying, setIsPlaying] = useState(isPlayingPlaylist);

    function onPlayPauseClick() {
        if (isPlaying) {
            //audioRef.current.pause();// this will pause the audio
            setIsPlaying(false)
        } else {
            //audioRef.current.play();
            setIsPlaying(true)
        }
    }

    function getFormattedDate(dateVar) {
        let date = new Date(dateVar);
        let year = date.getFullYear();
        let month = date.toLocaleString("en-US", { month: "short" })
        //let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');

        return month + ' ' + day + '/' + year;
    }

    function convertMsToMinutes(miliSeconds) {
        const ms = miliSeconds
        const mmss = new Date(ms).toLocaleTimeString().substring(3, 7)
        return mmss
    }

    return  <section className={`track-preview-container ${isPlaylist ? "playlist" : "album"}`}>
    <div className={isPlaylist ? "track-preview-grid-container-playlist" : "track-preview-grid-container-album"}>
        {/* Track Number */}
        <div className="track-number">{index}</div>

        {/* Track Title and Artist */}
        <div className="track-title">
            {isPlaylist && track.track?.album?.images[0]?.url && (
                <div className="track-image">
                    <img src={track.track.album.images[0].url} className="album-cover-image" alt="Album Cover" />
                </div>
            )}
            <div className="name-artist-container">
                <div className="track-preview-name-container">
                    <a href={`/track/${track.track?.id || track.id}`} className="track-name">
                        {track.track?.name || track.name}
                    </a>
                </div>
                <div className="track-preview-artist-container">
                    <a href={`/artist/${track.track?.artists[0]?.id || track.artists[0]?.id}`} className="track-artist">
                        {track.track?.artists[0]?.name || track.artists[0]?.name}
                    </a>
                </div>
            </div>
        </div>

        {/* Album Name for Playlists */}
        {isPlaylist && <div className="track-album">{track.track?.album?.name}</div>}

        {/* Date Added for Playlists */}
        {isPlaylist && <div className="track-date-added">{getFormattedDate(track.added_at)}</div>}

        {/* Track Duration and Actions */}
        <div className={isPlaylist ? "track-actions-playlist" : "track-actions-album"}>
            <button className="track-preview-action-icon">
                <span aria-hidden="true" className="iconWrapper">
                    <AddToLiked className="add-to-liked" />
                </span>
            </button>
            <div className="track-duration">
                {convertMsToMinutes(track.track?.duration_ms || track.duration_ms)}
            </div>
            <button className="track-preview-action-icon-more">
                <span aria-hidden="true" className="iconWrapper">
                    <MoreOptionFor className="more-option-for" />
                </span>
            </button>
        </div>
    </div>
</section>
}