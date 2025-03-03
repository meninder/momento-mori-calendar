
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("main.tsx executing");
const rootElement = document.getElementById("root");
console.log("Root element:", rootElement);

if (rootElement) {
  console.log("Creating React root");
  createRoot(rootElement).render(<App />);
} else {
  console.error("Root element not found! Check your HTML file.");
}
