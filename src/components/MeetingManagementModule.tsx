/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Idea, UserPersona } from "../types";
import { 
  Calendar, 
  Plus, 
  Clock, 
  Users, 
  MapPin, 
  FileText, 
  CheckSquare, 
  ArrowRight, 
  AlertCircle,
  Video,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Search,
  BookOpen
} from "lucide-react";

export interface OfflineMeeting {
  id: string;
  ideaId: string;
  ideaTitle: string;
  meetingType: 'IRC_Proposer' | 'FH_Proposer' | 'FH_Finance';
  meetingTypeLabel: string;
  date: string;
  time: string;
  participants: string;
  agenda: string;
  mom: string;
  decisions: string;
  actionItems: string;
  followUpStatus: 'Scheduled' | 'Pending Action' | 'In Progress' | 'Resolved';
  dateCreated: string;
}

interface MeetingManagementModuleProps {
  ideas: Idea[];
  persona: UserPersona;
  meetings: OfflineMeeting[];
  onAddMeeting: (meeting: OfflineMeeting) => void;
  onAddNotification: (recipient: string, subject: string, message: string) => void;
}

export const MeetingManagementModule: React.FC<MeetingManagementModuleProps> = ({
  ideas,
  persona,
  meetings,
  onAddMeeting,
  onAddNotification
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [associatedIdeaId, setAssociatedIdeaId] = useState(ideas.length > 0 ? ideas[0].id : "");
  const [meetingType, setMeetingType] = useState<'IRC_Proposer' | 'FH_Proposer' | 'FH_Finance'>('IRC_Proposer');
  const [date, setDate] = useState("2026-07-02");
  const [time, setTime] = useState("14:30");
  const [participants, setParticipants] = useState("");
  const [agenda, setAgenda] = useState("");
  const [mom, setMom] = useState("");
  const [decisions, setDecisions] = useState("");
  const [actionItems, setActionItems] = useState("");
  const [followUpStatus, setFollowUpStatus] = useState<'Scheduled' | 'Pending Action' | 'In Progress' | 'Resolved'>('Scheduled');

  // Set default participants when meetingType changes
  React.useEffect(() => {
    const selectedIdea = ideas.find(i => i.id === associatedIdeaId);
    const proposerName = selectedIdea?.employeeName || "Sathya Kumar";
    const fhName = selectedIdea?.assignedFHName || "Dr. Alok Gupta";

    if (meetingType === 'IRC_Proposer') {
      setParticipants(`${proposerName}, TM & OD CoE Lead, IRC Senior Advisory Panel, C-POC coordinator`);
      setAgenda(`Technical presentation of "${selectedIdea?.title || "Proposal"}" to the central IRC Advisory Jury to clarify scaling feasibility.`);
    } else if (meetingType === 'FH_Proposer') {
      setParticipants(`${proposerName}, ${fhName}, Project Pilot Lead (Kavita Sharma)`);
      setAgenda(`Reviewing 6-Month Pilot Implementation timeline, trial parameters, and milestone checkpoints for "${selectedIdea?.title || "Proposal"}".`);
    } else {
      setParticipants(`${fhName}, Central Finance Admin, Corporate Treasury Auditor`);
      setAgenda(`Audit evaluation of verified utilities savings and cash equivalent calculations for final CFO disbursement.`);
    }
  }, [meetingType, associatedIdeaId]);

  const handleSubmitMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedIdea = ideas.find(i => i.id === associatedIdeaId);
    if (!selectedIdea) {
      alert("Error: Please select an associated idea.");
      return;
    }

    const labels = {
      IRC_Proposer: "IRC ↔ Idea Proposer Meeting",
      FH_Proposer: "Functional Head ↔ Idea Proposer Presentation",
      FH_Finance: "Functional Head ↔ Finance Discussion"
    };

    const newMeeting: OfflineMeeting = {
      id: `MEET-${String(meetings.length + 1).padStart(4, "0")}`,
      ideaId: associatedIdeaId,
      ideaTitle: selectedIdea.title,
      meetingType,
      meetingTypeLabel: labels[meetingType],
      date,
      time,
      participants: participants.trim() || "All Stakeholders",
      agenda: agenda.trim() || "Routine Alignment",
      mom: mom.trim() || "Minutes logged successfully during coordination.",
      decisions: decisions.trim() || "Approved to proceed to next stage gate.",
      actionItems: actionItems.trim() || "None assigned.",
      followUpStatus,
      dateCreated: new Date().toISOString()
    };

    onAddMeeting(newMeeting);

    // Dynamic Notifications delivery to Zoho Mail for all participants
    const emailSubject = `[RIPPLE MoM] Minutes of Meeting Logged - ${newMeeting.id}`;
    const emailBody = `Dear Stakeholders,

TM & OD Central Coordinator has officially logged the minutes and decisions for the offline alignment session:

MEETING PROFILE:
------------------------------------------
Session ID: ${newMeeting.id}
Activity Type: ${newMeeting.meetingTypeLabel}
Date / Time: ${newMeeting.date} @ ${newMeeting.time}
Associated Project: ${newMeeting.ideaTitle} (ID: ${newMeeting.ideaId})

PARTICIPANTS RECORDED:
${newMeeting.participants}

AGENDA DISCUSSED:
${newMeeting.agenda}

MINUTES OF MEETING (MoM):
${newMeeting.mom}

DECISIONS REACHED:
${newMeeting.decisions}

ACTION ITEMS & ROADMAP:
${newMeeting.actionItems}

Current Follow-up Status: ${newMeeting.followUpStatus}

All records have been securely written to the organization-wide non-repudiation registry. Participants should coordinate actions accordingly.

Best regards,
Central Idea Coordination CoE
Ion Exchange (India) Limited`;

    onAddNotification(selectedIdea.employeeEmail, emailSubject, emailBody);
    onAddNotification("coe@ionexchange.com", emailSubject, emailBody);

    // Reset Form
    setMom("");
    setDecisions("");
    setActionItems("");
    setShowAddForm(false);
    alert(`Success: Alignment meeting logged! Automated Email Notification dispatched via Zoho Mail to recipients.`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "In Progress":
        return "bg-indigo-50 text-indigo-800 border-indigo-200";
      case "Pending Action":
        return "bg-rose-50 text-rose-800 border-rose-200";
      case "Scheduled":
      default:
        return "bg-blue-50 text-blue-800 border-blue-200";
    }
  };

  const getMeetingTypeBadgeColor = (type: string) => {
    switch (type) {
      case "IRC_Proposer":
        return "bg-violet-100 text-violet-850 font-mono";
      case "FH_Proposer":
        return "bg-amber-100 text-amber-850 font-sans";
      case "FH_Finance":
      default:
        return "bg-rose-100 text-rose-850 font-mono";
    }
  };

  const filteredMeetings = meetings.filter(meet => {
    const matchesSearch = 
      meet.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meet.ideaId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meet.ideaTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meet.participants.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meet.agenda.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" ? true : meet.meetingType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 text-left">
      
      {/* Page Title Header */}
      <div className="p-5 bg-white border border-slate-200 rounded-2xl card-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <span className="text-[9px] font-mono tracking-widest uppercase text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
            Offline Consensus & Collaboration
          </span>
          <h2 className="text-xl font-black font-display text-slate-900 tracking-tight">
            OFFLINE MEETING MANAGEMENT MODULE
          </h2>
          <p className="text-slate-500 text-xs font-sans max-w-2xl">
            Streamlining alignment across stage boundaries. Log meeting agendas, attendees, Minutes of Meetings (MoM), final decisions, and follow-up action items dynamically with automated email delivery on save.
          </p>
        </div>
        
        {persona.role === "C-POC" && !showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1 px-4 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Schedule Offline Session
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT / CENTER: Meetings Feed */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white border border-slate-200 p-4 rounded-2xl card-shadow space-y-4">
            
            {/* Filtering tools */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search meeting topics, participants, agenda..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
              >
                <option value="all">All Meeting Types</option>
                <option value="IRC_Proposer">IRC ↔ Proposer</option>
                <option value="FH_Proposer">FH ↔ Proposer Presentation</option>
                <option value="FH_Finance">FH ↔ Finance discussion</option>
              </select>
            </div>

            {/* List timeline */}
            <div className="space-y-5 max-h-[600px] overflow-y-auto pr-1">
              {filteredMeetings.length > 0 ? (
                filteredMeetings.map((meet, idx) => (
                  <div 
                    key={meet.id} 
                    className="p-4 border border-slate-200 hover:border-slate-350 bg-slate-50/20 hover:bg-white rounded-xl transition-all duration-200 text-left relative"
                  >
                    {/* Header line */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded">
                          {meet.id}
                        </span>
                        <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getMeetingTypeBadgeColor(meet.meetingType)}`}>
                          {meet.meetingTypeLabel}
                        </span>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(meet.followUpStatus)}`}>
                        {meet.followUpStatus}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="grid grid-cols-2 gap-3 my-3 text-[10px] text-slate-500 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{new Date(meet.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} at {meet.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Users className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="truncate" title={meet.participants}>Attendees: {meet.participants}</span>
                      </div>
                    </div>

                    {/* Main detail blocks */}
                    <div className="space-y-3 font-sans">
                      <div>
                        <span className="text-[8.5px] text-slate-400 font-bold font-mono block uppercase">Ref Project Title</span>
                        <h4 className="text-xs font-semibold text-slate-800 mt-0.5 leading-snug">
                          {meet.ideaTitle} <span className="text-slate-400 font-mono text-[9.5px]">({meet.ideaId})</span>
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] leading-relaxed">
                        <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-xl">
                          <strong className="block text-slate-900 font-bold text-[9px] uppercase tracking-wider mb-0.5">MoM Summary</strong>
                          <p className="text-slate-650 italic">"{meet.mom || "Minutes still being summarized"}"</p>
                        </div>
                        <div className="p-2.5 bg-indigo-50/40 border border-indigo-100 rounded-xl">
                          <strong className="block text-indigo-950 font-bold text-[9px] uppercase tracking-wider mb-0.5">Decisions Reached</strong>
                          <p className="text-indigo-900 font-medium">"{meet.decisions || "No formal decision resolved."}"</p>
                        </div>
                      </div>

                      {meet.actionItems && (
                        <div className="p-2.5 bg-slate-100/50 border border-slate-200 rounded-xl text-[11px] text-slate-700">
                          <strong className="block text-slate-900 font-bold text-[9px] uppercase tracking-wider mb-1 flex items-center gap-1">
                            <CheckSquare className="w-3 h-3 text-indigo-650" />
                            Action Items & Deliverables
                          </strong>
                          <p className="whitespace-pre-line text-slate-650 font-mono text-[10px] leading-normal">{meet.actionItems}</p>
                        </div>
                      )}
                    </div>

                    {/* Footer stamp */}
                    <div className="mt-3.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[8px] font-mono text-slate-400">
                      <span>ORGANIZED BY: CENTRAL C-POC ROSTER</span>
                      <span>EMITTED: {new Date(meet.dateCreated).toLocaleString()}</span>
                    </div>

                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-xl">
                  <Calendar className="w-10 h-10 opacity-20 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold">No offline meetings found matching criteria</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* RIGHT: Add form (Only for C-POC) or Audit policy info */}
        <div className="lg:col-span-5 space-y-4">
          
          {persona.role === "C-POC" && showAddForm ? (
            <div className="bg-white border border-slate-200 p-5 rounded-2xl card-shadow">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="font-display font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-indigo-600" />
                  Log Offline Meeting Report
                </h3>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="text-[10px] text-slate-400 hover:text-slate-650 font-bold"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSubmitMeeting} className="space-y-4 text-xs font-sans">
                
                <div>
                  <label className="block text-slate-500 font-bold uppercase tracking-widest text-[9px] mb-2 font-mono">
                    Select Target Project <span className="text-indigo-500 font-mono">*</span>
                  </label>
                  <select
                    value={associatedIdeaId}
                    onChange={(e) => setAssociatedIdeaId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
                  >
                    {ideas.map(idea => (
                      <option key={idea.id} value={idea.id}>
                        {idea.id} - {idea.title.slice(0, 40)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-bold uppercase tracking-widest text-[9px] mb-2 font-mono">
                    Meeting Type <span className="text-indigo-500 font-mono">*</span>
                  </label>
                  <select
                    value={meetingType}
                    onChange={(e) => setMeetingType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
                  >
                    <option value="IRC_Proposer">IRC ↔ Idea Proposer Meeting</option>
                    <option value="FH_Proposer">Functional Head ↔ Idea Proposer Presentation</option>
                    <option value="FH_Finance">Functional Head ↔ Finance Discussion</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-bold uppercase tracking-widest text-[9px] mb-2 font-mono">
                      Meeting Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold uppercase tracking-widest text-[9px] mb-2 font-mono">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 font-bold uppercase tracking-widest text-[9px] mb-2 font-mono">
                    Participants List
                  </label>
                  <input
                    type="text"
                    required
                    value={participants}
                    onChange={(e) => setParticipants(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-bold uppercase tracking-widest text-[9px] mb-2 font-mono">
                    Agenda & Focus
                  </label>
                  <textarea
                    rows={2}
                    value={agenda}
                    onChange={(e) => setAgenda(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-bold uppercase tracking-widest text-[9px] mb-2 font-mono">
                    Minutes of Meeting (MoM) <span className="text-indigo-500 font-mono">*</span>
                  </label>
                  <textarea
                    required
                    placeholder="Provide a detailed summary of key discussion points."
                    rows={2}
                    value={mom}
                    onChange={(e) => setMom(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-bold uppercase tracking-widest text-[9px] mb-2 font-mono">
                    Decisions Reached <span className="text-indigo-500 font-mono">*</span>
                  </label>
                  <textarea
                    required
                    placeholder="List final approvals, scope changes, or authorization milestones."
                    rows={2}
                    value={decisions}
                    onChange={(e) => setDecisions(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-bold uppercase tracking-widest text-[9px] mb-2 font-mono">
                    Action Items & Roadmap
                  </label>
                  <textarea
                    placeholder="List actions with owners. (e.g. '1. Kavita S. to finalize sensor bill of material by 10th July')"
                    rows={2}
                    value={actionItems}
                    onChange={(e) => setActionItems(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-bold uppercase tracking-widest text-[9px] mb-2 font-mono">
                    Follow-Up Status
                  </label>
                  <select
                    value={followUpStatus}
                    onChange={(e) => setFollowUpStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Pending Action">Pending Action</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <CheckSquare className="w-4 h-4" />
                  Save alignment meeting minutes
                </button>

              </form>
            </div>
          ) : (
            <div className="bg-slate-900 text-white border border-slate-800 p-5 rounded-2xl shadow-md text-xs space-y-4">
              <div className="flex items-center gap-1.5 text-indigo-400">
                <BookOpen className="w-4.5 h-4.5" />
                <strong className="uppercase font-display font-black tracking-widest text-xs">Offline MoM Audit</strong>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                To satisfy the strict <strong>Stage-Gate alignment procedure</strong>, offline meetings are structured into the RIPPLE timeline. 
              </p>
              <p className="text-slate-400 leading-relaxed text-[10.5px]">
                Only the designated <strong>C-POC (Central Program Coordinator)</strong> can write, modify, or log Minutes of Meetings (MoM).
              </p>

              {persona.role !== "C-POC" && (
                <div className="p-3.5 bg-indigo-950/40 border border-indigo-900/40 rounded-xl text-[10.5px] leading-relaxed text-indigo-300">
                  <AlertCircle className="w-4 h-4 text-indigo-400 inline mr-1" />
                  <span>Currently logged in as <strong>{persona.role}</strong>. RIPPLE governance restricts scheduling privileges. Toggle to <strong>C-POC</strong> persona at the top bar to simulate scheduling.</span>
                </div>
              )}

              <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-[10.5px] space-y-2">
                <div className="font-mono text-slate-400 uppercase font-bold tracking-wider text-[9px]">Offline Checkpoints list</div>
                <div>• Stage 1 Gating: IRC ↔ Proposer Presentation</div>
                <div>• Stage 2 Setup: FH ↔ Proposer Presentation</div>
                <div>• Stage 2 Disbursement: FH ↔ Finance Audit Discussion</div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
