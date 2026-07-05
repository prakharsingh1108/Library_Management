import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import router from './routes';
import AuthInitializer from './components/AuthInitializer';
import useTheme from './hooks/useTheme.jsx';

const AppContent = () => {
  const { isDark } = useTheme();

  return (
    <>
      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#f1f5f9' : '#1e293b',
            border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#6366f1', secondary: '#ffffff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
          },
        }}
      />
    </>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;
