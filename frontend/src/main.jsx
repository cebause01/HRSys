import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

console.log('TurHR: Initializing application...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('TurHR: Root element not found!');
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('TurHR: Application rendered');
}
