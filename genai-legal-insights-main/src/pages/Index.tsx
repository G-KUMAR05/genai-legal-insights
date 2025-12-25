import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import AnalysisSettings from '@/components/AnalysisSettings';
import AnalysisTabs from '@/components/AnalysisTabs';
import { useToast } from '@/hooks/use-toast';

interface AnalysisResult {
  summary: string;
  justification: string;
  score: number;
  risks: string[];
  recommendations: string[];
}

interface Settings {
  futureScenarios: boolean;
  suggestChanges: boolean;
  highlightDates: boolean;
}

const Index = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [settings, setSettings] = useState<Settings>({
    futureScenarios: true,
    suggestChanges: true,
    highlightDates: true,
  });

  const handleFileUpload = async () => {
    if (files.length === 0) {
      toast({
        title: 'No files selected',
        description: 'Please upload at least one document to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });
      formData.append('settings', JSON.stringify(settings));

      // API call to backend
      const response = await fetch('https://legal-mini.onrender.com', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setAnalysisResult(data);
      
      toast({
        title: 'Analysis Complete',
        description: 'Your document has been analyzed successfully.',
      });
    } catch (error) {
      // For demo purposes, show mock data when backend is unavailable
      console.log('Backend unavailable, using mock data');
      
      setAnalysisResult({
        summary: "This document is a resume for Kumar G, who is seeking a Digital Business Marketing Apprenticeship at Google Operations Center. He highlights his skills in digital marketing, data analysis, and technology, emphasizing his experience leading teams, developing websites, and managing projects related to data analysis and marketing.",
        justification: "The resume presents relevant skills and experience for the target role and doesn't contain any obvious red flags.",
        score: 90,
        risks: [
          "No formal certifications mentioned for digital marketing claims",
          "Limited verifiable work experience duration",
        ],
        recommendations: [
          "Add specific metrics and KPIs achieved in previous roles",
          "Include relevant certifications (Google Analytics, Google Ads)",
          "Provide portfolio links or case studies",
        ],
      });

      toast({
        title: 'Demo Mode',
        description: 'Backend unavailable. Showing sample analysis results.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setFiles([]);
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-[30%] min-w-[320px] max-w-[400px] p-6 border-r border-border space-y-6">
          <FileUpload
            files={files}
            onFilesChange={setFiles}
            onAnalyze={handleFileUpload}
            onClear={handleClear}
            isAnalyzing={isAnalyzing}
          />

          <AnalysisSettings
            settings={settings}
            onSettingsChange={setSettings}
          />
        </aside>

        {/* Main Content */}
        <section className="flex-1 p-6">
          <AnalysisTabs result={analysisResult} />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
