import React from 'react'
import { AppHeader } from './cmps/AppHeader'
import { MainDisplaySpliPanel } from './pages/MainDisplaySpliPanel'
import { Appfooter } from './pages/AppFooter';
import { MobileFilter } from './cmps/MobileFilter';

export function RootCmp() {  

    return (
        <div className='main-app'>
                <MobileFilter />
                <AppHeader />               
                <MainDisplaySpliPanel />                   
                {/* <RightSidebar /> */}
                {/* <Player tracks= {tracks } /> */}
                <Appfooter />
        </div>
    )
}


