import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory state for Orbital Satellite System
let currentSatNode = {
  id: "orb-092",
  code: "ORB-092",
  name: "Orbital Constellation Node 092",
  orbitType: "LEO",
  altitudeKm: 408,
  velocityKmS: 7.66,
  elevationDeg: 68,
  azimuthDeg: 142,
  latencyMs: 24,
  bandwidthMbps: 450,
  downlinkMbps: 840,
  uplinkMbps: 120,
  signalBars: 4,
  status: "active",
  lat: 45.9234,
  lng: -104.2812,
  packetLossPercent: 0.01,
  batteryPercent: 98,
  globalCoveragePercent: 98.4,
};

let satellites = [
  {
    id: "orb-092",
    code: "ORB-092",
    name: "Orbital Alpha Node",
    orbitType: "LEO" as const,
    altitudeKm: 408,
    velocityKmS: 7.66,
    elevationDeg: 68,
    azimuthDeg: 142,
    latencyMs: 24,
    bandwidthMbps: 450,
    signalBars: 4,
    status: "active" as const,
    operationalStatus: "Nominal - Primary Beam Locked",
    payloadTempC: 21.4,
    solarArrayOutputW: 1420,
    batteryPercent: 98,
    snrDb: 28.4,
    frequencyGhz: 14.25,
    dopplerShiftKhz: +12.4,
    inclinationDeg: 51.6,
    beamFootprintKm: 850,
    lat: 45.9234,
    lng: -104.2812,
    mapX: 52,
    mapY: 46,
    orbitPathId: 1,
    orbitSpeed: 30,
    isCurrentNode: true,
  },
  {
    id: "orb-a1",
    code: "ORB-A1",
    name: "Orbital Polar Relay A1",
    orbitType: "LEO" as const,
    altitudeKm: 550,
    velocityKmS: 7.58,
    elevationDeg: 45,
    azimuthDeg: 38,
    latencyMs: 32,
    bandwidthMbps: 420,
    signalBars: 4,
    status: "active" as const,
    operationalStatus: "Nominal - High Inclination Track",
    payloadTempC: 19.8,
    solarArrayOutputW: 1380,
    batteryPercent: 94,
    snrDb: 26.1,
    frequencyGhz: 14.18,
    dopplerShiftKhz: -8.7,
    inclinationDeg: 97.4,
    beamFootprintKm: 980,
    lat: 52.1245,
    lng: -89.4321,
    mapX: 32,
    mapY: 30,
    orbitPathId: 2,
    orbitSpeed: 34,
    isCurrentNode: false,
  },
  {
    id: "orb-b7",
    code: "ORB-B7",
    name: "Orbital Equatorial Node B7",
    orbitType: "LEO" as const,
    altitudeKm: 620,
    velocityKmS: 7.52,
    elevationDeg: 22,
    azimuthDeg: 210,
    latencyMs: 48,
    bandwidthMbps: 280,
    signalBars: 2,
    status: "active" as const,
    operationalStatus: "Nominal - Low Horizon Ascent",
    payloadTempC: 24.2,
    solarArrayOutputW: 1510,
    batteryPercent: 91,
    snrDb: 18.6,
    frequencyGhz: 14.32,
    dopplerShiftKhz: +21.3,
    inclinationDeg: 28.5,
    beamFootprintKm: 1100,
    lat: 12.8712,
    lng: -45.1298,
    mapX: 72,
    mapY: 68,
    orbitPathId: 3,
    orbitSpeed: 28,
    isCurrentNode: false,
  },
  {
    id: "orb-sat-7",
    code: "ORB-SAT-7",
    name: "Orbital High-Gain Emergency Relay 7",
    orbitType: "MEO" as const,
    altitudeKm: 1200,
    velocityKmS: 6.94,
    elevationDeg: 42,
    azimuthDeg: 180,
    latencyMs: 38,
    bandwidthMbps: 350,
    signalBars: 3,
    status: "standby" as const,
    operationalStatus: "Standby - Emergency SAR Transponder Ready",
    payloadTempC: 17.6,
    solarArrayOutputW: 1650,
    batteryPercent: 99,
    snrDb: 22.8,
    frequencyGhz: 12.45,
    dopplerShiftKhz: +4.2,
    inclinationDeg: 55.0,
    beamFootprintKm: 1800,
    lat: 38.4412,
    lng: -112.5512,
    mapX: 24,
    mapY: 62,
    orbitPathId: 1,
    orbitSpeed: 45,
    isCurrentNode: false,
  },
  {
    id: "orb-g3",
    code: "ORB-G3",
    name: "Orbital Geo Synchronous 3",
    orbitType: "GEO" as const,
    altitudeKm: 35786,
    velocityKmS: 3.07,
    elevationDeg: 18,
    azimuthDeg: 165,
    latencyMs: 240,
    bandwidthMbps: 150,
    signalBars: 3,
    status: "active" as const,
    operationalStatus: "Nominal - Geostationary Constant Lock",
    payloadTempC: 15.3,
    solarArrayOutputW: 2800,
    batteryPercent: 100,
    snrDb: 16.5,
    frequencyGhz: 28.50,
    dopplerShiftKhz: 0.1,
    inclinationDeg: 0.0,
    beamFootprintKm: 6500,
    lat: 0.0,
    lng: -100.0,
    mapX: 84,
    mapY: 22,
    orbitPathId: 2,
    orbitSpeed: 90,
    isCurrentNode: false,
  }
];

interface ServerOperationTask {
  id: string;
  title: string;
  timeGmt: string;
  priority: 1 | 2 | 3;
  status: "pending" | "completed";
  assignedTo?: string;
  category?: "sensors" | "protocols" | "telemetry";
}

let operationTasks: ServerOperationTask[] = [
  {
    id: "task-1",
    title: "Calibrate Sensor Array Beta",
    timeGmt: "14:00 GMT",
    priority: 1,
    status: "pending",
    assignedTo: "Commander",
    category: "sensors",
  },
  {
    id: "task-2",
    title: "Update Command Protocol Scripts",
    timeGmt: "16:30 GMT",
    priority: 2,
    status: "pending",
    assignedTo: "Commander",
    category: "protocols",
  },
  {
    id: "task-3",
    title: "Review Telemetry Logs",
    timeGmt: "08:15 GMT",
    priority: 3,
    status: "completed",
    assignedTo: "Commander",
    category: "telemetry",
  },
];

let scratchpadNotes = "> Enter coordinate overrides here...\n# Target: 45.9234 N, 104.2812 W\n# Pass window: 14m 20s until zenith\n# Encryption: AES-256 Quantum Resistant Handshake";

let chatChannels = [
  {
    id: "alpha-team",
    name: "Alpha Team",
    avatar: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&auto=format&fit=crop&q=80",
    status: "online" as const,
    lastMessage: "Telemetry looks solid. Awaiting go for phase 2.",
    lastMessageTime: "NOW",
    unreadCount: 0,
    isSecure: true,
    type: "team" as const,
  },
  {
    id: "eng-chen",
    name: "Eng. Chen",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    status: "offline" as const,
    lastMessage: "Parts received at node 4.",
    lastMessageTime: "12h",
    unreadCount: 0,
    isSecure: true,
    type: "engineer" as const,
  },
  {
    id: "orbital-relay-7",
    name: "Orbital Relay 7",
    avatar: "",
    status: "syncing" as const,
    lastMessage: "Syncing logs with ground station...",
    lastMessageTime: "Sat",
    unreadCount: 0,
    isSecure: true,
    type: "relay" as const,
  },
];

let chatMessages: Record<string, any[]> = {
  "alpha-team": [
    {
      id: "msg-1",
      channelId: "alpha-team",
      sender: "Alpha Team",
      senderAvatar: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&auto=format&fit=crop&q=80",
      text: "Telemetry looks solid. Awaiting go for phase 2 initiation sequence.",
      timestamp: "2026-08-17T09:42:00Z",
      timeFormatted: "09:42 UTC",
      status: "received",
      type: "text",
      encrypted: true,
    },
    {
      id: "msg-2",
      channelId: "alpha-team",
      sender: "Commander",
      senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      text: "Copy that. Systems nominal on our end. Stand by for encrypted key exchange.",
      timestamp: "2026-08-17T09:44:00Z",
      timeFormatted: "09:44 UTC",
      status: "sent",
      type: "text",
      encrypted: true,
    },
    {
      id: "msg-3",
      channelId: "alpha-team",
      sender: "Alpha Team",
      senderAvatar: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&auto=format&fit=crop&q=80",
      text: "Audio briefing dispatch attached.",
      timestamp: "2026-08-17T09:47:00Z",
      timeFormatted: "09:47 UTC",
      status: "received",
      type: "audio",
      audioDuration: "0:14",
      audioWaveform: [30, 70, 45, 90, 55, 80, 40, 60, 85, 30],
      encrypted: true,
    },
    {
      id: "msg-4",
      channelId: "alpha-team",
      sender: "Commander",
      senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      text: "Proceeding with phase 2. Confirm receipt.",
      timestamp: "2026-08-17T09:50:00Z",
      timeFormatted: "Queued",
      status: "queued",
      type: "text",
      encrypted: true,
    },
  ],
};

let emergencySOS = {
  isActive: false,
  initiatedAt: null as string | null,
  frequencyMhz: 406.025,
  coordinates: {
    lat: "45.9234° N",
    lng: "104.2812° W",
  },
  uplinkTarget: {
    name: "ORB-SAT-7 (LOS)",
    elevation: 42,
    los: true,
  },
  statusText: "STANDBY - AWAITING INITIATION",
  isLowPowerMode: false,
};

// Lazy initialization of Gemini API
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genAIClient;
}

// =================== API ROUTES ===================

// Health Check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", node: currentSatNode.code, time: new Date().toISOString() });
});

// Telemetry
app.get("/api/telemetry", (_req: Request, res: Response) => {
  // Generate slightly dynamic telemetry readings for high-tech realism
  const randomJitter = (Math.random() - 0.5) * 2;
  const currentLatency = Math.max(16, Math.round(currentSatNode.latencyMs + randomJitter));
  const currentDownlink = Math.round(840 + (Math.random() - 0.5) * 30);
  const currentUplink = Math.round(120 + (Math.random() - 0.5) * 15);

  const history24h = [
    { hour: "00:00", valueGb: 2.4, throughputMbps: 380 },
    { hour: "04:00", valueGb: 4.1, throughputMbps: 420 },
    { hour: "08:00", valueGb: 3.6, throughputMbps: 390 },
    { hour: "12:00", valueGb: 7.8, throughputMbps: 680 },
    { hour: "16:00", valueGb: 4.2, throughputMbps: 450 },
    { hour: "20:00", valueGb: 9.9, throughputMbps: 840 },
    { hour: "NOW", valueGb: 10.0, throughputMbps: currentDownlink },
  ];

  const coreLoads = [
    { core: "CORE 1", loadPercent: 42 },
    { core: "CORE 2", loadPercent: 89 },
    { core: "CORE 3", loadPercent: 12 },
  ];

  res.json({
    currentNodeId: currentSatNode.id,
    nodeCode: currentSatNode.code,
    latencyMs: currentLatency,
    bandwidthMbps: currentSatNode.bandwidthMbps,
    downlinkMbps: currentDownlink,
    uplinkMbps: currentUplink,
    globalCoveragePercent: currentSatNode.globalCoveragePercent,
    altitudeKm: currentSatNode.altitudeKm,
    velocityKmS: currentSatNode.velocityKmS,
    packetLossPercent: currentSatNode.packetLossPercent,
    batteryPercent: currentSatNode.batteryPercent,
    history24h,
    coreLoads,
    visibleSatellites: satellites,
  });
});

// Satellites
app.get("/api/satellites", (_req: Request, res: Response) => {
  res.json({
    satellites,
    currentNode: currentSatNode,
  });
});

// Handshake / Switch Active Satellite
app.post("/api/satellites/handshake", (req: Request, res: Response) => {
  const { satelliteId } = req.body;
  const target = satellites.find((s) => s.id === satelliteId);
  if (target) {
    satellites = satellites.map((s) => ({
      ...s,
      isCurrentNode: s.id === satelliteId,
    }));
    currentSatNode = {
      ...currentSatNode,
      id: target.id,
      code: target.code,
      name: target.name,
      altitudeKm: target.altitudeKm,
      velocityKmS: target.velocityKmS,
      latencyMs: target.latencyMs,
      bandwidthMbps: target.bandwidthMbps,
    };
    return res.json({ success: true, activeNode: currentSatNode });
  }
  res.status(404).json({ error: "Satellite not found" });
});

// Operations & Tasks
app.get("/api/operations", (_req: Request, res: Response) => {
  res.json({
    tasks: operationTasks,
    scratchpad: scratchpadNotes,
    calendar: [
      { id: "cal-1", title: "Comms Relay Briefing", timeLabel: "IN 45 MINS", isUpcomingSoon: true },
      { id: "cal-2", title: "Maintenance Window", timeLabel: "TOMORROW", isUpcomingSoon: false },
      { id: "cal-3", title: "LEO Constellation Orbital Re-alignment", timeLabel: "IN 3 DAYS", isUpcomingSoon: false },
    ],
  });
});

app.post("/api/operations/tasks", (req: Request, res: Response) => {
  const { action, taskId, taskData } = req.body;
  if (action === "toggle") {
    operationTasks = operationTasks.map((t) =>
      t.id === taskId
        ? { ...t, status: t.status === "completed" ? "pending" : "completed" }
        : t
    );
    return res.json({ success: true, tasks: operationTasks });
  } else if (action === "create" && taskData) {
    const newTask = {
      id: `task-${Date.now()}`,
      title: taskData.title || "New Orbital Operation",
      timeGmt: taskData.timeGmt || "12:00 GMT",
      priority: taskData.priority || (2 as 1 | 2 | 3),
      status: "pending" as const,
      assignedTo: taskData.assignedTo || "Commander",
      category: taskData.category || ("telemetry" as const),
    };
    operationTasks.unshift(newTask);
    return res.json({ success: true, tasks: operationTasks, task: newTask });
  }
  res.status(400).json({ error: "Invalid task action" });
});

app.post("/api/operations/notes", (req: Request, res: Response) => {
  const { notes } = req.body;
  scratchpadNotes = notes ?? "";
  res.json({ success: true, scratchpad: scratchpadNotes });
});

// Comms & Chat
app.get("/api/comms/channels", (_req: Request, res: Response) => {
  res.json({ channels: chatChannels });
});

app.get("/api/comms/messages/:channelId", (req: Request, res: Response) => {
  const { channelId } = req.params;
  const messages = chatMessages[channelId] || [];
  res.json({ channelId, messages });
});

app.post("/api/comms/messages", (req: Request, res: Response) => {
  const { channelId, text, type, audioDuration, isOfflineQueue } = req.body;
  if (!channelId || (!text && type !== "audio")) {
    return res.status(400).json({ error: "Invalid message payload" });
  }

  const now = new Date();
  const timeFormatted = isOfflineQueue
    ? "Queued"
    : `${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")} UTC`;

  const newMessage = {
    id: `msg-${Date.now()}`,
    channelId,
    sender: "Commander",
    senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    text: text || (type === "audio" ? "Voice Transmission" : ""),
    timestamp: now.toISOString(),
    timeFormatted,
    status: isOfflineQueue ? "queued" : "sent",
    type: type || "text",
    audioDuration: audioDuration || "0:12",
    audioWaveform: [40, 60, 90, 75, 45, 80, 65, 95, 50, 70],
    encrypted: true,
  };

  if (!chatMessages[channelId]) {
    chatMessages[channelId] = [];
  }
  chatMessages[channelId].push(newMessage);

  // Update last message in channel list
  chatChannels = chatChannels.map((c) =>
    c.id === channelId
      ? { ...c, lastMessage: newMessage.text, lastMessageTime: "NOW" }
      : c
  );

  res.json({ success: true, message: newMessage });
});

// Flush/Sync queued messages
app.post("/api/comms/sync-queue", (req: Request, res: Response) => {
  const { channelId } = req.body;
  if (channelId && chatMessages[channelId]) {
    const now = new Date();
    const timeFormatted = `${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")} UTC`;
    chatMessages[channelId] = chatMessages[channelId].map((m) =>
      m.status === "queued" ? { ...m, status: "sent", timeFormatted } : m
    );
  }
  res.json({ success: true, messages: chatMessages[channelId] || [] });
});

// Emergency SOS
app.get("/api/emergency/status", (_req: Request, res: Response) => {
  res.json({ emergencySOS });
});

app.post("/api/emergency/sos", (req: Request, res: Response) => {
  const { action, isLowPowerMode } = req.body;
  if (action === "broadcast") {
    emergencySOS = {
      ...emergencySOS,
      isActive: true,
      initiatedAt: new Date().toISOString(),
      statusText: "EMERGENCY BEACON ACTIVE - BROADCASTING ON 406.025 MHz",
    };
  } else if (action === "cancel") {
    emergencySOS = {
      ...emergencySOS,
      isActive: false,
      initiatedAt: null,
      statusText: "STANDBY - AWAITING INITIATION",
    };
  }
  if (typeof isLowPowerMode === "boolean") {
    emergencySOS.isLowPowerMode = isLowPowerMode;
  }
  res.json({ success: true, emergencySOS });
});

// AI Mission Copilot (Gemini Integration)
app.post("/api/ai/orbital-assist", async (req: Request, res: Response) => {
  const { prompt, context } = req.body;
  try {
    const ai = getGenAI();
    if (!ai) {
      // Return high-fidelity automated tactical analysis if key is not yet set
      return res.json({
        response: `[ORBITAL TELEMETRY COPILOT]\nAnalysis for query: "${prompt || 'Status Request'}"\n• Active Node: ${currentSatNode.code} (LEO 408km, 7.66km/s)\n• Ground Handshake: Optimal, latency 24ms, packet loss <0.01%\n• Signal Recommendation: High SNR (Signal-to-Noise Ratio). Constellation pass window open for next 32 minutes.\n• Tactical Note: Sensor array calibration recommended before 14:00 GMT window.`,
      });
    }

    const systemInstruction = `You are ORBITAL AI, the tactical satellite telemetry and operations intelligence copilot for aerospace commander.
You provide crisp, precise, technical mission briefings regarding orbital mechanics, communication bandwidth, satellite constellations, telemetry diagnostics, emergency routing, and remote operations.
Keep responses authoritative, concise, data-rich, and formatting in high-tech clean markdown.`;

    const modelResponse = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Context: Active Satellite=${currentSatNode.code}, Latency=${currentSatNode.latencyMs}ms, Bandwidth=${currentSatNode.bandwidthMbps}Mbps, Location=${currentSatNode.lat}N, ${currentSatNode.lng}W.\n\nUser Request: ${prompt}`,
            },
          ],
        },
      ],
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    res.json({ response: modelResponse.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "Unable to process orbital AI query",
      fallback: `[ORBITAL SUBSYSTEM FALLBACK]\nNode ${currentSatNode.code} telemetry nominal. Latency: ${currentSatNode.latencyMs}ms. All 42 ground stations synchronized.`,
    });
  }
});

// Vite Middleware & Static handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Orbital Satellite Backend running on port ${PORT}`);
  });
}

startServer();
