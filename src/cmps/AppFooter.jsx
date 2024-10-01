import { Player } from "./Player";

export function AppFooter( {tracks }){

    return (
        <section className="footer-container">
            <Player tracks= {tracks } />
        </section>
    )
}