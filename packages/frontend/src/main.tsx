import { createRoot } from 'react-dom/client'
import { Provider } from './api/provider'
import App from './App.tsx'

const container = document.getElementById('root')
const root = createRoot(container as Element)
root.render(
    <Provider>
        <App />
    </Provider>
)