'use client'

import { useState } from 'react'
import { Plus, Trash2, GripVertical, Edit2, Check, X } from 'lucide-react'
import { FormQuestion } from '@/lib/forms'

interface FormBuilderProps {
  initialQuestions: FormQuestion[]
  onUpdate: (questions: FormQuestion[]) => void
}

export function FormBuilder({ initialQuestions, onUpdate }: FormBuilderProps) {
  const [questions, setQuestions] = useState<FormQuestion[]>(initialQuestions)
  const [editingId, setEditingId] = useState<string | null>(null)

  const addQuestion = () => {
    const newQuestion: FormQuestion = {
      id: `question_${Date.now()}`,
      question: 'New Question',
      type: 'text',
      required: true,
      order: questions.length + 1
    }
    const updated = [...questions, newQuestion]
    setQuestions(updated)
    onUpdate(updated)
    setEditingId(newQuestion.id)
  }

  const updateQuestion = (id: string, updates: Partial<FormQuestion>) => {
    const updated = questions.map(q => 
      q.id === id ? { ...q, ...updates } : q
    )
    setQuestions(updated)
    onUpdate(updated)
  }

  const deleteQuestion = (id: string) => {
    const updated = questions.filter(q => q.id !== id).map((q, idx) => ({
      ...q,
      order: idx + 1
    }))
    setQuestions(updated)
    onUpdate(updated)
  }

  const moveQuestion = (id: string, direction: 'up' | 'down') => {
    const index = questions.findIndex(q => q.id === id)
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === questions.length - 1)
    ) {
      return
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const updated = [...questions]
    const [movedItem] = updated.splice(index, 1)
    updated.splice(newIndex, 0, movedItem)
    
    // Update order
    const reordered = updated.map((q, idx) => ({ ...q, order: idx + 1 }))
    setQuestions(reordered)
    onUpdate(reordered)
  }

  const addOption = (questionId: string) => {
    const question = questions.find(q => q.id === questionId)
    if (!question) return

    const currentOptions = question.options || []
    const newOption = `Option ${currentOptions.length + 1}`
    
    updateQuestion(questionId, {
      options: [...currentOptions, newOption]
    })
  }

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = questions.find(q => q.id === questionId)
    if (!question || !question.options) return

    const updated = [...question.options]
    updated[optionIndex] = value
    
    updateQuestion(questionId, { options: updated })
  }

  const deleteOption = (questionId: string, optionIndex: number) => {
    const question = questions.find(q => q.id === questionId)
    if (!question || !question.options) return

    const updated = question.options.filter((_, idx) => idx !== optionIndex)
    updateQuestion(questionId, { options: updated })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Form Questions</h3>
        <button
          onClick={addQuestion}
          className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Question
        </button>
      </div>

      <div className="space-y-3">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className="rounded-lg border-2 border-gray-200 bg-white p-4 hover:border-gray-300 transition-colors"
          >
            {/* Question Header */}
            <div className="flex items-start gap-3 mb-3">
              <div className="flex flex-col gap-1 mt-1">
                <button
                  onClick={() => moveQuestion(question.id, 'up')}
                  disabled={index === 0}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <GripVertical className="h-4 w-4 rotate-180" />
                </button>
                <button
                  onClick={() => moveQuestion(question.id, 'down')}
                  disabled={index === questions.length - 1}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <GripVertical className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1">
                {editingId === question.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Question text"
                      autoFocus
                    />

                    <div className="flex gap-3">
                      <select
                        value={question.type}
                        onChange={(e) => updateQuestion(question.id, { 
                          type: e.target.value as FormQuestion['type'],
                          options: e.target.value === 'dropdown' ? ['Option 1'] : undefined
                        })}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="text">Short Text</option>
                        <option value="textarea">Long Text</option>
                        <option value="dropdown">Dropdown</option>
                        <option value="number">Number</option>
                      </select>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={question.required}
                          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">Required</span>
                      </label>
                    </div>

                    {/* Dropdown Options */}
                    {question.type === 'dropdown' && (
                      <div className="space-y-2 pl-4 border-l-2 border-blue-200">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-600">Options:</span>
                          <button
                            onClick={() => addOption(question.id)}
                            className="text-xs text-blue-600 hover:text-blue-700"
                          >
                            + Add Option
                          </button>
                        </div>
                        {question.options?.map((option, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(question.id, optIdx, e.target.value)}
                              className="flex-1 rounded-md border border-input bg-background px-2 py-1 text-sm"
                              placeholder={`Option ${optIdx + 1}`}
                            />
                            <button
                              onClick={() => deleteOption(question.id, optIdx)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                      >
                        <Check className="h-3 w-3" />
                        Done
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{question.question}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {question.type}
                          </span>
                          {question.required && (
                            <span className="text-xs text-red-600">Required</span>
                          )}
                        </div>
                        {question.type === 'dropdown' && question.options && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {question.options.map((opt, idx) => (
                              <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                {opt}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditingId(question.id)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteQuestion(question.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {questions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No questions yet. Click "Add Question" to get started.</p>
        </div>
      )}
    </div>
  )
}