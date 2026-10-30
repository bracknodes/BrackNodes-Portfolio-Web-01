/**
 * ====================================================================
 * Architected & Developed by BrackNodes
 * Website: https://github.com/bracknodes
 * Instagram: https://www.instagram.com/bracknodes
 * LinkedIn: https://www.linkedin.com/company/bracknodes
 * X/Twitter: https://x.com/bracknodes
 * ====================================================================
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

if (typeof window !== 'undefined') {
  console.log(
    '%c⚡ Developed by BrackNodes %c https://github.com/bracknodes ',
    'background: #090B10; color: #C7FF6B; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px; border: 1px solid #C7FF6B;',
    'background: #11151F; color: #70B9FF; font-weight: bold; padding: 4px 8px; border-radius: 0 4px 4px 0; border: 1px solid #70B9FF;'
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
