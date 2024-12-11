import { StationDetails_GeneralObjectMiniTitle } from "./StationDetails_GeneralObjectMiniTitle";
import { usePalette } from "react-palette";
import NoImageArtist from '../../assets/svgs/noImageArtist.svg?react';

export function StationDetails_GeneralObjectHeader({ station }){
    const isArtistImageExist= station.image ? true : false
    const isArtistImg= station.type === 'artist' ? true : false
    const imgSrc = station.image 
    const { data, loading, error } = usePalette(imgSrc)

    
    if (!station) return
    return(
        <section className="general-object-header">
            <div className="station-info-general"  style={{ 
                'backgroundImage': 'linear-gradient(' + data.vibrant + ', oklch(from ' + data.vibrant + ' calc(l - .5) c h))',
                'backgroundColor' : '#282828'
                }}>
                <div className="station-sub-info">
                    <div className={ isArtistImg ? "cover-station-artist" : "cover-station"}>
                    {isArtistImageExist ? <img src={imgSrc} /> : 
                    <div className="general-object-header-svg-container">
                        <div className="general-object-header-svg-radius-container">
                            <NoImageArtist />
                        </div>
                    </div>                
                    }
                    </div>
                    <div className="station-titles-container">
                        <div className="station-title3"> {/* TODO: for song details should be song and not track- capital S, then name of song- name of artist */}
                       


                            <span className="station-title3-container">
                            <span className="station-title3-type">{station.type}</span>
                                <h1> {station.name} </h1>
                            </span>
                        </div>
                        <StationDetails_GeneralObjectMiniTitle miniStation={station}/>
                    </div>  
                </div>
            </div>
        </section>
    )
}