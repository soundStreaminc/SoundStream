import { useState } from 'react';
import UserIcon from '../assets/svgs/noImageArtist.svg?react';

export function MobileFilter(){
    const [activeButton, setActiveButton] = useState('all'); // Track which button is active

    const handleAllClick = () => {
        setActiveButton('all'); // Set All as the active button
    }

    const handleMusicClick = () => {
        setActiveButton('music'); // Set Music as the active button
    }

    const handlePodcastsClick = () => {
        setActiveButton('podcasts'); // Set Podcasts as the active button
    }

    return(
        <section className="mobile-filter-container">
            <button className="mobile-user-profile-btn" >
                <figure>
                    <div className="user-profile-container" style={{ "borderRadius": "50%", "width": "32px", "height": "32px", "insetInlineStart": "0px" }}>
                        <UserIcon />
                    </div>
                </figure>
            </button>
            <div className="mobile-filters-background">
                <div className="content-filters">
                    <button className={`app-header-filters icon ${activeButton === 'all' ? 'active' : ''}`}
                        onClick={() => {
                            handleAllClick()
                        }}>
                            All
                    </button>
                    <button className={`app-header-filters icon ${activeButton === 'music' ? 'active' : ''}`}
                        onClick={() => {
                            handleMusicClick()
                        }}>
                            Music
                    </button>
                    <button  className={`app-header-filters icon ${activeButton === 'podcasts' ? 'active' : ''}`}
                        onClick={() => {
                            handlePodcastsClick()
                        }}>
                            Podcasts
                    </button>
                </div>
            </div>
        </section>
    )
}