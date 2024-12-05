import { useState } from 'react';
import { TrackPreview_Title } from './trackPreviewCmps/trackPreview_Title';
import { TrackPreview_Album } from './trackPreviewCmps/TrackPreview_Album';
import { TrackPreview_DateAdded } from './trackPreviewCmps/TrackPreview_DateAdded';
import { TrackPreview_Duration } from './trackPreviewCmps/TrackPreview_Duration';
export function TrackPreview({ track, trackAddedAt, tracksDisplayType, index, isPlayingPlaylist = false }) {
    const [isPlaying, setIsPlaying] = useState(isPlayingPlaylist);
    const isPlaylist = tracksDisplayType === 'playlist'
    const isArtist = tracksDisplayType === 'artist'
    
    // function onPlayPauseClick(event) {
    //     event.preventDefault();
    //     event.stopPropagation();
    //     if (isPlaying) {
    //         //audioRef.current.pause();// this will pause the audio
    //         setIsPlaying(false)
    //     } else {
    //         //audioRef.current.play();
    //         setIsPlaying(true)
    //     }
    // }
    
    return  (
        <section className={`track-preview-container ${isPlaylist ? "playlist" : "album"}`}>
            <div className={isPlaylist ? "track-preview-grid-container-playlist" : "track-preview-grid-container-album"}>
                {/* Track Number */}
                <div className="track-number">
                    <div className='track-number-container'>
                        <span className="encore-text encore-text-body-medium xNyTkXEncSjszLNI65Nq" data-encore-id="text"> {index} </span>
                    </div>    
                </div>

                {/* Track Title and Artist */}
                <TrackPreview_Title track={track} tracksDisplayType={tracksDisplayType}/>

                {/* Album Name for Playlists */}
                {isPlaylist && <TrackPreview_Album track={track} tracksDisplayType={tracksDisplayType}/>}

                {/* track popularity Number for artitst */}
                {/* {isArtist && <div className="track-preview-popular">
                    <div className="popularity-number"></div>
                    </div> 
                }   */}

                {/* Date Added for Playlists */}
                {isPlaylist &&  <TrackPreview_DateAdded trackAddedAt={trackAddedAt} tracksDisplayType={tracksDisplayType}/>}

                {/* Track Duration and Actions */}
                <TrackPreview_Duration track={track} tracksDisplayType={tracksDisplayType}/>
            </div>
        </section>
    )
}