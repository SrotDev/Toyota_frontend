import React, { useState } from 'react';
import Layout from './components/Layout';
import HomePage from './components/home/HomePage';
import TrackList from './components/tracks/TrackList';
import TrackDetail from './components/tracks/TrackDetail';
import TelemetryDashboard from './components/telemetry/TelemetryDashboard';
import UploadPage from './components/upload/UploadPage';
import LapSummary from './components/tracks/LapSummary';
import SectorSummary from './components/tracks/SectorSummary';
import IdealTelemetry from './components/telemetry/IdealTelemetry';
import CompareTelemetry from './components/telemetry/CompareTelemetry';
import TelemetryHeatmap from './components/telemetry/TelemetryHeatmap';
import RacingLineOverlay from './components/telemetry/RacingLineOverlay';
import TurnTelemetry from './components/telemetry/TurnTelemetry';
import UploadResultPage from './components/upload/UploadResult';

const App: React.FC = () => {
  const [route, setRoute] = useState<string>(window.location.pathname === '/' ? '/' : window.location.pathname);

  const navigate = (path: string) => {
    setRoute(path);
    window.history.pushState({}, '', path);
  };

  React.useEffect(() => {
    const handlePop = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const renderRoute = () => {
    if (route === '/') return <HomePage navigate={navigate} />;
    if (route === '/tracks') return <TrackList navigate={navigate} />;
    if (route === '/upload') return <UploadPage navigate={navigate} />;
    if (route === '/upload/result') return <UploadResultPage />;

    const lapMatch = route.match(/^\/tracks\/([^/]+)\/laps$/);
    if (lapMatch) return <LapSummary trackId={lapMatch[1]} />;

    const sectorMatch = route.match(/^\/tracks\/([^/]+)\/sectors$/);
    if (sectorMatch) return <SectorSummary trackId={sectorMatch[1]} />;

    const telemetryDashboardMatch = route.match(/^\/tracks\/([^/]+)\/telemetry$/);
    if (telemetryDashboardMatch) return <TelemetryDashboard trackId={telemetryDashboardMatch[1]} navigate={navigate} />;

    const idealTelemetryMatch = route.match(/^\/tracks\/([^/]+)\/telemetry\/ideal$/);
    if (idealTelemetryMatch) return <IdealTelemetry trackId={idealTelemetryMatch[1]} />;

    const compareTelemetryMatch = route.match(/^\/tracks\/([^/]+)\/telemetry\/compare$/);
    if (compareTelemetryMatch) return <CompareTelemetry trackId={compareTelemetryMatch[1]} />;

    const heatmapMatch = route.match(/^\/tracks\/([^/]+)\/telemetry\/heatmap$/);
    if (heatmapMatch) return <TelemetryHeatmap trackId={heatmapMatch[1]} />;

    const racingLineMatch = route.match(/^\/tracks\/([^/]+)\/telemetry\/racing-line$/);
    if (racingLineMatch) return <RacingLineOverlay trackId={racingLineMatch[1]} />;

    const turnMatch = route.match(/^\/tracks\/([^/]+)\/telemetry\/turn\/([^/]+)$/);
    if (turnMatch) return <TurnTelemetry trackId={turnMatch[1]} turnId={turnMatch[2]} />;

    const trackMatch = route.match(/^\/tracks\/([^/]+)$/);
    if (trackMatch) return <TrackDetail trackId={trackMatch[1]} navigate={navigate} />;

    return <HomePage navigate={navigate} />;
  };

  return <Layout activeRoute={route} navigate={navigate}>{renderRoute()}</Layout>;
};

export default App;