import { useState, useEffect, useRef } from 'react';
import { ChatMessage, ChatChannel } from '../../types';
import {
  Send,
  Mic,
  Plus,
  Lock,
  PhoneCall,
  Info,
  Play,
  Pause,
  Satellite as SatIcon,
  Clock,
  CheckCheck,
  Search,
  ArrowLeft,
  Square,
} from 'lucide-react';

interface Props {
  onOpenCall: (type: 'voice' | 'video') => void;
}

export function MessagingView({ onOpenCall }: Props) {
  const [channels, setChannels] = useState<ChatChannel[]>([
    {
      id: 'alpha-team',
      name: 'Alpha Team',
      avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&auto=format&fit=crop&q=80',
      status: 'online',
      lastMessage: 'Telemetry looks solid. Awaiting go.',
      lastMessageTime: 'NOW',
      unreadCount: 0,
      isSecure: true,
      type: 'team',
    },
    {
      id: 'eng-chen',
      name: 'Eng. Chen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'offline',
      lastMessage: 'Parts received at node 4.',
      lastMessageTime: '12h',
      unreadCount: 0,
      isSecure: true,
      type: 'engineer',
    },
    {
      id: 'orbital-relay-7',
      name: 'Orbital Relay 7',
      avatar: '',
      status: 'syncing',
      lastMessage: 'Syncing logs with ground station...',
      lastMessageTime: 'Sat',
      unreadCount: 0,
      isSecure: true,
      type: 'relay',
    },
  ]);

  const [activeChannelId, setActiveChannelId] = useState('alpha-team');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch channel messages
  const fetchMessages = async (cId: string) => {
    try {
      const res = await fetch(`/api/comms/messages/${cId}`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch {}
  };

  useEffect(() => {
    fetchMessages(activeChannelId);
  }, [activeChannelId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Audio recording timer simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => setRecordSeconds((s) => s + 1), 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const handleSendMessage = async () => {
    if (!inputText.trim() && !isRecording) return;

    const payload = {
      channelId: activeChannelId,
      text: inputText,
      type: 'text',
      isOfflineQueue: isSimulatedOffline,
    };

    try {
      const res = await fetch('/api/comms/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
      setInputText('');
    } catch {
      const now = new Date();
      const localMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        channelId: activeChannelId,
        sender: 'Commander',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: inputText,
        timestamp: now.toISOString(),
        timeFormatted: isSimulatedOffline ? 'Queued' : `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')} UTC`,
        status: isSimulatedOffline ? 'queued' : 'sent',
        type: 'text',
        encrypted: true,
      };
      setMessages((prev) => [...prev, localMsg]);
      setInputText('');
    }
  };

  const handleSendVoiceNote = async () => {
    setIsRecording(false);
    const payload = {
      channelId: activeChannelId,
      text: 'Voice Transmission',
      type: 'audio',
      audioDuration: `0:${String(Math.max(4, recordSeconds)).padStart(2, '0')}`,
      isOfflineQueue: isSimulatedOffline,
    };

    try {
      const res = await fetch('/api/comms/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch {}
  };

  const handleSyncQueued = async () => {
    setIsSimulatedOffline(false);
    try {
      const res = await fetch('/api/comms/sync-queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId: activeChannelId }),
      });
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch {}
  };

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden bg-[#05070A] text-[#dfe2f3]">
      {/* Channels Sidebar (Desktop & Tablet) */}
      <aside className="w-full md:w-80 lg:w-96 border-r border-white/5 flex flex-col bg-[#0a0e1a]/60 backdrop-blur-xl h-full overflow-y-auto">
        <div className="p-4 border-b border-white/5 sticky top-0 bg-[#0a0e1a]/90 backdrop-blur-md z-10">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#849495]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search COMMS & Channels..."
              className="w-full bg-[#1b1f2c] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-[#e1fdff] focus:border-[#00f2ff] outline-none"
            />
          </div>

          {/* Offline / Online toggle simulation switch */}
          <div className="mt-3 flex justify-between items-center text-xs font-mono text-[#b9cacb] bg-white/5 p-2 rounded-xl border border-white/5">
            <span>Simulate Sat Outage</span>
            <button
              onClick={() => {
                if (isSimulatedOffline) {
                  handleSyncQueued();
                } else {
                  setIsSimulatedOffline(true);
                }
              }}
              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all ${
                isSimulatedOffline
                  ? 'bg-[#8f03ff] text-white'
                  : 'bg-white/10 text-[#00f2ff] hover:bg-white/20'
              }`}
            >
              {isSimulatedOffline ? 'OUTAGE ACTIVE (QUEUE)' : 'LEO CONNECTED'}
            </button>
          </div>
        </div>

        {/* Channels List */}
        <div className="flex-1 flex flex-col gap-1.5 p-3">
          {channels.map((channel) => {
            const isActive = activeChannelId === channel.id;
            return (
              <button
                key={channel.id}
                onClick={() => setActiveChannelId(channel.id)}
                className={`w-full flex items-center gap-3.5 p-3 rounded-2xl transition-all text-left cursor-pointer border ${
                  isActive
                    ? 'bg-[#00f2ff]/10 border-[#00f2ff]/30 shadow-[inset_0_0_15px_rgba(0,219,231,0.1)]'
                    : 'bg-transparent border-transparent hover:bg-white/5'
                }`}
              >
                <div className="relative">
                  {channel.avatar ? (
                    <img
                      src={channel.avatar}
                      alt={channel.name}
                      className="w-12 h-12 rounded-full object-cover border border-[#00dbe7]/40"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#8f03ff]/20 border border-[#8f03ff]/40 flex items-center justify-center text-[#dab9ff]">
                      <SatIcon className="w-5 h-5" />
                    </div>
                  )}
                  {channel.status === 'online' && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#00f2ff] rounded-full border-2 border-[#0a0e1a] pulse-indicator"></span>
                  )}
                  {channel.status === 'syncing' && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#8f03ff] rounded-full border-2 border-[#0a0e1a] animate-pulse"></span>
                  )}
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4
                      className={`text-sm font-bold truncate ${
                        isActive ? 'text-[#00dbe7]' : 'text-[#e1fdff]'
                      }`}
                    >
                      {channel.name}
                    </h4>
                    <span className="text-[10px] font-mono text-[#849495]">{channel.lastMessageTime}</span>
                  </div>
                  <p className="text-xs text-[#b9cacb] truncate">{channel.lastMessage}</p>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Chat Stream Section */}
      <section className="flex-1 flex flex-col h-full relative">
        {/* Chat Stream Header */}
        <div className="glass-panel px-6 py-3.5 flex justify-between items-center border-b border-white/5 z-10">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              {activeChannel.avatar ? (
                <img
                  src={activeChannel.avatar}
                  alt={activeChannel.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#00dbe7]/60"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#8f03ff]/20 flex items-center justify-center text-[#dab9ff]">
                  <SatIcon className="w-5 h-5" />
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00f2ff] rounded-full border-2 border-[#0f131f]"></span>
            </div>

            <div>
              <h3 className="font-bold text-base text-[#e1fdff] tracking-wide flex items-center gap-2">
                <span>{activeChannel.name}</span>
                <span className="text-[10px] font-mono text-[#00f2ff] bg-[#00f2ff]/10 px-2 py-0.5 rounded">
                  CHANNEL 01
                </span>
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-mono text-[#00dbe7]">SECURE LINK ACTIVE</span>
                <Lock className="w-3 h-3 text-[#00f2ff]" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenCall('voice')}
              className="p-2.5 rounded-full hover:bg-white/10 text-[#00dbe7] transition-all cursor-pointer"
              title="Voice Call Alpha Team"
            >
              <PhoneCall className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenCall('video')}
              className="p-2.5 rounded-full hover:bg-white/10 text-[#00dbe7] transition-all cursor-pointer"
              title="Video Call Alpha Team"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Thread Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 flex flex-col">
          {/* Timestamp Header */}
          <div className="flex justify-center my-2">
            <div className="bg-[#1b1f2c]/70 border border-white/5 rounded-full px-4 py-1 backdrop-blur-md">
              <span className="font-mono text-xs text-[#849495]">T-MINUS 04:00:00 &bull; 408 KM LEO</span>
            </div>
          </div>

          {/* Messages */}
          {messages.map((msg) => {
            const isMe = msg.sender === 'Commander';
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-3 max-w-[88%] sm:max-w-[75%] ${
                  isMe ? 'self-end flex-row-reverse' : 'self-start'
                }`}
              >
                {/* Sender Avatar */}
                <img
                  src={msg.senderAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                  alt={msg.sender}
                  className="w-8 h-8 rounded-full object-cover border border-white/10 flex-shrink-0"
                />

                <div className={`flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                  {/* Bubble */}
                  <div
                    className={`rounded-2xl px-4 py-3 backdrop-blur-md transition-all ${
                      isMe
                        ? msg.status === 'queued'
                          ? 'bg-[#00f2ff]/10 border border-dashed border-[#00f2ff]/40 rounded-br-sm text-[#00dbe7]'
                          : 'bg-[#00f2ff]/15 border border-[#00f2ff]/25 rounded-br-sm text-[#e1fdff]'
                        : 'bg-white/10 border border-white/10 rounded-bl-sm text-[#dfe2f3]'
                    }`}
                  >
                    {/* Audio Message Type */}
                    {msg.type === 'audio' ? (
                      <div className="flex items-center gap-3.5 w-60 sm:w-68">
                        <button
                          onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                          className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors text-white cursor-pointer"
                        >
                          {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </button>

                        <div className="flex-1 flex items-center gap-1 h-6">
                          {(msg.audioWaveform || [30, 70, 45, 90, 55, 80, 40, 60, 85, 30]).map((h, i) => (
                            <div
                              key={i}
                              style={{ height: `${h}%` }}
                              className={`w-1 rounded-full transition-all ${
                                isPlayingAudio ? 'bg-[#00f2ff] animate-pulse' : 'bg-white/60'
                              }`}
                            />
                          ))}
                        </div>

                        <span className="font-mono text-xs text-[#b9cacb]">{msg.audioDuration || '0:14'}</span>
                      </div>
                    ) : (
                      <p className="text-sm sm:text-[15px] leading-relaxed tracking-wide">{msg.text}</p>
                    )}
                  </div>

                  {/* Message Meta Info */}
                  <div className="flex items-center gap-1.5 px-1 font-mono text-[10px] text-[#849495]">
                    <span>{msg.timeFormatted}</span>
                    {isMe && (
                      <>
                        {msg.status === 'queued' ? (
                          <Clock className="w-3 h-3 text-[#849495]" />
                        ) : (
                          <CheckCheck className="w-3.5 h-3.5 text-[#00f2ff]" />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Offline Queued Banner (Matches Stitch UI) */}
          {isSimulatedOffline && (
            <div className="flex justify-center my-4">
              <div className="glass-panel px-5 py-3 rounded-2xl flex items-center gap-4 border-l-4 border-l-[#8f03ff] shadow-[0_0_25px_rgba(143,3,255,0.2)]">
                <div className="p-2 rounded-xl bg-[#8f03ff]/20 text-[#dab9ff]">
                  <SatIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-mono text-xs font-bold text-[#dab9ff] tracking-wider">
                    OFFLINE SUPPORT ACTIVE
                  </p>
                  <p className="font-mono text-[11px] text-[#b9cacb] mt-0.5">
                    Next sat pass in 14m 20s. Messages queued in local cache.
                  </p>
                </div>
                <button
                  onClick={handleSyncQueued}
                  className="ml-2 px-3 py-1.5 rounded-xl bg-[#00f2ff] text-black font-mono font-bold text-xs hover:bg-[#74f5ff] transition-all cursor-pointer"
                >
                  Force Uplink
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="glass-panel p-4 border-t border-white/5 z-10">
          <div className="flex items-center gap-2 bg-[#1b1f2c]/80 rounded-2xl p-2 border border-white/10 focus-within:border-[#00f2ff]/50 transition-all">
            <button
              className="p-2 text-[#b9cacb] hover:text-[#00f2ff] hover:bg-white/5 rounded-xl transition-all cursor-pointer"
              title="Add Attachment"
            >
              <Plus className="w-5 h-5" />
            </button>

            {/* Recording State Preview */}
            {isRecording ? (
              <div className="flex-1 flex items-center justify-between px-3">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#ffb4ab] animate-ping"></span>
                  <span className="font-mono text-xs text-[#ffdad6]">
                    RECORDING VOICE TRANSMISSION (0:0{recordSeconds})
                  </span>
                </div>
                <button
                  onClick={handleSendVoiceNote}
                  className="px-3 py-1 rounded-lg bg-[#00f2ff] text-black font-mono text-xs font-bold"
                >
                  Send Note
                </button>
              </div>
            ) : (
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Transmit secure message via satellite relay..."
                className="flex-1 bg-transparent border-none text-[#e1fdff] text-sm focus:outline-none px-2"
              />
            )}

            {/* Audio Recording Toggle */}
            <button
              onClick={() => {
                if (isRecording) {
                  handleSendVoiceNote();
                } else {
                  setIsRecording(true);
                }
              }}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isRecording
                  ? 'bg-[#93000a] text-[#ffdad6] pulse-red'
                  : 'text-[#00dbe7] hover:bg-[#00dbe7]/10'
              }`}
            >
              {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Transmit Button */}
            <button
              id="btn-transmit-message"
              onClick={handleSendMessage}
              className="p-2.5 bg-[#00f2ff] text-black hover:bg-[#74f5ff] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,242,255,0.4)] transition-all active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
