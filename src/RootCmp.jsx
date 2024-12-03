import React from 'react'
import { AppHeader } from './cmps/AppHeader'
import { MainDisplaySpliPanel } from './pages/MainDisplaySpliPanel'
import { Player } from "./cmps/Player"

export function RootCmp() {  
    const tracks = [
        {
          title: "Love It When You Hate Me (feat. blackbear) - Acoustic",
          artist: "Avril Lavigne",
          audioSrc: "https://www.youtube.com/watch?v=R4-be7fb140",
              image: "https://i.scdn.co/image/ab67616d0000b273ae6b206adcb3d283e9b327ca",
          color: "blue",
        },
        {
            title: "Waiting for the End",
            artist: "Linkin Park",
            audioSrc: "https://p.scdn.co/mp3-preview/1e52f7874a0864d96c106a5ee93970dcee66b05f?cid=426b1061c8be4e70babeec62bbcf0f08",
                image: "https://i.scdn.co/image/ab67616d0000b273163d1c5eddd35473f030f2d4",
            color: "green",
          }
      ];
      
    return (
        <div className='main-app'>
       
                <AppHeader />               
                <MainDisplaySpliPanel />                   
                {/* <RightSidebar /> */}
                <Player tracks= {tracks } />
        </div>
    )
}


