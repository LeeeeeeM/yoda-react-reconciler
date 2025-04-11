import { StrictMode } from 'react'
import { createRoot } from './customReactDOM';
import App from './App.tsx'

createRoot().render(
  <StrictMode>
    <App />
  </StrictMode>,
)
