import React from 'react'
import { Routes, Route } from 'react-router'

import { HomePage } from './pages/HomePage'
import { StationDetails } from './pages/StationDetails'

import { AppHeader } from './cmps/AppHeader'
import { AppFooter } from './cmps/AppFooter'
import { SideBar } from './cmps/SideBar'

export function RootCmp() {
    return (
        <div className='app-container'>

                <AppHeader />
                <div className="main-content-container">
                <SideBar/>
                <main>
                    <Routes>
                        <Route path="" element={<HomePage />} />
                        <Route path="/:stationId" element={<StationDetails />} />
                    </Routes>
                </main>
                </div>
                <AppFooter />

            
        </div>
    )
}



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
        <div className='main-app'>
                <AppHeader />
                <LeftSidebar />        
                <main className='container'>
                    <Routes>
                            <Route path="" element={<HomePage />} />
                            <Route path="/:stationId" element={<StationDetails />} />
                    </Routes>
                </main>
                <RightSidebar />
                <AppFooter /> 
        </div>
    )
}


