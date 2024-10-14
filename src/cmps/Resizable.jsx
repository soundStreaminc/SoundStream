import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Routes, Route } from 'react-router'

import { StationDetails } from '../pages/StationDetails'
import { HomePage } from "../pages/HomePage";
import { StationFilter } from "../pages/StationFilter";
import { StationFilterDetails } from "../pages/StationFilterDetails";
import { TrackDetails } from "../pages/TrackDetails";
import { SideBar } from "./SideBar";

export function Resizable(){
    return (
        // className="main-resize-container"
        <PanelGroup autoSaveId="example" direction="horizontal" >  
        <Panel defaultSizePercentage={25}>
            <SideBar /> 
                   
        </Panel>
        <PanelResizeHandle className="flex w-4 items-center justify-center bg-white"/>

        <Panel defaultSizePercentage={25}>
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
