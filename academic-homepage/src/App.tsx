import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import HomePage from '@/pages/HomePage';
import PaperDetailPage from '@/pages/PaperDetailPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import CVPage from '@/pages/CVPage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/papers/:id" element={<PaperDetailPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/cv" element={<CVPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
