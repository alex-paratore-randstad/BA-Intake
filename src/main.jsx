import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import { IntakeProvider } from './context/IntakeContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <IntakeProvider>
      <App />
    </IntakeProvider>
  </React.StrictMode>,
)
