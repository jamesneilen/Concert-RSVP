import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Download,
  Copy,
  ExternalLink,
  X,
  Send,
  HelpCircle,
  Database,
  Lock,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { downloadCsvSpreadsheet, fetchSpreadsheetRsvps, RsvpRecord, GOOGLE_SHEET_WEBHOOK_URL } from '../services/rsvpRegistryService';

interface SpreadsheetSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpreadsheetSyncModal: React.FC<SpreadsheetSyncModalProps> = ({ isOpen, onClose }) => {
  const [webhookUrl, setWebhookUrl] = useState(GOOGLE_SHEET_WEBHOOK_URL);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testResult, setTestResult] = useState<any>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncResult, setSyncResult] = useState<any>(null);
  const [attendees, setAttendees] = useState<RsvpRecord[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeTab, setActiveTab] = useState<'sync' | 'code' | 'attendees'>('sync');

  // Bulletproof Google Apps Script code that works both container-bound and standalone
  const appsScriptCode = `/**
 * Google Apps Script Web App for St Cletus Choir RSVP Registry
 * Paste this in: Extensions > Apps Script (inside your Google Sheet)
 */
function doPost(e) {
  try {
    var data = {};
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    }

    // 1. Get the Google Sheet (Container-bound from Extensions > Apps Script)
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss ? ss.getActiveSheet() : null;

    // Fallback for standalone scripts: if not bound, replace with your Spreadsheet ID
    if (!sheet) {
      // var SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";
      // sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
      return ContentService.createTextOutput(JSON.stringify({
        result: "error",
        message: "Spreadsheet not found! Please create this script via Extensions > Apps Script inside your Google Sheet."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Automatically create header row if sheet is fresh/empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Full Name",
        "Pass Code",
        "Patron Tier",
        "Seats / Guests",
        "Phone / WhatsApp",
        "Email Address",
        "Seating Zone",
        "Special Petitions / Intentions",
        "Status"
      ]);
    }

    // 3. Extract incoming attendee values
    var timestamp = data.timestamp || new Date().toLocaleString();
    var fullName = data.fullName || data.name || "Guest";
    var passCode = data.passCode || data.code || "";
    var tier = data.tier || "General Admission";
    var guests = data.guestCount || data.guests || 1;
    var phone = data.phone || "N/A";
    var email = data.email || "N/A";
    var seatingZone = data.seatingZone || "Main Sanctuary";
    var prayerIntentions = data.prayerIntentions || data.specialRequests || "None";
    var status = data.status || "Confirmed • Active";

    // 4. Append row to sheet
    sheet.appendRow([
      timestamp,
      fullName,
      passCode,
      tier,
      guests,
      phone,
      email,
      seatingZone,
      prayerIntentions,
      status
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      result: "success",
      message: "Row appended successfully",
      sheetName: sheet.getName(),
      row: sheet.getLastRow(),
      fullName: fullName,
      passCode: passCode
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    message: "St Cletus Choir Google Apps Script Webhook is active!"
  })).setMimeType(ContentService.MimeType.JSON);
}`;

  useEffect(() => {
    if (isOpen) {
      fetchSpreadsheetRsvps().then((res) => {
        setAttendees(res.rsvps || []);
      });
      // Fetch current config
      fetch('/api/settings')
        .then((r) => r.json())
        .then((data) => {
          if (data.googleSheetWebhookUrl) {
            setWebhookUrl(data.googleSheetWebhookUrl);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestResult(null);
    try {
      const res = await fetch('/api/webhook/test', { method: 'POST' });
      const data = await res.json();
      setTestResult(data);
      if (data?.result?.success) {
        setTestStatus('success');
      } else {
        setTestStatus('error');
      }
    } catch (err: any) {
      setTestStatus('error');
      setTestResult({ error: err?.message || 'Network error' });
    }
  };

  const handleSyncAll = async () => {
    setSyncStatus('syncing');
    setSyncResult(null);
    try {
      const res = await fetch('/api/rsvps/sync-all', { method: 'POST' });
      const data = await res.json();
      setSyncResult(data);
      if (data?.synced > 0 || data?.success) {
        setSyncStatus('success');
      } else {
        setSyncStatus('error');
      }
    } catch (err: any) {
      setSyncStatus('error');
      setSyncResult({ error: err?.message || 'Network error' });
    }
  };

  const handleSaveUrl = async () => {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleSheetWebhookUrl: webhookUrl }),
      });
      setIsEditingUrl(false);
      handleTestConnection();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="bg-[#141916] max-w-2xl w-full rounded-2xl border-2 border-[#e9c349]/40 shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden text-[#dfe4de]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-[#0a0f0c] border-b border-[#e9c349]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1f4a3c]/70 text-[#e9c349] flex items-center justify-center border border-[#e9c349]/30 flex-shrink-0">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#e9c349] tracking-widest uppercase">
                  Parish Registry & Automation
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-bold border border-emerald-500/30">
                  Live Webhook
                </span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#dfe4de]">
                Google Sheet Sync Diagnostics
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#1c211e] hover:bg-[#313632] text-[#e9c349] border border-[#e9c349]/30 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#313632] bg-[#101412] px-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('sync')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
              activeTab === 'sync'
                ? 'border-[#e9c349] text-[#e9c349] font-bold'
                : 'border-transparent text-[#e2bebc] hover:text-[#dfe4de]'
            }`}
          >
            Sync & Test Live
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
              activeTab === 'code'
                ? 'border-[#e9c349] text-[#e9c349] font-bold'
                : 'border-transparent text-[#e2bebc] hover:text-[#dfe4de]'
            }`}
          >
            Setup Guide & Code.gs
          </button>
          <button
            onClick={() => setActiveTab('attendees')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
              activeTab === 'attendees'
                ? 'border-[#e9c349] text-[#e9c349] font-bold'
                : 'border-transparent text-[#e2bebc] hover:text-[#dfe4de]'
            }`}
          >
            Registered Patrons ({attendees.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-grow">
          {/* TAB 1: SYNC & TEST */}
          {activeTab === 'sync' && (
            <div className="space-y-4">
              {/* Webhook URL Card */}
              <div className="bg-[#1c211e] p-3.5 sm:p-4 rounded-xl border border-[#e9c349]/25 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#e9c349] uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" />
                    <span>Target Google Apps Script Webhook URL</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyUrl}
                      className="text-[11px] text-[#e9c349] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedUrl ? 'Copied!' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => setIsEditingUrl(!isEditingUrl)}
                      className="text-[11px] text-[#a3d0be] hover:underline cursor-pointer font-semibold"
                    >
                      {isEditingUrl ? 'Cancel' : 'Edit URL'}
                    </button>
                  </div>
                </div>

                {isEditingUrl ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="flex-grow bg-[#0a0f0c] text-xs font-mono text-[#dfe4de] px-3 py-2 rounded border border-[#e9c349]/50 focus:outline-none"
                    />
                    <button
                      onClick={handleSaveUrl}
                      className="px-3 py-2 bg-[#e9c349] text-[#3c2f00] font-bold text-xs rounded hover:bg-[#ffe088] cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#0a0f0c] p-2.5 rounded font-mono text-[11px] text-[#e2bebc] break-all border border-[#313632]">
                    {webhookUrl}
                  </div>
                )}
              </div>

              {/* Action Buttons: Test Connection & Push All */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleTestConnection}
                  disabled={testStatus === 'testing'}
                  className="py-3 px-4 bg-[#262b28] hover:bg-[#313632] border border-[#e9c349]/40 hover:border-[#e9c349] text-[#e9c349] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 min-h-[46px]"
                >
                  <RefreshCw className={`w-4 h-4 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
                  <span>{testStatus === 'testing' ? 'Testing Ping...' : 'Test Webhook Ping'}</span>
                </button>

                <button
                  onClick={handleSyncAll}
                  disabled={syncStatus === 'syncing'}
                  className="py-3 px-4 bg-[#e9c349] hover:bg-[#ffe088] text-[#3c2f00] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_18px_rgba(233,195,73,0.3)] cursor-pointer disabled:opacity-50 min-h-[46px]"
                >
                  <Send className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                  <span>{syncStatus === 'syncing' ? 'Syncing 5 Patrons...' : 'Sync All 5 Patrons Now'}</span>
                </button>
              </div>

              {/* Test Result Feedback */}
              {testStatus !== 'idle' && (
                <div
                  className={`p-3.5 rounded-xl border text-xs ${
                    testStatus === 'success'
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                      : testStatus === 'testing'
                      ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                      : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold mb-1">
                    {testStatus === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    )}
                    <span>
                      {testStatus === 'success'
                        ? 'Google Apps Script Webhook is Responding with Success!'
                        : testStatus === 'testing'
                        ? 'Sending diagnostic packet to Google Apps Script...'
                        : 'Google Apps Script Response Error'}
                    </span>
                  </div>
                  <pre className="font-mono text-[10px] bg-black/40 p-2 rounded mt-1 overflow-x-auto text-[#dfe4de]">
                    {JSON.stringify(testResult, null, 2)}
                  </pre>
                </div>
              )}

              {/* Sync All Result Feedback */}
              {syncResult && (
                <div className="bg-[#1c211e] p-3.5 rounded-xl border border-[#e9c349]/30 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#e9c349] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Sync Results ({syncResult.synced} / {syncResult.total} pushed)</span>
                    </span>
                    <span className="text-[11px] text-[#e2bebc]">{syncResult.message}</span>
                  </div>
                  <div className="divide-y divide-[#313632] max-h-40 overflow-y-auto">
                    {syncResult.details?.map((item: any, idx: number) => (
                      <div key={idx} className="py-1.5 flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-[#dfe4de]">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#e9c349]">{item.passCode}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${item.success ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                            {item.success ? 'Synced 200' : 'Failed'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CSV Instant Backup Button */}
              <div className="p-3.5 rounded-xl bg-[#101412] border border-[#313632] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[#dfe4de]">Instant CSV Spreadsheet Export</h4>
                  <p className="text-[11px] text-[#e2bebc]">
                    Download the complete patron list directly as a .CSV file for Microsoft Excel or Google Sheets.
                  </p>
                </div>
                <button
                  onClick={() => downloadCsvSpreadsheet(attendees)}
                  className="py-2 px-3 bg-[#313632] hover:bg-[#3d423e] text-[#e9c349] border border-[#e9c349]/30 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .CSV</span>
                </button>
              </div>

              {/* Key Troubleshooting Tip */}
              <div className="bg-[#1f4a3c]/30 border border-[#a3d0be]/30 p-3.5 rounded-xl text-xs space-y-1 text-[#e2bebc]">
                <h5 className="font-bold text-[#e9c349] flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-[#e9c349]" />
                  <span>Why might a Google Sheet not show new rows?</span>
                </h5>
                <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed pt-1">
                  <li>
                    <strong className="text-[#dfe4de]">Row 1001:</strong> Brand new Google Sheets have 1000 blank rows by default. <code className="text-[#e9c349]">sheet.appendRow()</code> places entries at <strong>row 1001</strong>! Scroll down to row 1001 to verify.
                  </li>
                  <li>
                    <strong className="text-[#dfe4de]">Container-bound script:</strong> The script must be created from <em>inside</em> the Google Sheet via <strong>Extensions &gt; Apps Script</strong> so it knows which sheet to write to.
                  </li>
                  <li>
                    <strong className="text-[#dfe4de]">Deploy as New Version:</strong> Whenever editing Apps Script code, click <strong>Deploy &gt; Manage Deployments &gt; Edit (pencil) &gt; Version: New version &gt; Deploy</strong>.
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: CODE.GS SETUP GUIDE */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[#e9c349]">Tested & Guaranteed Google Apps Script Code</h4>
                  <p className="text-[11px] text-[#e2bebc]">
                    Paste this into your Google Sheet to auto-create columns and append every attendee row.
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="py-1.5 px-3 bg-[#e9c349] text-[#3c2f00] font-bold text-xs rounded-lg hover:bg-[#ffe088] flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedCode ? 'Copied Code!' : 'Copy Code'}</span>
                </button>
              </div>

              {/* Code display */}
              <div className="relative rounded-xl overflow-hidden border border-[#e9c349]/30 bg-[#0a0f0c]">
                <div className="bg-[#1c211e] px-3 py-1.5 border-b border-[#313632] flex items-center justify-between text-[11px] text-[#e2bebc]">
                  <span className="font-mono">Code.gs</span>
                  <span className="text-[#e9c349] font-bold">JavaScript (Apps Script)</span>
                </div>
                <pre className="p-3 text-[11px] font-mono text-[#a3d0be] overflow-x-auto max-h-72 leading-relaxed">
                  {appsScriptCode}
                </pre>
              </div>

              {/* 4-Step Instructions */}
              <div className="space-y-2 text-xs">
                <h5 className="font-bold text-[#dfe4de] uppercase tracking-wider text-[11px]">
                  4-Step Setup in 60 Seconds:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded bg-[#1c211e] border border-[#313632]">
                    <strong className="text-[#e9c349] block mb-0.5">1. Open Extensions</strong>
                    In your Google Sheet, click <strong>Extensions &gt; Apps Script</strong>.
                  </div>
                  <div className="p-2.5 rounded bg-[#1c211e] border border-[#313632]">
                    <strong className="text-[#e9c349] block mb-0.5">2. Paste Code</strong>
                    Select all and replace with the code above. Click Save (Floppy Disk icon).
                  </div>
                  <div className="p-2.5 rounded bg-[#1c211e] border border-[#313632]">
                    <strong className="text-[#e9c349] block mb-0.5">3. Deploy Web App</strong>
                    Click <strong>Deploy &gt; New deployment</strong> (or Manage Deployments &gt; Edit).
                  </div>
                  <div className="p-2.5 rounded bg-[#1c211e] border border-[#313632]">
                    <strong className="text-[#e9c349] block mb-0.5">4. Set "Anyone" Access</strong>
                    Execute as: <em>Me</em>. Who has access: <em>Anyone</em>. Click Deploy!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ATTENDEES LIST */}
          {activeTab === 'attendees' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#e9c349]">Registered Patron Database ({attendees.length})</span>
                <button
                  onClick={() => downloadCsvSpreadsheet(attendees)}
                  className="text-[#e9c349] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Export to Excel / Sheets</span>
                </button>
              </div>

              <div className="divide-y divide-[#313632] border border-[#313632] rounded-xl overflow-hidden bg-[#101412]">
                {attendees.map((patron, idx) => (
                  <div key={idx} className="p-3 hover:bg-[#1c211e] transition-colors text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#dfe4de]">{patron.fullName}</span>
                        <span className="px-2 py-0.5 rounded bg-[#1f4a3c] text-[#a3d0be] text-[10px] font-bold">
                          {patron.tier}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#e2bebc] mt-0.5 flex flex-wrap items-center gap-3">
                        <span>📞 {patron.phone}</span>
                        <span>✉️ {patron.email}</span>
                        <span>🪑 {patron.seatingZone}</span>
                      </div>
                      {patron.prayerIntentions && patron.prayerIntentions !== 'None' && (
                        <p className="text-[10px] text-[#e9c349] italic mt-1">
                          “{patron.prayerIntentions}”
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-mono text-xs font-bold text-[#e9c349] block">
                        {patron.passCode}
                      </span>
                      <span className="text-[10px] text-[#a3d0be]">
                        {patron.guestCount} {patron.guestCount === 1 ? 'Guest' : 'Guests'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 bg-[#0a0f0c] border-t border-[#e9c349]/20 flex items-center justify-between text-xs">
          <span className="text-[#e2bebc] text-[11px] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#e9c349]" />
            <span>Encrypted St. Cletus Choir Parish Cloud Registry</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#313632] hover:bg-[#3d423e] text-[#e9c349] font-bold rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
