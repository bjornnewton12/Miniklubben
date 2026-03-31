import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import './index.css'

// Css files
import './styles/avatars.css'
import './styles/buttons.css'
import './styles/cards.css'
import './styles/forms.css'
import './styles/layout.css'
import './styles/players.css'
import './styles/numberPad.css'
import './styles/scorecard.css'
import './styles/summary.css'
import './styles/typography.css'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
