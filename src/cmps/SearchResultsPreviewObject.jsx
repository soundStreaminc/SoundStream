import Play from '../assets/svgs/play.svg?react'

export function SearchResultsPreviewObject({ miniObject }){
    return (
        <section className="search-results-preview-object">
            <a href={`/${miniObject.type}/${miniObject.id}`}
                className="search-results-mini-details-container">
                <button type="button" className="search-result-object-add-btn"
                    onClick={() => location.href(`/playlist/${miniObject.id}`)} />
            
                <div className="search-result-object-mini-details-sub-container">
                    <div className="search-result-object-music-cover-container">
                        {miniObject.image ? (
                            <img className="search-result-object-music-cover" src={miniObject.image}
                            alt={`track artwork for ${miniObject.name}`}
                        />): ''}
                        <span aria-hidden="true" className="search-result-object-play-wrapper">
                            <Play className="action-btn5" />
                        </span>
                    </div>
            
                    <div className="search-result-object-mini-details">
                        <p className="search-result-object-title">{miniObject.name}</p>
                        <p className="search-result-object-subtitle">By {miniObject.owner}</p>
                    </div>
                </div>
            </a>
                
        </section>
    )
}