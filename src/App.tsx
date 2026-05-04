import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import StageDetail from './pages/StageDetail'
import Bookmarks from './pages/Bookmarks'
import ProgressPage from './pages/ProgressPage'
import ConsultantPage from './pages/ConsultantPage'
import CeoPage from './pages/CeoPage'
import AIAssistantPage from './pages/AIAssistantPage'
import CustomContentPage from './pages/CustomContentPage'
import IndustryMapPage from './pages/IndustryMapPage'
import CustomerPracticesPage from './pages/CustomerPracticesPage'
import { useProgress } from './hooks/useProgress'
import { createContext, useContext } from 'react'
import type { BookmarkItem, NoteItem, ProgressData } from './types'

interface AppContextType {
  progress: ProgressData
  bookmarks: BookmarkItem[]
  notes: Record<string, NoteItem>
  markVisited: (id: string) => void
  markCompleted: (id: string) => void
  toggleBookmark: (item: Omit<BookmarkItem, 'savedAt'>) => void
  isBookmarked: (id: string) => boolean
  saveNote: (stageId: string, content: string) => void
  getNote: (stageId: string) => string
  resetProgress: () => void
}

export const AppContext = createContext<AppContextType>({} as AppContextType)
export const useAppContext = () => useContext(AppContext)

export default function App() {
  const progressUtils = useProgress()
  return (
    <AppContext.Provider value={progressUtils}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="stage/:stageId" element={<StageDetail />} />
          <Route path="bookmarks" element={<Bookmarks />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="consultant" element={<ConsultantPage />} />
          <Route path="ceo" element={<CeoPage />} />
          <Route path="ai-assistant" element={<AIAssistantPage />} />
          <Route path="custom-content" element={<CustomContentPage />} />
          <Route path="industry-map" element={<IndustryMapPage />} />
          <Route path="customer-practices" element={<CustomerPracticesPage />} />
        </Route>
      </Routes>
    </AppContext.Provider>
  )
}
