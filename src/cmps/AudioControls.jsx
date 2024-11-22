import Play from '../assets/svgs/play.svg?react'
import Pause from '../assets/svgs/pause.svg?react'
import Next from '../assets/svgs/next.svg?react'
import Prev from '../assets/svgs/prev.svg?react'

export function AudioControls ( { isPlaying, onPlayPauseClick, onPrevClick, onNextClick }){

    return (
        <section className="audio-controllers-audio-controls">
            <button type="button" aria-label="Previous" className="prev audio-controllers-playerButton2" onClick={onPrevClick}>
           
                <Prev className="audio-controllers-action-btn2" />
                    
            </button>
            {!isPlaying ? (
            <button type="button" aria-label="Play" className="play audio-controllers-playerButton" onClick={() => onPlayPauseClick(false)}>
                <span aria-hidden="true" className="audio-controllers-icon-wrapper">
                        
                    <Play className="audio-controllers-action-btn" />
                </span>
            </button>
            ) : (
            <button type="button" aria-label="Pause" className="pause audio-controllers-playerButton" onClick={() => onPlayPauseClick(true)}>
                <Pause className="audio-controllers-action-btn" />
            </button>
            )}
            <button type="button" aria-label="Next" className="next audio-controllers-playerButton2" onClick={onNextClick}>
                <Next className="audio-controllers-action-btn2" />
            </button>
        </section>
    )
}