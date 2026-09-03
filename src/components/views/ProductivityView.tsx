import { useState, useEffect, FormEvent } from 'react';
import { OperationTask, CalendarEvent } from '../../types';
import {
  Radio,
  Terminal,
  FileText,
  CheckCircle,
  Clock,
  Plus,
  Calendar,
  Edit3,
  Cpu,
  Brain,
  Sparkles,
  Save,
  Check,
  TrendingUp,
} from 'lucide-react';

interface Props {
  focusMode: boolean;
  onToggleFocus: () => void;
  onOpenAiAssist: () => void;
}

export function ProductivityView({ focusMode, onToggleFocus, onOpenAiAssist }: Props) {
  const [tasks, setTasks] = useState<OperationTask[]>([
    {
      id: 'task-1',
      title: 'Calibrate Sensor Array Beta',
      timeGmt: '14:00 GMT',
      priority: 1,
      status: 'pending',
      assignedTo: 'Commander',
      category: 'sensors',
    },
    {
      id: 'task-2',
      title: 'Update Command Protocol Scripts',
      timeGmt: '16:30 GMT',
      priority: 2,
      status: 'pending',
      assignedTo: 'Commander',
      category: 'protocols',
    },
    {
      id: 'task-3',
      title: 'Review Telemetry Logs',
      timeGmt: '08:15 GMT',
      priority: 3,
      status: 'completed',
      assignedTo: 'Commander',
      category: 'telemetry',
    },
  ]);

  const [scratchpad, setScratchpad] = useState<string>(
    '> Enter coordinate overrides here...\n# Target: 45.9234° N, 104.2812° W\n# Doppler Offset: +2.1 kHz on uplink\n# Comms encryption channel key confirmed'
  );
  const [isSavedNotes, setIsSavedNotes] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskGmt, setNewTaskGmt] = useState('18:00 GMT');
  const [newTaskPriority, setNewTaskPriority] = useState<1 | 2 | 3>(2);

  // Fetch initial tasks & scratchpad from server
  useEffect(() => {
    fetch('/api/operations')
      .then((res) => res.json())
      .then((data) => {
        if (data.tasks) setTasks(data.tasks);
        if (data.scratchpad) setScratchpad(data.scratchpad);
      })
      .catch(() => {});
  }, []);

  const handleToggleTask = async (taskId: string) => {
    try {
      const res = await fetch('/api/operations/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle', taskId }),
      });
      const data = await res.json();
      if (data.tasks) setTasks(data.tasks);
    } catch {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
        )
      );
    }
  };

  const handleCreateTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const res = await fetch('/api/operations/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          taskData: {
            title: newTaskTitle,
            timeGmt: newTaskGmt,
            priority: newTaskPriority,
          },
        }),
      });
      const data = await res.json();
      if (data.tasks) setTasks(data.tasks);
      setNewTaskTitle('');
      setShowNewTaskModal(false);
    } catch {
      const newTask: OperationTask = {
        id: `task-${Date.now()}`,
        title: newTaskTitle,
        timeGmt: newTaskGmt,
        priority: newTaskPriority,
        status: 'pending',
      };
      setTasks([newTask, ...tasks]);
      setNewTaskTitle('');
      setShowNewTaskModal(false);
    }
  };

  const handleSaveScratchpad = async (val: string) => {
    setScratchpad(val);
    try {
      await fetch('/api/operations/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: val }),
      });
      setIsSavedNotes(true);
      setTimeout(() => setIsSavedNotes(false), 2000);
    } catch {}
  };

  const pendingCount = tasks.filter((t) => t.status !== 'completed').length;

  return (
    <div className={`flex-1 flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 transition-all ${focusMode ? 'ambient-glow-purple' : ''}`}>
      {/* Top Operations Header Bar */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#e1fdff] tracking-tight flex items-center gap-3">
            <span>Orbital Operations</span>
            {focusMode && (
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#8f03ff]/30 text-[#efdbff] border border-[#dab9ff]">
                FOCUS MODE ACTIVE
              </span>
            )}
          </h2>
          <p className="font-mono text-xs text-[#b9cacb] mt-1">
            SYNC: SATELLITE NETWORK ONLINE &bull; {pendingCount} PENDING OPERATIONS
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAiAssist}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8f03ff]/20 border border-[#8f03ff]/40 text-[#efdbff] hover:bg-[#8f03ff]/30 text-xs font-mono transition-all cursor-pointer shadow-[0_0_15px_rgba(143,3,255,0.2)]"
          >
            <Sparkles className="w-4 h-4 text-[#dab9ff]" />
            <span>AI Operations Briefing</span>
          </button>

          <button
            id="btn-focus-mode-toggle"
            onClick={onToggleFocus}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs transition-all cursor-pointer ${
              focusMode
                ? 'bg-[#8f03ff] text-white shadow-[0_0_25px_rgba(143,3,255,0.6)]'
                : 'glass-panel text-[#b9cacb] hover:text-white'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>{focusMode ? 'FOCUS: ON' : 'FOCUS MODE'}</span>
          </button>
        </div>
      </div>

      {/* Main Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Operations Task List (8 Cols) */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden">
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#00dbe7] via-[#8f03ff] to-transparent"></div>

          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div>
              <h3 className="text-xl font-bold text-[#e1fdff] tracking-tight">Active Operations</h3>
              <p className="font-mono text-xs text-[#b9cacb]">SATELLITE DOWNLINK SCHEDULING</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-[#00dbe7] bg-[#00dbe7]/10 border border-[#00dbe7]/30 px-3 py-1 rounded-full font-bold">
                {pendingCount} PENDING
              </span>
              <button
                onClick={() => setShowNewTaskModal(true)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-[#00f2ff] hover:text-black transition-all cursor-pointer text-[#00dbe7]"
                title="Add New Operation Task"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Task Items */}
          <div className="flex flex-col gap-3.5">
            {tasks.map((task) => {
              const isCompleted = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className={`rounded-xl p-4 flex items-center justify-between transition-all cursor-pointer group ${
                    isCompleted
                      ? 'glass-panel opacity-60 border-white/5'
                      : task.priority === 1
                      ? 'glass-panel-accent border-l-4 border-l-[#00dbe7]'
                      : 'glass-panel border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon based on task */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center relative ${
                        isCompleted
                          ? 'bg-white/5 text-[#849495]'
                          : task.priority === 1
                          ? 'bg-[#00dbe7]/15 text-[#00dbe7]'
                          : 'bg-[#8f03ff]/15 text-[#dab9ff]'
                      }`}
                    >
                      {task.title.toLowerCase().includes('sensor') ? (
                        <Radio className="w-5 h-5" />
                      ) : task.title.toLowerCase().includes('script') || task.title.toLowerCase().includes('protocol') ? (
                        <Terminal className="w-5 h-5" />
                      ) : (
                        <FileText className="w-5 h-5" />
                      )}
                      {!isCompleted && task.priority === 1 && (
                        <div className="absolute inset-0 rounded-xl pulse-indicator"></div>
                      )}
                    </div>

                    <div>
                      <h4
                        className={`text-sm font-bold tracking-wide ${
                          isCompleted ? 'line-through text-[#849495]' : 'text-[#e1fdff]'
                        }`}
                      >
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2.5 mt-1 text-xs font-mono">
                        <span className="flex items-center gap-1 text-[#b9cacb]">
                          <Clock className="w-3 h-3 text-[#849495]" />
                          <span>{task.timeGmt}</span>
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/20"></span>
                        {isCompleted ? (
                          <span className="text-[#00dbe7] font-semibold">COMPLETED</span>
                        ) : (
                          <span
                            className={`font-bold ${
                              task.priority === 1
                                ? 'text-[#00f2ff]'
                                : task.priority === 2
                                ? 'text-[#dab9ff]'
                                : 'text-[#b9cacb]'
                            }`}
                          >
                            PRIORITY {task.priority}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Completion check circle */}
                  <button
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-[#00dbe7] border-[#00dbe7] text-black shadow-[0_0_12px_#00dbe7]'
                        : 'border-white/20 text-transparent group-hover:border-[#00dbe7] group-hover:text-[#00dbe7]'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Column: Orbital Calendar & Quick Scratchpad (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Orbital Calendar Sync */}
          <div className="glass-panel rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="flex items-center gap-2 text-[#00dbe7]">
                <Calendar className="w-4 h-4" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider">ORBITAL CALENDAR</h3>
              </div>
              <span className="text-[10px] font-mono text-[#dab9ff]">GMT SYNC</span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="border-l-2 border-[#00dbe7] pl-3 py-1">
                <div className="font-mono text-xs text-[#dab9ff] font-bold">IN 45 MINS</div>
                <div className="text-sm font-semibold text-[#e1fdff]">Comms Relay Briefing</div>
                <div className="text-[11px] font-mono text-[#849495]">Alpha Team &bull; Channel 01</div>
              </div>

              <div className="border-l-2 border-white/15 pl-3 py-1 opacity-70">
                <div className="font-mono text-xs text-[#b9cacb]">TOMORROW</div>
                <div className="text-sm text-[#e1fdff]">Maintenance Window</div>
                <div className="text-[11px] font-mono text-[#849495]">Orbital Node Firmware Push</div>
              </div>
            </div>
          </div>

          {/* Scratchpad Notes */}
          <div className="glass-panel rounded-2xl p-5 flex-1 flex flex-col gap-2 min-h-[220px]">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="flex items-center gap-2 text-[#b9cacb]">
                <Edit3 className="w-4 h-4 text-[#00dbe7]" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider">SCRATCHPAD</h3>
              </div>
              {isSavedNotes && (
                <span className="text-[10px] font-mono text-[#00f2ff] flex items-center gap-1 animate-pulse">
                  <Check className="w-3 h-3" /> Saved
                </span>
              )}
            </div>

            <textarea
              id="orbital-scratchpad-input"
              value={scratchpad}
              onChange={(e) => handleSaveScratchpad(e.target.value)}
              className="w-full flex-1 bg-transparent border-none focus:ring-0 text-[#dfe2f3] font-mono text-xs resize-none placeholder:text-[#849495]/40 leading-relaxed outline-none"
              placeholder="> Enter coordinate overrides here..."
            />
          </div>
        </div>
      </div>

      {/* Analytics & Node Load Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        {/* Study & Work Efficiency Chart */}
        <div className="glass-panel rounded-2xl p-6 h-64 relative overflow-hidden flex flex-col justify-between ambient-glow-cyan">
          <div className="flex items-center justify-between mb-2 z-10">
            <div>
              <h3 className="font-mono text-xs font-bold text-[#b9cacb] uppercase tracking-wider">
                STUDY &amp; WORK EFFICIENCY
              </h3>
              <p className="text-xs text-[#849495]">Operational Throughput Benchmark</p>
            </div>
            <span className="font-mono text-sm text-[#00f2ff] font-bold bg-[#00f2ff]/10 px-2.5 py-1 rounded-lg border border-[#00f2ff]/20">
              +14.2%
            </span>
          </div>

          {/* Bar Columns */}
          <div className="flex-1 flex items-end gap-3 z-10 opacity-90 px-4 mt-2">
            <div className="flex-1 bg-white/10 rounded-t-sm h-[30%] hover:bg-[#00dbe7]/40 transition-colors"></div>
            <div className="flex-1 bg-white/10 rounded-t-sm h-[50%] hover:bg-[#00dbe7]/40 transition-colors"></div>
            <div className="flex-1 bg-white/10 rounded-t-sm h-[40%] hover:bg-[#00dbe7]/40 transition-colors"></div>
            <div className="flex-1 bg-[#00dbe7]/40 rounded-t-sm h-[80%] relative glow-ambient">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] text-[#00f2ff] font-bold">
                PEAK
              </div>
            </div>
            <div className="flex-1 bg-white/10 rounded-t-sm h-[60%] hover:bg-[#00dbe7]/40 transition-colors"></div>
            <div className="flex-1 bg-gradient-to-t from-[#00dbe7] to-[#74f5ff] rounded-t-sm h-[90%] shadow-[0_0_15px_#00dbe7]"></div>
          </div>

          <div className="flex justify-between text-[10px] font-mono text-[#849495] pt-2 border-t border-white/5 z-10">
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span className="text-[#00f2ff] font-bold">THU (PEAK)</span>
            <span>FRI</span>
            <span>TODAY</span>
          </div>
        </div>

        {/* Node Processing Load */}
        <div className="glass-panel rounded-2xl p-6 h-64 relative flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between z-10">
            <h3 className="font-mono text-xs font-bold text-[#b9cacb] uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#dab9ff]" />
              <span>NODE PROCESSING LOAD</span>
            </h3>
            <span className="text-[10px] font-mono text-[#00dbe7]">ORB-092 CPU ARRAY</span>
          </div>

          {/* Decorative Animated Signal Flow SVG */}
          <svg className="absolute inset-0 w-full h-full opacity-35 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path
              d="M 0,50 Q 25,20 50,50 T 100,50"
              fill="none"
              stroke="#00dbe7"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <path
              d="M 0,60 Q 35,90 50,60 T 100,60"
              fill="none"
              stroke="#dab9ff"
              strokeWidth="1"
              strokeDasharray="6 6"
            />
            <circle cx="50" cy="50" fill="#00dbe7" r="2.5" className="pulse-indicator" />
          </svg>

          {/* Cores Readout */}
          <div className="z-10 font-mono text-xs flex flex-col gap-2 pt-4">
            <div className="flex justify-between items-center border-b border-white/5 py-1.5">
              <span className="text-[#b9cacb]">CORE 1 (Telemetrics &amp; Doppler)</span>
              <span className="text-[#e1fdff] font-bold">42%</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 py-1.5">
              <span className="text-[#b9cacb]">CORE 2 (Quantum Encryption Engine)</span>
              <span className="text-[#dab9ff] font-bold">89%</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-[#b9cacb]">CORE 3 (Constellation Routing)</span>
              <span className="text-[#e1fdff] font-bold">12%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Creating New Task */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 rounded-2xl border border-white/20 shadow-2xl">
            <h3 className="text-lg font-bold text-[#e1fdff] mb-4">Create New Operation Task</h3>
            <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-mono text-[#b9cacb] block mb-1">Operation Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g., Solar Array Angle Alignment"
                  className="w-full bg-[#1b1f2c] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#e1fdff] focus:border-[#00f2ff] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-[#b9cacb] block mb-1">Schedule GMT</label>
                  <input
                    type="text"
                    value={newTaskGmt}
                    onChange={(e) => setNewTaskGmt(e.target.value)}
                    placeholder="18:00 GMT"
                    className="w-full bg-[#1b1f2c] border border-white/10 rounded-xl px-3 py-2 text-sm text-[#e1fdff] focus:border-[#00f2ff] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#b9cacb] block mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(Number(e.target.value) as 1 | 2 | 3)}
                    className="w-full bg-[#1b1f2c] border border-white/10 rounded-xl px-3 py-2 text-sm text-[#e1fdff] focus:border-[#00f2ff] outline-none font-mono"
                  >
                    <option value={1}>Priority 1 (Critical)</option>
                    <option value={2}>Priority 2 (Standard)</option>
                    <option value={3}>Priority 3 (Routine)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-[#b9cacb] hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00f2ff] text-black font-mono font-bold text-xs hover:bg-[#74f5ff]"
                >
                  Add Operation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
