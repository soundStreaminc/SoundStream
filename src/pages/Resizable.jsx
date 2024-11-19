import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Routes, Route } from 'react-router'

import { PlaylistDetails } from './PlaylistDetails'
import { HomePage } from "./HomePage";
import { StationFilter } from "./StationFilter";
import { StationFilterDetails } from "./StationFilterDetails";
import { TrackDetails } from "./TrackDetails";
import { SideBar } from "../cmps/SideBar";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { AlbumDetails } from "./AlbumDetails";
import { ArtistDetails } from "./ArtistDetails";

export function Resizable(){
    return (
        // className="main-resize-container"
        <PanelGroup autoSaveId="example" direction="horizontal" className="main-resize-container">  
        <Panel className="flex h-full items-center bg-pink-100 p-6">
            <SideBar /> 
                   
        </Panel>
        <PanelResizeHandle className="flex w-4 items-center justify-center bg-white">
            <div className="resize-handler">
                <DragHandleDots2Icon></DragHandleDots2Icon>
            </div>
        </PanelResizeHandle>

        <Panel className="flex h-full items-center bg-pink-100 p-6" id="main-page-id">
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
        </Panel>
        </PanelGroup>
    )
}
