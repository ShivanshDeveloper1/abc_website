"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';

const AdminQuizEditor = () => {
  const [quizList, setQuizList] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch only titles on mount
  useEffect(() => {
    fetch('/api/admin/edit-quizzes')
      .then(res => res.json())
      .then(data => {
        setQuizList(data);
        setLoading(false);
      });
  }, []);

  // Fetch full quiz data when a title is clicked
  const handleSelectQuiz = async (id) => {
    setLoading(true);
    const res = await fetch(`/api/admin/edit-quizzes/${id}`);
    const data = await res.json();
    setSelectedQuiz(data);
    setLoading(false);
  };

  // Handle changes to a specific question
  const handleQuestionChange = (index, field, value) => {
    const updatedQuiz = { ...selectedQuiz };
    updatedQuiz.questions[index][field] = value;
    setSelectedQuiz(updatedQuiz);
  };

  // Handle changes to an option within a specific question
  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuiz = { ...selectedQuiz };
    updatedQuiz.questions[qIndex].options[optIndex] = value;
    setSelectedQuiz(updatedQuiz);
  };

  // Save the entire updated quiz back to the database
  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/admin/edit-quizzes/${selectedQuiz._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedQuiz)
      });
      alert('Quiz updated successfully!');
    } catch (error) {
      alert('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !quizList.length) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-red-600" /></div>;
  }

  return (
    <main className='min-h-screen flex bg-gray-50'>
      
      {/* LEFT SIDEBAR - Quiz Titles */}
      <aside className="w-1/4 bg-white border-r border-gray-200 overflow-y-auto h-screen p-4">
        <h2 className="text-xl font-bold mb-4">All Quizzes</h2>
        <div className="space-y-2">
          {quizList.map((q) => (
            <button
              key={q._id}
              onClick={() => handleSelectQuiz(q._id)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                selectedQuiz?._id === q._id ? 'bg-red-50 border-red-200 text-red-700 font-medium' : 'bg-white hover:bg-gray-50'
              }`}
            >
              {q.title}
            </button>
          ))}
        </div>
      </aside>

      {/* MAIN CONTENT - Edit Area */}
      <section className="w-3/4 p-8 h-screen overflow-y-auto">
        {!selectedQuiz ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a quiz from the sidebar to start editing.
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Header / Save Button */}
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h1 className="text-2xl font-bold text-gray-800">{selectedQuiz.title}</h1>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                Save Changes
              </button>
            </div>

            {/* Questions Editor */}
            <div className="space-y-6">
              {selectedQuiz.questions.map((question, qIndex) => (
                <div key={question._id || qIndex} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                      Q{qIndex + 1}
                    </span>
                    <input 
                      type="text" 
                      value={question.subject}
                      onChange={(e) => handleQuestionChange(qIndex, 'subject', e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded px-3 py-1 text-sm font-medium focus:outline-red-500"
                      placeholder="Subject"
                    />
                  </div>

                  <textarea
                    value={question.question_text}
                    onChange={(e) => handleQuestionChange(qIndex, 'question_text', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:outline-red-500"
                    rows={3}
                  />

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {question.options.map((opt, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-3">
                        {/* Radio to select the correct answer */}
                        <input 
                          type="radio" 
                          name={`correct-${qIndex}`}
                          checked={question.correct_answer === optIndex}
                          onChange={() => handleQuestionChange(qIndex, 'correct_answer', optIndex)}
                          className="w-5 h-5 text-red-600 focus:ring-red-500 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                          className="flex-1 p-2 border border-gray-200 rounded focus:outline-red-500"
                        />
                      </div>
                    ))}
                  </div>
                  
                  <textarea
                    value={question.explanation || ''}
                    onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                    className="w-full p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-sm focus:outline-blue-400"
                    placeholder="Explanation (Optional)"
                    rows={2}
                  />
                </div>
              ))}
            </div>

          </div>
        )}
      </section>
    </main>
  );
};

export default AdminQuizEditor;