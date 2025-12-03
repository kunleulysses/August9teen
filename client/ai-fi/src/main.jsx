import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('main.jsx: starting render');
try {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    console.log('main.jsx: root created', root);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    );
    console.log('main.jsx: render called');
} catch (e) {
    console.error('main.jsx: render failed', e);
}
