import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import { Toast } from "./components/Toast";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { AuthPages } from "./pages/AuthPages";
import { ProfileSetup } from "./pages/ProfileSetup";
import { Dashboard } from "./pages/Dashboard";
import { ClassSelection } from "./pages/ClassSelection";
import { ChapterSelection } from "./pages/ChapterSelection";
import { Gameplay } from "./pages/Gameplay";
import { Results } from "./pages/Results";
import { ProgressDashboard } from "./pages/ProgressDashboard";
import { Leaderboard } from "./pages/Leaderboard";
import { Profile } from "./pages/Profile";
import { AdminDashboard } from "./pages/AdminDashboard";

// Layout
import { RootLayout } from "./layouts/RootLayout";

function App() {
  return (
    <GameProvider>
      <HashRouter>
        <Routes>
          {/* Fullscreen / Presentation Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPages />} />
          <Route path="/setup" element={<ProfileSetup />} />
          <Route path="/game" element={<Gameplay />} />
          <Route path="/results" element={<Results />} />

          {/* Protected Navigation Pages with Shell Wrapper */}
          <Route element={<RootLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/class-select" element={<ClassSelection />} />
            <Route path="/chapters" element={<ChapterSelection />} />
            <Route path="/progress" element={<ProgressDashboard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Notification Panel Overlay */}
        <Toast />
      </HashRouter>
    </GameProvider>
  );
}

export default App;
