import Play from '../assets/svgs/play.svg?react'
import Pause from '../assets/svgs/pause.svg?react'
import Next from '../assets/svgs/next.svg?react'
import Prev from '../assets/svgs/prev.svg?react'

export function AudioControls ( { isPlaying, onPlayPauseClick, onPrevClick, onNextClick }){

    return (
        <section className="audio-controls">
            <button type="button" aria-label="Previous" className="prev playerButton2" onClick={onPrevClick}>
           
                <Prev className="action-btn2" />
                    
            </button>
            {!isPlaying ? (
            <button type="button" aria-label="Play" className="play playerButton" onClick={() => onPlayPauseClick(false)}>
                <span aria-hidden="true" className="iconWrapper">
                        
                    <Play className="action-btn" />
                </span>
            </button>
            ) : (
            <button type="button" aria-label="Pause" className="pause playerButton" onClick={() => onPlayPauseClick(true)}>
                <Pause className="action-btn" />
            </button>
            )}
            <button type="button" aria-label="Next" className="next playerButton2" onClick={onNextClick}>
                <Next className="action-btn2" />
            </button>
        </section>
    )
}