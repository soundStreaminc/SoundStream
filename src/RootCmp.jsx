import React from 'react'
import { Routes, Route } from 'react-router'

import { HomePage } from './pages/HomePage'
import { StationDetails } from './pages/StationDetails'

import { AppHeader } from './cmps/AppHeader'
import { AppFooter } from './cmps/AppFooter'
import { RightSidebar } from './pages/RightSidebar'
import { LeftSidebar } from './pages/LeftSidebar'

export function RootCmp() {

    return (
        <div className='app-container'>
                <AppHeader />
                <RightSidebar />
                <div data-testid="LayoutResizer__resize-bar" className="LayoutResizer__resize-bar LayoutResizer__inline-end"><label className="hidden-visually">Resize main navigation<input className="LayoutResizer__input" type="range" min="72" max="1021" step="10" /*value="420" */ /></label></div>
                    <Routes>
                        <Route path="" element={<HomePage />} />
                        <Route path="/:stationId" element={<StationDetails />} />
                    </Routes>
                
                <AppFooter /> 
                <LeftSidebar />        
        </div>
    )
}


