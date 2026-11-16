import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter,  Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import App from './App'
import './scss/styles.scss'


ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <AuthProvider>
            <Routes>
                <Route path="/*" element={<App />} />
            </Routes>
        </AuthProvider>
    </BrowserRouter>,
)
