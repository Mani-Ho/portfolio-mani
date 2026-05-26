import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';

// ====================================================================
// Easter egg: console signature for devs who open DevTools
// ====================================================================
const sig = [
  '',
  '  __  __    _    _   _ ___',
  '  |  \\/  |  / \\  | \\ | |_ _|',
  "  | |\\/| | / _ \\ |  \\| || |",
  '  | |  | |/ ___ \\| |\\  || |',
  '  |_|  |_/_/   \\_\\_| \\_|___|',
  '',
  '  You opened the console — nice instinct.',
  '  → hello@mani.design',
  '  → github.com/mani-dev',
  '',
].join('\n');

const sigStyle = [
  'color: #5ec6f7',
  'font-family: ui-monospace, "JetBrains Mono", monospace',
  'font-size: 12px',
  'line-height: 1.5',
  'background: #06070a',
  'padding: 12px 16px',
  'border: 1px solid rgba(94,198,247,0.25)',
  'border-radius: 6px',
].join(';');

console.log(`%c${sig}`, sigStyle);

// ====================================================================

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
