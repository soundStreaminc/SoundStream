export function TrackPreview_DateAdded({trackAddedAt}){

    function getFormattedDate(dateVar) {
        let date = new Date(dateVar);
        let year = date.getFullYear();
        let month = date.toLocaleString("en-US", { month: "short" })
        //let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');

        return month + ' ' + day + '/' + year;
    }

    return (
        <div className="track-date-added">{getFormattedDate(trackAddedAt)}</div>
    )
}