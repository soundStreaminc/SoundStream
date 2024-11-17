


import React from 'react'
import { Routes, Route } from 'react-router'

import { HomePage } from './pages/HomePage'
import { PlaylistDetails } from './pages/PlaylistDetails'

import { AppHeader } from './cmps/AppHeader'
import { AppFooter } from './cmps/AppFooter'
import { RightSidebar } from './pages/RightSidebar'
// import { LeftSidebar } from './pages/LeftSidebar'
import { SideBar } from './cmps/SideBar'
import { StationFilter } from './pages/StationFilter'
import { TrackDetails } from './pages/TrackDetails'
import { StationFilterDetails } from './pages/StationFilterDetails'
import { Resizable } from './pages/Resizable'


export function RootCmp() {

    const tracks = [
        {
          title: "Love It When You Hate Me (feat. blackbear) - Acoustic",
          artist: "Avril Lavigne",
          audioSrc: "https://p.scdn.co/mp3-preview/ddabbe456fde1ab1bef88c8022056f7d26f2f5ba?cid=426b1061c8be4e70babeec62bbcf0f08",
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
                <Resizable/>                   
                {/* <RightSidebar /> */}
                <AppFooter tracks={ tracks  }/> 
        </div>
    )
}


