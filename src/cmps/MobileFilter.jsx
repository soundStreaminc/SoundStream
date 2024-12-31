export function MobileFilter(){
    return(
        <section className="mobile-filter-container">
            <button className="mobile-user-profile-btn" >
                <figure>
                    <div className="user-profile-container" style={{ "borderRadius": "50%", "width": "32px", "height": "32px", "insetInlineStart": "0px" }}>
                        <img
                            src="https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10216273432443013&height=50&width=50&ext=1731476384&hash=Abb3U5-0-6bLM3quVOH_n7mU"
                            //alt="Yozik Personage"  TODO: ADD user name
                            className="user-profile-img" />
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