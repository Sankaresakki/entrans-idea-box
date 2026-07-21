/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { NotificationLog } from "../types";
import { Mail, ArrowRight, Calendar, User, Tag, Download, Sparkles, Inbox, RefreshCw } from "lucide-react";

interface NotificationLogViewProps {
  logs: NotificationLog[];
  onClear: () => void;
}

export const NotificationLogView: React.FC<NotificationLogViewProps> = ({ logs, onClear }) => {
  const [selectedLogId, setSelectedLogId] = useState<string | null>(logs.length > 0 ? logs[0].id : null);

  // Auto-select first email if none selected but logs are present
  React.useEffect(() => {
    if (logs.length > 0 && !selectedLogId) {
      setSelectedLogId(logs[0].id);
    }
  }, [logs, selectedLogId]);

  const selectedLog = logs.find(l => l.id === selectedLogId) || logs[0];

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden card-shadow flex flex-col md:flex-row h-[500px]">
      
      {/* List Panel */}
      <div className="w-full md:w-80 border-r border-slate-200 flex flex-col h-full bg-slate-50">
        <div className="p-3 border-b border-slate-200 bg-linear-to-r from-blue-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-sky-400" />
            <h3 className="font-display font-bold text-xs tracking-wider uppercase">
              Zoho Mail Simulator (One Ion)
            </h3>
          </div>
          <button
            onClick={onClear}
            className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-1"
          >
            <RefreshCw className="w-2.5 h-2.5" />
            Reset Inbox
          </button>
        </div>

        <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center h-full">
              <Inbox className="w-8 h-8 opacity-40 mb-2 stroke-1" />
              <p className="text-xs font-semibold">Inbox is Empty</p>
              <p className="text-[10px] mt-1 max-w-[200px] text-center text-slate-400/80">
                Trigger workflows by submitting an idea or transitioning stages to receive automated notifications.
              </p>
            </div>
          ) : (
            logs.map((log) => {
              const isSelected = selectedLog?.id === log.id;
              return (
                <button
                  key={log.id}
                  onClick={() => setSelectedLogId(log.id)}
                  className={`w-full text-left p-3.5 transition-all outline-none border-l-3 ${
                    isSelected 
                      ? "bg-white border-sky-500 shadow-xs" 
                      : "border-transparent hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold font-mono text-slate-400 bg-slate-200/50 px-1.5 py-0.5 rounded-md uppercase">
                      {log.ideaId}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h4 className={`text-xs font-bold truncate ${isSelected ? "text-sky-600" : "text-slate-800"}`}>
                    {log.subject}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                    To: {log.recipient}
                  </p>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-1 font-sans italic">
                    {log.body.replace(/<[^>]*>/g, '').substring(0, 50)}...
                  </p>
                  {log.attachmentName && (
                    <div className="mt-1.5 flex items-center gap-1 text-[8px] font-bold text-sky-600 uppercase tracking-widest font-mono">
                      <Tag className="w-2.5 h-2.5 text-sky-400" />
                      Attachment: {log.attachmentName.substring(0, 16)}...
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Reader Panel */}
      <div className="flex-1 flex flex-col h-full bg-white relative">
        {selectedLog ? (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Mail Header info */}
            <div className="p-4 border-b border-rose-100/10 bg-linear-to-b from-slate-50 to-white">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-slate-800 font-display">
                  {selectedLog.subject}
                </span>
                <span className="text-[10px] font-mono text-slate-400 max-sm:w-full">
                  Logged: {new Date(selectedLog.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px] w-12 block">
                    From:
                  </span>
                  <span>
                    {selectedLog.subject.includes("update from the review committee")
                      ? "ripple@ionexchange.com (RIPPLE — Talent Management & OD)"
                      : "no-reply@ionexchange.com (One Ion Server)"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px] w-12 block">
                    To:
                  </span>
                  <span className="text-slate-800 font-bold bg-sky-50 px-2 py-0.5 rounded-sm">
                    {selectedLog.recipient}
                  </span>
                </div>
              </div>
            </div>

            {/* Mail Body */}
            <div className="flex-1 p-5 overflow-y-auto prose prose-slate max-w-none text-xs text-slate-700 leading-relaxed font-sans">
              <div className="bg-slate-50 border-l-4 border-blue-900 p-3 rounded-r-lg mb-4 text-[10px] font-mono text-slate-500 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-900 flex-shrink-0" />
                <span>
                  <strong>Zoho Trigger Event:</strong> Auto-fired during Idea status shift to "{selectedLog.subject.replace("Notification: ", "")}".
                </span>
              </div>
              <div 
                className="whitespace-pre-wrap style-markup-body"
                dangerouslySetInnerHTML={{ __html: selectedLog.body.replace(/\n/g, '<br/>') }}
              />
            </div>

            {/* Attachment Box */}
            {selectedLog.attachmentName && (
              <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-md bg-sky-100 text-sky-700">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-600 block">
                      {selectedLog.attachmentName}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 uppercase">
                      {selectedLog.attachmentType || "Document"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => alert(`Review/print using the Certificates panel or Documents library. Attachment: ${selectedLog.attachmentName}`)}
                  className="px-2.5 py-1 text-[10px] font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-md transition-all cursor-pointer"
                >
                  View Attachment File
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-slate-400">
            <Mail className="w-12 h-12 stroke-1 opacity-20 mb-3" />
            <p className="text-sm font-semibold">No Email Selected</p>
            <p className="text-xs text-slate-400/80 mt-1">Select an item from the left panel to read the notification.</p>
          </div>
        )}
      </div>

    </div>
  );
};
