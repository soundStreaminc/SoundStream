import UserIcon from '../assets/svgs/noImageArtist.svg?react';

export function MobileFilter(){
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
                <div className="content-filters"  onClick={()=> getDateByArtist( inputArtist.current )}>
                    <button>All</button>
                    <button>Music</button>
                    <button>Podcasts</button>
                </div>
            </div>
        </section>
    )
}