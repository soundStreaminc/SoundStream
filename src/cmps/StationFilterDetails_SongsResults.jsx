import AddToLiked from '../assets/svgs/addToLiked.svg?react';
import MoreOptionFor from '../assets/svgs/moreOptionFor.svg?react';
import PlayWithe from '../assets/svgs/playWithe.svg?react';

export function StationFilterDetails_SongsResults({ songs }){
    return (
        <div className="filter-songs-container">
                    <div className="search-results-object-song-songs-container">
                        {songs.map((song, i) => {
                            const durationInMinutes = Math.floor(song.duration_ms / 60000);
                            const durationInSeconds = Math.floor((song.duration_ms % 60000) / 1000).toString().padStart(2, '0');
                            return (
                                <a href={`/${song.type}/${song.id}`} className="search-results-object-song-mini-details-container" key={i}>
                                    <div className="search-results-object-song-mini-details-sub-container" key={i + 'r'}>
                                        <div className="search-results-object-song-cover-container" key={i + 'a'}>
                                            <img
                                                className="search-results-object-song-music-cover"
                                                src={song.album.images[0].url}
                                                alt={`track artwork for ${song.name} by ${song.artists[0].name}`}
                                                key={i + 'q'}
                                            />
                                            <button type="button" aria-label="Play" className="search-results-object-song-music-cover-playWithe" onClick={() => onPlayPauseClick(false)}>
                                                <span aria-hidden="true" className="search-results-item-svg-playWithe">
                                                    <PlayWithe />
                                                </span>
                                            </button>
                                        </div>

                                        <div className="search-results-object-song-mini-details" key={i + 's'}>
                                            <p className="search-results-object-song-song-title" key={i + 'e'}> {song.name} </p>
                                            <div className="search-results-object-song-artist" key={i + 'o'}> {song.artists[0].name}  </div> { /*//get the details from the song  */}
                                        </div>
                                    </div>

                                    <div className="song-actions">
                                        <div className="action-icon">
                                            <span aria-hidden="true" className="iconWrapper">
                                                <AddToLiked className="add-to-liked" />
                                            </span>
                                        </div>
                                        <div className="song-duration">{durationInMinutes}:{durationInSeconds}</div>
                                        <div className="action-icon">
                                            <span aria-hidden="true" className="iconWrapper">
                                                <MoreOptionFor className="more-option-for" />
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            )
                        }
                        )}
                    </div>
                </div>
    )
}