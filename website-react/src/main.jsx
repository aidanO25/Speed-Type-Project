console.log("🚀 main.jsx loaded");
import { AuthProvider } from "./context/authContext";
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'


// This enables client-side routing. without the navigation wouldn't work
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
)

