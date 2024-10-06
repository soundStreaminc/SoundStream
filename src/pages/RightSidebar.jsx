export function RightSidebar(){
    return (
        <section className="spotify-homepage">
        <div className="content-filters">
            <button>All</button>
            <button>Music</button>
            <button>Podcasts</button>
        </div>
    
        <div className="playlists-section">
            <h2>Your Playlists</h2>
            <div className="playlists-grid">
                {/* Your playlist cards will go here */}
            </div>
        </div>
    
        <div className="made-for-you-section">
            <h2>Made For You</h2>
            <div className="cards-grid">
                {/* "Made for You" album cards */}
            </div>
        </div>
    
        <div className="top-mixes-section">
            <h2>Your Top Mixes</h2>
            <div className="cards-grid">
                {/* "Top Mixes" album cards */}
            </div>
        </div>
    
        <div className="recently-played-section">
            <h2>Recently Played</h2>
            <div className="cards-grid">
                {/* Recently played albums */}
            </div>
        </div>
    
        <div className="favorite-artists-section">
            <h2>Your Favorite Artists</h2>
            <div className="cards-grid">
                {/* Favorite artists cards */}
            </div>
        </div>
    
        <div className="recommended-stations-section">
            <h2>Recommended Stations</h2>
            <div className="cards-grid">
                {/* Recommended stations */}
            </div>
        </div>
    
        <div className="stay-tuned-section">
            <h2>Stay Tuned</h2>
            <div className="cards-grid">
                {/* Stay Tuned cards */}
            </div>
        </div>
    </section>
    
    )
}