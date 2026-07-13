import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // 严格模式
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
