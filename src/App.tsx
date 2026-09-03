/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ActiveTab, TelemetryData } from './types';
import { ShaderBackground } from './components/ShaderBackground';
import { NavigationSidebar } from './components/NavigationSidebar';
import { TopHeader } from './components/TopHeader';
import { OnboardingView } from './components/views/OnboardingView';
import { DashboardView } from './components/views/DashboardView';
import { SatelliteMapView } from './components/views/SatelliteMapView';
import { MessagingView } from './components/views/MessagingView';
import { ProductivityView } from './components/views/ProductivityView';
import { EmergencyView } from './components/views/EmergencyView';
import { CallModal } from './components/modals/CallModal';
import { AiCopilotModal } from './components/modals/AiCopilotModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [activeCall, setActiveCall] = useState<'voice' | 'video' | null>(null);
  const [showAiCopilot, setShowAiCopilot] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Periodic Telemetry sync from server
  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('/api/telemetry');
        const data = await res.json();
        if (data.telemetry) {
          setTelemetry(data.telemetry);
        }
      } catch {}
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 15000);
    return () => clearInterval(interval);
  }, []);

  // Handle Satellite Switch Handshake
  const handleSelectSatellite = async (satId: string) => {
    try {
      const res = await fetch('/api/satellite/handshake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ satelliteId: satId }),
      });
      const data = await res.json();
      if (data.telemetry) {
        setTelemetry(data.telemetry);
        // Confetti celebration for successful quantum key lock
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#00dbe7', '#8f03ff', '#ffffff'],
        });
      }
    } catch {}
  };

  // Handle SOS activation
  const handleTriggerSos = async (payload: { emergencyType: string; notes?: string }) => {
    try {
      await fetch('/api/emergency/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'activate',
          coordinates: { lat: 45.9234, lng: -104.2812 },
          ...payload,
        }),
      });
      setEmergencyActive(true);
    } catch {
      setEmergencyActive(true);
    }
  };

  // Handle SOS cancellation
  const handleCancelSos = async () => {
    try {
      await fetch('/api/emergency/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' }),
      });
      setEmergencyActive(false);
    } catch {
      setEmergencyActive(false);
    }
  };

  // If user is on the onboarding screen
  if (activeTab === 'onboarding') {
    return (
      <OnboardingView
        onInitiateLink={() => {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00dbe7', '#8f03ff', '#ffffff'],
          });
          setActiveTab('dashboard');
        }}
        onExploreCoverage={() => setActiveTab('map')}
      />
    );
  }

  return (
    <div className={`relative min-h-screen w-full bg-[#05070A] text-[#dfe2f3] flex flex-col font-sans selection:bg-[#00f2ff] selection:text-black overflow-x-hidden ${
      emergencyActive ? 'ring-2 ring-[#ffb4ab] ring-inset' : ''
    }`}>
      {/* Dynamic Cosmic WebGL Shader Canvas Background */}
      <ShaderBackground
        className="fixed inset-0 w-full h-full pointer-events-none opacity-40 z-0"
        intensity={focusMode ? 1.5 : 0.9}
      />

      {/* Main Navigation Sidebar (Desktop drawer + Mobile bottom nav) */}
      <NavigationSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        telemetry={telemetry}
        unreadCount={unreadCount}
        emergencyActive={emergencyActive}
      />

      {/* Main Content Area (Offset by desktop sidebar width) */}
      <div className="flex-1 flex flex-col lg:pl-72 z-10 pb-20 lg:pb-8">
        {/* Sticky Top Header Bar */}
        <TopHeader
          telemetry={telemetry}
          focusMode={focusMode}
          onToggleFocus={() => setFocusMode(!focusMode)}
          onOpenCall={(type) => setActiveCall(type)}
          onOpenEmergency={() => setActiveTab('emergency')}
          onOpenAiAssist={() => setShowAiCopilot(true)}
          emergencyActive={emergencyActive}
        />

        {/* View Switcher */}
        <main className="flex-1 flex flex-col">
          {activeTab === 'dashboard' && (
            <DashboardView
              telemetry={telemetry}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenCall={(type) => setActiveCall(type)}
              onOpenEmergency={() => setActiveTab('emergency')}
            />
          )}

          {activeTab === 'map' && (
            <SatelliteMapView
              telemetry={telemetry}
              onSelectSatellite={handleSelectSatellite}
            />
          )}

          {activeTab === 'chat' && (
            <MessagingView onOpenCall={(type) => setActiveCall(type)} />
          )}

          {activeTab === 'tasks' && (
            <ProductivityView
              focusMode={focusMode}
              onToggleFocus={() => setFocusMode(!focusMode)}
              onOpenAiAssist={() => setShowAiCopilot(true)}
            />
          )}

          {activeTab === 'emergency' && (
            <EmergencyView
              telemetry={telemetry}
              emergencyActive={emergencyActive}
              onTriggerSos={handleTriggerSos}
              onCancelSos={handleCancelSos}
              onBack={() => setActiveTab('dashboard')}
            />
          )}
        </main>
      </div>

      {/* Interactive Voice / Video Call Modal */}
      {activeCall && (
        <CallModal
          type={activeCall}
          onClose={() => setActiveCall(null)}
          telemetry={telemetry}
        />
      )}

      {/* AI Mission Tactical Copilot Modal */}
      {showAiCopilot && (
        <AiCopilotModal
          onClose={() => setShowAiCopilot(false)}
          telemetry={telemetry}
        />
      )}
    </div>
  );
}
