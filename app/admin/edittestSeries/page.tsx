"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Save, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

const AdminQuizEditor = () => {
  const [quizList, setQuizList] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImageIndex, setUploadingImageIndex] = useState(null);

  useEffect(() => {
    fetch('/api/admin/edit-quizzes',{
      cache:'no-store'
    })
      .then(res => res.json())
      .then(data => {
        setQuizList(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load quizzes", err);
        setLoading(false);
      });
  }, []);

  const handleSelectQuiz = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/edit-quizzes/${id}`,{
        cache:'no-store'
      });
      const data = await res.json();
      setSelectedQuiz(data);
    } catch (error) {
      alert("Failed to load quiz details.");
    } finally {
      setLoading(false);
    }
  };

const handleQuestionChange = (index, field, value) => {
  setSelectedQuiz((prevQuiz) => ({
    ...prevQuiz,
    questions: prevQuiz.questions.map((q, i) => 
      i === index ? { ...q, [field]: value } : q
    )
  }));
};


  // ✅ CORRECTED: Deep copying the question AND the specific options array
const handleOptionChange = (qIndex, optIndex, value) => {
  setSelectedQuiz((prevQuiz) => ({
    ...prevQuiz,
    questions: prevQuiz.questions.map((q, i) => {
      if (i === qIndex) {
        const updatedOptions = [...q.options];
        updatedOptions[optIndex] = value;
        return { ...q, options: updatedOptions };
      }
      return q;
    })
  }));
};

  const handleAddQuestion = () => {
    if (!selectedQuiz) return;
    const newQuestion = {
      subject: '',
      question_text: '',
      options: ['', '', '', ''],
      correct_answer: 0,
      imageUrl: '',
      explanation: ''
    };
    setSelectedQuiz({
      ...selectedQuiz,
      questions: [...selectedQuiz.questions, newQuestion]
    });
  };

  const handleDeleteQuestion = (index) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    const updatedQuestions = [...selectedQuiz.questions];
    updatedQuestions.splice(index, 1);
    setSelectedQuiz({ ...selectedQuiz, questions: updatedQuestions });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
  const res =    await fetch(`/api/admin/edit-quizzes/${selectedQuiz._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedQuiz)
      });
      const data = await res.json()
      console.log("SAVE RESPONSES ->", data)

      if(!res.ok){
        throw new Error(data.error)
      }
        setSelectedQuiz(data.quiz);

        




      alert('Quiz updated successfully!');
    } catch (error) {
      alert('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (qIndex, file) => {
    if (!file) return;

    setUploadingImageIndex(qIndex); 

    const formData = new FormData();
    formData.append('file', file); 

    try {
      const res = await fetch('/api/admin/upload-image', {
        method: 'POST', 
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      

      if (data.secure_url) {
        handleQuestionChange(qIndex, 'imageUrl', data.secure_url);
      } else {
        alert('Upload failed. Server did not return image URL.');
      }   
    } catch (error) {
      console.error("Upload error", error);
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      setUploadingImageIndex(null); 
    }
  };

  if (loading && !quizList.length) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin text-red-600 w-10 h-10" />
      </div>
    );
  }

  return (
    <main className='min-h-screen flex bg-gray-50 text-gray-800 font-sans'>
      
      {/* LEFT SIDEBAR - Quiz Titles */}
      <aside className="w-1/4 bg-white border-r border-gray-200 overflow-y-auto h-screen p-4 sticky top-0">
        <h2 className="text-xl font-bold mb-4 tracking-tight text-gray-900">All Quizzes</h2>
        <div className="space-y-2">
          {quizList.map((q) => (
            <button
              key={q._id}
              onClick={() => handleSelectQuiz(q._id)}
              className={`w-full text-left p-3 rounded-lg border transition-all text-sm ${
                selectedQuiz?._id === q._id 
                  ? 'bg-red-50 border-red-300 text-red-700 font-semibold shadow-sm' 
                  : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
              }`}
            >
        <span>{q.title}</span>   
        {/* 🟢 Status indicator dot */}
        <span className='text-xs'>{q.isLocked ? "🔴" : "🟢"}</span>   
            </button>
          ))}
        </div>
      </aside>
      {/* MAIN CONTENT - Edit Area */}
      <section className="w-3/4 p-8 h-screen overflow-y-auto">
        {!selectedQuiz ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
            <p className="text-lg font-medium">No Quiz Selected</p>
            <p className="text-sm">Select a quiz from the left sidebar to start modifying questions.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6 pb-16">
            
            {/* Header / Save Button */}
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-0 z-10">
              <div>
                <span className="text-xs font-bold text-red-600 tracking-wider uppercase">Currently Editing</span>
                <h1 className="text-2xl font-bold text-gray-900 mt-0.5">{selectedQuiz.title}</h1>
                {/* ADD THIS DROPDOWN FOR CLASS LEVEL */}
                <div className='mt-2'>
                  <label className='text-xs font-bold text-gray-500 uppercase mr-2'>Target Class:</label>
                  <select 
              value={selectedQuiz.classLevel || ""}
        onChange={(e) => setSelectedQuiz({ ...selectedQuiz, classLevel: e.target.value })}
        className="bg-gray-50 border border-gray-300 rounded-md text-sm px-2 py-1 focus:ring-red-500"
                  >
                    <option value="">Select a Class...</option>
        <option value="Class 11">Class 11</option>
        <option value="Class 12">Class 12</option>
        <option value="Dropper">Dropper</option>
        <option value="Foundation">Foundation</option>
                  </select>
                </div>
              </div>


              {/* New Freeze Toggle Controls */}
<div className="flex items-center gap-2 mt-3 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 w-fit">
      <input
        type="checkbox"
        id="freezeQuiz"
        checked={selectedQuiz.isLocked || false}
        onChange={(e) => setSelectedQuiz({ ...selectedQuiz, isLocked: e.target.checked })}
        className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded cursor-pointer"
      />
      <label htmlFor="freezeQuiz" className="text-xs font-semibold text-gray-700 cursor-pointer select-none">
        {selectedQuiz.isLocked ? "🔴 Test is Frozen (Hidden/Locked)" : "🟢 Test is Active (Live for Students)"}
      </label>
    </div>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 shadow-sm"
              >
                {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                Save Changes
              </button>
            </div>

            {/* Questions Editor */}
            <div className="space-y-6">
              {selectedQuiz.questions?.map((question, qIndex) => (
                <div key={question._id || qIndex} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative group">
                  
                  {/* Top Panel */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-bold shadow-sm">
                        Q{qIndex + 1}
                      </span>
                      <input 
                        type="text" 
                        value={question.subject || ''}
                        onChange={(e) => handleQuestionChange(qIndex, 'subject', e.target.value)}
                        className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Subject (e.g., Math)"
                      />
                    </div>

                    <button
                      onClick={() => handleDeleteQuestion(qIndex)}
                      className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Question"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Question Text Inputs */}
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Question Prompt</label>
                    <textarea
                      value={question.question_text}
                      onChange={(e) => handleQuestionChange(qIndex, 'question_text', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base"
                      rows={3}
                      placeholder="Type your question prompt here..."
                    />
                  </div>

                  {/* Image Upload Block */}
                  <div className="mb-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <ImageIcon size={16} className="text-gray-500" />
                      <span>Question Media Asset (Optional)</span>
                    </div>

                    <div className="flex items-center gap-4 mt-1">
                      <input 
                        type="file" 
                        accept="image/*"
                        id={`file-upload-${qIndex}`}
                        onChange={(e) => handleImageUpload(qIndex, e.target.files[0])}
                        disabled={uploadingImageIndex === qIndex}
                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 cursor-pointer disabled:opacity-50"
                      />
                      
                      {uploadingImageIndex === qIndex && (
                        <div className="flex items-center gap-2 text-xs text-red-600 font-medium">
                          <Loader2 className="animate-spin" size={14} />
                          <span>Uploading image securely...</span>
                        </div>
                      )}
                    </div>

                    {/* Image Preview Window */}
                    {question.imageUrl && (
                      <div className="mt-2 relative inline-block border border-gray-200 rounded-lg p-1 bg-white max-w-xs">
                        <img src={question.imageUrl} alt="Uploaded block preview" className="h-32 w-auto object-contain rounded" />
                        <button 
                          type="button"
                          onClick={() => handleQuestionChange(qIndex, 'imageUrl', '')}
                          className="text-xs font-semibold text-red-500 mt-1.5 block hover:underline"
                        >
                          Remove Attached Image
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Options Input Grid */}
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Options</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['A', 'B', 'C', 'D'].map((letter, optIndex) => {
                        const isCorrect = question.correct_answer === optIndex;
                        return (
                          <div 
                            key={optIndex} 
                            className={`flex items-center gap-3 p-2.5 border rounded-lg transition-all ${
                              isCorrect 
                                ? 'border-green-500 bg-green-50/50 ring-1 ring-green-400' 
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <input 
                              type="radio" 
                              name={`correct-${qIndex}`}
                              checked={isCorrect}
                              onChange={() => handleQuestionChange(qIndex, 'correct_answer', optIndex)}
                              className="w-5 h-5 text-green-600 focus:ring-green-500 border-gray-300 cursor-pointer"
                            />
                            <span className="text-xs font-bold text-gray-400">{letter}.</span>
                            <input
                              type="text"
                              value={question.options?.[optIndex] || ''}
                              onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                              className="flex-1 bg-transparent focus:outline-none text-sm font-medium"
                              placeholder={`Option text value`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Explanation Component */}
                  <div className="mt-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Answer Explanation</label>
                    <textarea
                      value={question.explanation || ''}
                      onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                      className="w-full p-3 bg-blue-50/30 border border-blue-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Provide helpful hints or rationales..."
                      rows={2}
                    />
                  </div>

                </div>
              ))}
            </div>

            {/* Bottom Form Add Action */}
            <button
              type="button"
              onClick={handleAddQuestion}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-500 hover:text-red-600 hover:border-red-400 hover:bg-red-50/30 transition-all font-semibold text-sm"
            >
              <Plus size={18} />
              Append New Blank Question
            </button>

          </div>
        )}
      </section>
    </main>
  );
};

export default AdminQuizEditor;