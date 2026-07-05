import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ThemeProvider } from './hooks/useTheme.jsx';
import { setupInterceptors } from './services/setupInterceptors';
import App from './App.jsx';
import './index.css';

// Configure Axios interceptors once at startup
setupInterceptors();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
