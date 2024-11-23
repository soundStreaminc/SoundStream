import React from 'react'
import ReactDOM from 'react-dom/client'
// import { HashRouter as Router } from 'react-router-dom'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import { RootCmp } from './RootCmp'
import './assets/styles/main.scss'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { LoginSignup } from './pages/LoginSignup'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <Provider store={ store }>
      <Router>
        <Routes>
          <Route path="/*" element={ <RootCmp />} />
          <Route path='/login' element={<LoginSignup />} />
        </Routes>      
      </Router>
    </Provider>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
//serviceWorkerRegistration.register()
