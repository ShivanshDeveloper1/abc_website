"use client";

import React, { useState } from 'react';
import { Loader2, Code2, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function BulkUploadPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleBulkSubmit = async () => {
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // 1. Local validation check to catch formatting errors before hitting server
      let parsedData;
      try {
        parsedData = JSON.parse(jsonInput);
      } catch (e) {
        throw new Error("Invalid JSON formatting. Please check commas, braces, and quotes.");
      }

      // 2. Transmit payload to backend
      const res = await fetch('/api/admin/bulk-upload-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedData),
      });

      const serverData = await res.json();

      if (!res.ok) {
        throw new Error(serverData.error || serverData.details || "Server rejected data layout.");
      }

      setStatus({ type: 'success', message: serverData.message });
      setJsonInput(''); // Clear terminal on successful write
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Sample placeholder schema layout shown directly to guide manual entry formatting
  const placeholderExample = `[\n  {\n    "title": "Physics Test A",\n    "examType": "JEE",\n    "duration": 60,\n    "difficulty": "moderate",\n    "questions": [\n      {\n        "subject": "Physics",\n        "question_text": "Sample text here",\n        "options": ["A", "B", "C", "D"],\n        "correct_answer": 0\n      }\n    ]\n  }\n]`;

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* Header Block */}
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Code2 className="text-red-500" size={32} /> Direct Database JSON Injector
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Paste raw JSON arrays containing complete quiz profiles to publish them instantly bypass-style into live database architectures.
          </p>
        </div>

        {/* Dynamic Status Notifications */}
        {status.message && (
          <div className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-semibold transition-all ${
            status.type === 'success' 
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' 
              : 'bg-rose-950/40 border-rose-500/30 text-rose-400'
          }`}>
            {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
            <span>{status.message}</span>
          </div>
        )}

        {/* JSON Code Area Terminal */}
        <div className="relative rounded-2xl border border-gray-800 bg-gray-950 p-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-3">
            <span className="text-xs tracking-wider text-gray-500 font-mono">INPUT_RAW_JSON_DATA</span>
            <button
              onClick={() => setJsonInput(placeholderExample)}
              className="text-xs text-gray-400 hover:text-white transition-colors bg-gray-900 px-2.5 py-1 rounded-md border border-gray-800"
            >
              Insert Template Sample
            </button>
          </div>

          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="[&#10;  {&#10;    &quot;title&quot;: &quot;Kinematics Revision Quiz&quot;,&#10;    &quot;examType&quot;: &quot;JEE&quot;, ...&#10;  }&#10;]"
            className="w-full h-96 bg-transparent text-sm font-mono text-emerald-400 focus:outline-none resize-none leading-relaxed placeholder:text-gray-700"
            disabled={loading}
          />
        </div>

        {/* Process Control Execution Panel */}
        <div className="flex justify-end">
          <button
            onClick={handleBulkSubmit}
            disabled={loading || !jsonInput.trim()}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:hover:bg-red-600 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-red-900/30"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Parsing & Writing to MongoDB...
              </>
            ) : (
              "Execute Bulk Upload Engine"
            )}
          </button>
        </div>

      </div>
    </main>
  );
}