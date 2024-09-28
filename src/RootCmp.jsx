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


