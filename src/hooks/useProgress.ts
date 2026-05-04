import { useLocalStorage } from './useLocalStorage'
import type { ProgressData, BookmarkItem, NoteItem } from '../types'

const INITIAL_PROGRESS: ProgressData = {
  visitedStages: [],
  completedStages: [],
  startedAt: Date.now(),
}

export function useProgress() {
  const [progress, setProgress] = useLocalStorage<ProgressData>('mfg-progress', INITIAL_PROGRESS)
  const [bookmarks, setBookmarks] = useLocalStorage<BookmarkItem[]>('mfg-bookmarks', [])
  const [notes, setNotes] = useLocalStorage<Record<string, NoteItem>>('mfg-notes', {})

  const markVisited = (stageId: string) => {
    setProgress(prev => ({
      ...prev,
      visitedStages: prev.visitedStages.includes(stageId)
        ? prev.visitedStages
        : [...prev.visitedStages, stageId],
      lastVisited: stageId,
    }))
  }

  const markCompleted = (stageId: string) => {
    setProgress(prev => ({
      ...prev,
      completedStages: prev.completedStages.includes(stageId)
        ? prev.completedStages.filter(id => id !== stageId)
        : [...prev.completedStages, stageId],
    }))
  }

  const toggleBookmark = (item: Omit<BookmarkItem, 'savedAt'>) => {
    setBookmarks(prev => {
      const exists = prev.find(b => b.id === item.id)
      if (exists) {
        return prev.filter(b => b.id !== item.id)
      }
      return [...prev, { ...item, savedAt: Date.now() }]
    })
  }

  const isBookmarked = (id: string) => bookmarks.some(b => b.id === id)

  const saveNote = (stageId: string, content: string) => {
    setNotes(prev => ({
      ...prev,
      [stageId]: { stageId, content, updatedAt: Date.now() },
    }))
  }

  const getNote = (stageId: string): string => notes[stageId]?.content || ''

  const resetProgress = () => {
    setProgress(INITIAL_PROGRESS)
  }

  return {
    progress,
    bookmarks,
    notes,
    markVisited,
    markCompleted,
    toggleBookmark,
    isBookmarked,
    saveNote,
    getNote,
    resetProgress,
  }
}
