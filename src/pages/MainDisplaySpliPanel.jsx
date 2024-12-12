import React, { useEffect, useRef, useState } from 'react'
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
import  PageYoutube  from './PageYoutube';

export function MainDisplaySpliPanel() {
  const COOKIE_KEY = "react-resizable-panels:layout";

  // Separate refs for each panel to track their mount state
  const isLeftPanelMounted = useRef(false);
  const isRightPanelMounted = useRef(false);

  // State to store layout and loading status
  const [layout, setLayout] = useState(null);
  
  const scrollableContainerRef = useRef(null);

  // Restore layout from cookie when the component mounts
  useEffect(() => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith(COOKIE_KEY))
      ?.split("=")[1];

    if (cookieValue) {
      try {
        const parsedLayout = JSON.parse(cookieValue);
        if (Array.isArray(parsedLayout)) {
          // Only set the layout from cookie if it's valid
          // console.log("Restored layout from cookie:", parsedLayout);
          setLayout(parsedLayout); // Use restored layout
          return; // Don't set defaultLayout if cookie is valid
        }
      } catch (e) {
        console.error("Failed to parse layout cookie:", e);
      }
    }
    //fallback
    setLayout([25, 75])

  }, []); // Empty dependency array to ensure this effect runs only once on mount


  // Save layout to cookies when it changes
  const saveLayout = (sizes, panelType) => {
    // Check if the panel has been mounted before saving the layout
    if (panelType === "left" && !isLeftPanelMounted.current) {
      isLeftPanelMounted.current = true; // Mark the left panel as mounted
      return; // Skip saving layout for left panel during initial mount
    }
    if (panelType === "right" && !isRightPanelMounted.current) {
      isRightPanelMounted.current = true; // Mark the right panel as mounted
      return; // Skip saving layout for right panel during initial mount
    }

    setLayout(sizes); // Update layout state
    document.cookie = `${COOKIE_KEY}=${JSON.stringify(sizes)}; path=/;`;
    // console.log("Layout saved:", sizes);
  };

  // Show a loading indicator until the layout is restored
  if (!layout) return 
  return (
    <div className="main-display-container" style={{ gridArea: "main-display", height: "80vh", display: "flex", flexDirection: "column" }}>
      <PanelGroup direction="horizontal">
        {/* Left Panel */}
        <Panel defaultSize={layout[0]} // Use restored layout
          minSize={20}
          onResize={(size) => {
            const newLayout = [size, 100 - size];
            saveLayout(newLayout, "left"); // Save layout on resize for left panel
          }}
        >
          <div style={{
            height: "100%",
            padding: "10px",
            overflow: "hidden" // No scroll bar here
          }}>
            <SideBar />
          </div>
        </Panel>

        {/* Resize Handle */}
        <PanelResizeHandle style={{ cursor: "col-resize", width: "6px" }} />

        <Panel defaultSize={layout[1]} // Use restored layout
          minSize={20}
          onResize={(size) => {
            const newLayout = [100 - size, size];
            saveLayout(newLayout, "right"); // Save layout on resize for right panel
          }}
        >
          <div  ref={scrollableContainerRef} style={{
            height: "100%",
            padding: "10px",
            overflowY: "auto" // Enable vertical scrolling here
          }}>
            <main className='main-page-container'>
              <Routes>
                <Route path="" element={<HomePage />} />
                <Route path='/search' element={<StationFilter />} />
                <Route path='/search/:filterText' element={<StationFilterDetails />} />
                <Route path="/playlist/:stationId" element={<PlaylistDetails scrollableContainerRef={scrollableContainerRef} />} />
                <Route path="/track/:trackId" element={<TrackDetails />} />
                <Route path="/album/:albumId" element={<AlbumDetails scrollableContainerRef={scrollableContainerRef} />} />
                <Route path="/artist/:artistId" element={<ArtistDetails />} />
                <Route path="/youtube" element={<PageYoutube />} />
              </Routes>
            </main>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}


