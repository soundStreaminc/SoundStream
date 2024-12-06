import React from 'react'
import { AppHeader } from './cmps/AppHeader'
import { MainDisplaySpliPanel } from './pages/MainDisplaySpliPanel'
import { Appfooter } from './pages/AppFooter';

export function RootCmp() {  

    return (
        <div className='main-app'>
       
                <AppHeader />               
                <MainDisplaySpliPanel />                   
                {/* <RightSidebar /> */}
                {/* <Player tracks= {tracks } /> */}
                <Appfooter />
        </div>
    )
}


