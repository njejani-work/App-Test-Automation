// Start: fonts and theme, then the page. The data files are loaded by the page itself (data/load.js).
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './fonts.js';
import './styles.css';
import { App } from './app/App.jsx';

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
