import Play from '../assets/svgs/play.svg?react'
import Pause from '../assets/svgs/pause.svg?react'
import Next from '../assets/svgs/next.svg?react'
import Prev from '../assets/svgs/prev.svg?react'

export function AudioControls ( { isPlaying, onPlayPauseClick, onPrevClick, onNextClick }){

    return (
        <section className="audio-controls">
            <button type="button" aria-label="Previous" className="prev playerButton" onClick={onPrevClick}>
           
                <Prev className="action-btn" />
                    
            </button>
            {!isPlaying ? (
            <button type="button" aria-label="Previous" className="play playerButton" onClick={() => onPlayPauseClick(false)}>
                <span aria-hidden="true" className="iconWrapper">
                        
                    <Play className="action-btn" />
                </span>
            </button>
            ) : (
            <button type="button" aria-label="Previous" className="pause playerButton" onClick={() => onPlayPauseClick(true)}>
                <Pause className="action-btn" />
            </button>
            )}
            <button type="button" aria-label="Previous" className="next playerButton" onClick={onNextClick}>
                <Next className="action-btn" />
            </button>
        </section>
    )
}