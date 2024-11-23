


import React from 'react'
import { SideBar } from '../cmps/SideBar'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { Route, Routes } from 'react-router';
import { HomePage } from './HomePage';
import { StationFilter } from './StationFilter';
import { StationFilterDetails } from './StationFilterDetails';
import { PlaylistDetails } from './PlaylistDetails';
import { TrackDetails } from './TrackDetails';
import { AlbumDetails } from './AlbumDetails';
import { ArtistDetails } from './ArtistDetails';


export function MainDisplaySpliPanel() {  
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
        <div className="main-display-container" style={{ gridArea: "main-display", height: "80vh", display: "flex", flexDirection: "column" }}>
      <PanelGroup direction="horizontal">
        {/* Left Panel */}
        <Panel defaultSize={50} minSize={20}>
          <div style={{ 
            height: "100%", 
            padding: "10px", 
            overflow: "hidden" // No scroll bar here 
          }}>
            <SideBar />
          </div>
        </Panel>

        {/* Resize Handle */}
        <PanelResizeHandle style={{  cursor: "col-resize", width: "6px" }} />

        <Panel minSize={20}>
          <div style={{ 
            height: "100%", 
            padding: "10px", 
            overflowY: "auto" // Enable vertical scrolling here
          }}>
              <main className='main-page-container'>
                        <Routes>
                                <Route path="" element={<HomePage />} />
                                <Route path='/search' element={<StationFilter />} />
                                <Route path='/search/:filterText' element={<StationFilterDetails />} />
                                <Route path="/playlist/:stationId" element={<PlaylistDetails />} />
                                <Route path="/track/:trackId" element={<TrackDetails />} />
                                <Route path="/album/:albumId" element={<AlbumDetails />} />
                                <Route path="/artist/:artistId" element={<ArtistDetails />} />
                        </Routes>
                    </main>
          </div>
        </Panel>
      </PanelGroup>
      </div>
    )
}


