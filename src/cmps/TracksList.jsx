// import { TrackPreview } from "./TrackPreview";
// import Duration from '../assets/svgs/duration.svg?react'

// export function TracksList({ trackList, isPlaylist=false,isAlbum=false }){
//     return (
//         <section className="track-list-container">
//             <div className='header-row-playlist'>
//                 <div className="header-index">
//                     <p> # </p> 
//                 </div>
                
//                 <div className="header-title">
//                     <p> Title </p> 
//                 </div>
//                 {isPlaylist ? (<div className="header-album">
//                     <p> Album </p> 
//                 </div>):''}

//                 {isPlaylist ? (<div className="header-date-added">
//                     <p> Date added </p> 
//                 </div>): ''}
                
              
//                 {isPlaylist ?(<div className="header-duration-playlist">
//                     <span aria-hidden="true" className="iconWrapper-playlist">         
//                         <Duration className="duration-headerImage-playlist"/>
//                     </span>


                   
//                 </div>):''}
//                 {isAlbum ?( <div className="header-duration-album">
//                     <span aria-hidden="true" className="iconWrapper-album">         
//                         <Duration className="duration-headerImage-album"/>
//                     </span>
//                 </div>
//              ):''}
//             </div>
            

//                          <div className='header-row-album'>
//                 <div className="header-index">
//                     <p> # </p> 
//                 </div>
                
//                 <div className="header-title">
//                     <p> Title </p> 
//                 </div>
//                 {/* {isPlaylist ? (<div className="header-album">
//                     <p> Album </p> 
//                 </div>):''}

//                 {isPlaylist ? (<div className="header-date-added">
//                     <p> Date added </p> 
//                 </div>): ''}
                
              
//                 {isPlaylist ?(<div className="header-duration-playlist">
//                     <span aria-hidden="true" className="iconWrapper-playlist">         
//                         <Duration className="duration-headerImage-playlist"/>
//                     </span>


                   
//                 </div>):''} */}
//                 {isAlbum ?( <div className="header-duration-album">
//                     <span aria-hidden="true" className="iconWrapper-album">         
//                         <Duration className="duration-headerImage-album"/>
//                     </span>
//                 </div>
//              ):''}
//             </div>
//             <br/>
//             <div className="track-list-album">
//                 {trackList.map((track, index) => (
//                     <TrackPreview track={track} index={index} key={track.track? track.track.id: track.id} isPlaylist={isPlaylist}/>       
//                 ))}
//                 </div> 
//                 <div className="track-list-playlist">
//                 {trackList.map((track, index) => (
//                     <TrackPreview track={track} index={index} key={track.track? track.track.id: track.id} isPlaylist={isPlaylist}/>       
//                 ))}
//                 </div> 
            
//         </section>
//     )
// }