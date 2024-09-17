import React from 'react'
import { Routes, Route } from 'react-router'

import { HomePage } from './pages/HomePage'
import { StationDetails } from './pages/StationDetails'

//import { AppHeader } from '../cmps/AppHeader'

export function RootCmp() {
    return (
        <div>
            {/* <AppHeader /> */}
            <main>
                <Routes>
                    <Route path="" element={<HomePage />} />
                    <Route path="/:stationId" element={<StationDetails />} />
                </Routes>
            </main>
           
        </div>
    )
}


