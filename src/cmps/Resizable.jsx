import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Routes, Route } from 'react-router'

import { StationDetails } from '../pages/StationDetails'
import { HomePage } from "../pages/HomePage";
import { StationFilter } from "../pages/StationFilter";
import { StationFilterDetails } from "../pages/StationFilterDetails";
import { TrackDetails } from "../pages/TrackDetails";
import { SideBar } from "./SideBar";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";

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

        <Panel className="flex h-full items-center bg-pink-100 p-6">
                    <main className='container'>
                        <Routes>
                                <Route path="" element={<HomePage />} />
                                <Route path='/search' element={<StationFilter />} />
                                <Route path='/search/:filterText' element={<StationFilterDetails />} />
                                <Route path="/playlist/:stationId" element={<StationDetails />} />
                                <Route path="/track/:trackId" element={<TrackDetails />} />
                        </Routes>
                    </main>
        </Panel>
        </PanelGroup>
    )
}
