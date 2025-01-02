import Play from '../assets/svgs/play.svg?react'
import Pause from '../assets/svgs/pause.svg?react'
import Next from '../assets/svgs/next.svg?react'
import Prev from '../assets/svgs/prev.svg?react'

export function AudioControls ( { isPlaying, onPlayPauseClick, onPrevClick, onNextClick }){

    return (
        <section className="audio-controllers-audio-controls">
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
        </section>
    )
}