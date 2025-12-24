import { useState } from 'react';
import ComplianceGauge from './ComplianceGauge';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AnalysisResult {
  summary: string;
  justification: string;
  score: number;
  risks: string[];
  recommendations: string[];
}

interface AnalysisTabsProps {
  result: AnalysisResult | null;
}

const AnalysisTabs = ({ result }: AnalysisTabsProps) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);

  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'risk', label: 'Risk' },
    { id: 'recommendation', label: 'Recommendation' },
    { id: 'qa', label: 'QA Chat' },
  ];

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    setChatMessages([
      ...chatMessages,
      { role: 'user', content: chatInput },
      { role: 'assistant', content: 'This is a demo response. Connect to the backend API for real AI responses.' },
    ]);
    setChatInput('');
  };

  const renderContent = () => {
    if (!result) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <p>Upload a document and click "Analyze" to see results</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'summary':
        return (
          <div className="flex gap-8">
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Document Summary</h3>
                <p className="text-muted-foreground leading-relaxed">{result.summary}</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Justification</h3>
                <p className="text-muted-foreground leading-relaxed">{result.justification}</p>
              </div>
            </div>
            
            <div className="shrink-0">
              <ComplianceGauge score={result.score} />
            </div>
          </div>
        );

      case 'risk':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Risk Analysis</h3>
            {result.risks.length > 0 ? (
              <ul className="space-y-3">
                {result.risks.map((risk, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                    <span className="w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-sm shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-muted-foreground">{risk}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No significant risks identified.</p>
            )}
          </div>
        );

      case 'recommendation':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Recommendations</h3>
            {result.recommendations.length > 0 ? (
              <ul className="space-y-3">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-muted-foreground">{rec}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No recommendations at this time.</p>
            )}
          </div>
        );

      case 'qa':
        return (
          <div className="flex flex-col h-96">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {chatMessages.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Ask questions about the analyzed document
                </p>
              ) : (
                chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg max-w-[80%] ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-card border border-border'
                    }`}
                  >
                    {msg.content}
                  </div>
                ))
              )}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask a question about the document..."
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex gap-6 border-b border-border mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === tab.id ? 'tab-active' : 'tab-inactive'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default AnalysisTabs;
