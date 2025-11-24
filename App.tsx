
import React, { useState } from 'react';
import Layout from './components/Layout';
import HomePage from './components/home/HomePage';
import TrackList from './components/tracks/TrackList';
import TrackDetail from './components/tracks/TrackDetail';
import TelemetryDashboard from './components/telemetry/TelemetryDashboard';
import UploadPage from './components/upload/UploadPage';

const App: React.FC = () => {
  // Simple Router Implementation
  const [route, setRoute] = useState<string>(window.location.pathname === '/' ? '/' : window.location.pathname);
  
  // Fake "Navigate" function to simulate MPA routing without reload
  const navigate = (path: string) => {
      setRoute(path);
      window.history.pushState({}, '', path);
  };

  // Handle browser back button
  React.useEffect(() => {
      const handlePop = () => setRoute(window.location.pathname);
      window.addEventListener('popstate', handlePop);
      return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const renderRoute = () => {
      if (route === '/') return <HomePage navigate={navigate} />;
      if (route === '/tracks') return <TrackList navigate={navigate} />;
      if (route === '/upload') return <UploadPage navigate={navigate} />;
      
      // Dynamic Routes matchers
      const trackMatch = route.match(/^\/tracks\/([a-zA-Z0-9-]+)$/);
      if (trackMatch) return <TrackDetail trackId={trackMatch[1]} navigate={navigate} />;

      const telemetryMatch = route.match(/^\/tracks\/([a-zA-Z0-9-]+)\/telemetry$/);
      if (telemetryMatch) return <TelemetryDashboard trackId={telemetryMatch[1]} navigate={navigate} />;

      // Fallback
      return <HomePage navigate={navigate} />;
  };

  return (
    <Layout activeRoute={route} navigate={navigate}>
        {renderRoute()}
    </Layout>
  );
};

export default App;
