import './assets/main.css'
import { ThemeProvider } from "@/components/theme-provider"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ThemeProvider>
)
