export interface Satellite {
  id: string;
  code: string;
  name: string;
  orbitType: 'LEO' | 'MEO' | 'GEO';
  altitudeKm: number;
  velocityKmS: number;
  elevationDeg: number;
  azimuthDeg: number;
  latencyMs: number;
  bandwidthMbps: number;
  signalBars: number; // 1 to 4
  status: 'active' | 'standby' | 'repositioning';
  operationalStatus?: string;
  payloadTempC?: number;
  solarArrayOutputW?: number;
  batteryPercent?: number;
  snrDb?: number;
  frequencyGhz?: number;
  dopplerShiftKhz?: number;
  inclinationDeg?: number;
  beamFootprintKm?: number;
  lat: number;
  lng: number;
  mapX?: number; // relative SVG percentage (0-100) or pixel
  mapY?: number; // relative SVG percentage (0-100) or pixel
  orbitPathId?: number;
  orbitSpeed?: number;
  isCurrentNode?: boolean;
}

export interface TelemetryData {
  currentNodeId: string;
  nodeCode: string;
  latencyMs: number;
  bandwidthMbps: number;
  downlinkMbps: number;
  uplinkMbps: number;
  globalCoveragePercent: number;
  altitudeKm: number;
  velocityKmS: number;
  packetLossPercent: number;
  batteryPercent: number;
  history24h: { hour: string; valueGb: number; throughputMbps: number }[];
  coreLoads: { core: string; loadPercent: number }[];
  visibleSatellites: Satellite[];
}

export interface OperationTask {
  id: string;
  title: string;
  timeGmt: string;
  priority: 1 | 2 | 3;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo?: string;
  category?: 'sensors' | 'protocols' | 'telemetry' | 'hardware';
}

export interface CalendarEvent {
  id: string;
  title: string;
  timeLabel: string;
  isUpcomingSoon: boolean;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  sender: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  timeFormatted: string;
  status: 'sent' | 'received' | 'queued';
  type: 'text' | 'audio' | 'system';
  audioDuration?: string;
  audioWaveform?: number[];
  encrypted: boolean;
}

export interface ChatChannel {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'syncing';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number;
  isSecure: boolean;
  type: 'team' | 'engineer' | 'relay';
}

export interface CallSessionState {
  isOpen: boolean;
  type: 'voice' | 'video';
  calleeName: string;
  calleeTitle: string;
  calleeAvatar: string;
  station: string;
  durationSeconds: number;
  isMuted: boolean;
  isVideoOn: boolean;
  isScreenSharing: boolean;
  isWeakSignalMode: boolean;
  latencyMs: number;
  packetLossPercent: number;
}

export interface EmergencySOSState {
  isActive: boolean;
  initiatedAt: string | null;
  frequencyMhz: number;
  coordinates: {
    lat: string;
    lng: string;
  };
  uplinkTarget: {
    name: string;
    elevation: number;
    los: boolean;
  };
  statusText: string;
  isLowPowerMode: boolean;
}

export type ActiveTab = 'home' | 'map' | 'chat' | 'tasks' | 'emergency' | 'call';
