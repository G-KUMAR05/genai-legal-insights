import { Checkbox } from '@/components/ui/checkbox';

interface Settings {
  futureScenarios: boolean;
  suggestChanges: boolean;
  highlightDates: boolean;
}

interface AnalysisSettingsProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

const AnalysisSettings = ({ settings, onSettingsChange }: AnalysisSettingsProps) => {
  const handleChange = (key: keyof Settings) => {
    onSettingsChange({
      ...settings,
      [key]: !settings[key],
    });
  };

  return (
    <div className="bg-card rounded-lg p-4 border border-border">
      <h3 className="font-semibold mb-4">Analysis Settings</h3>
      
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <Checkbox 
            checked={settings.futureScenarios}
            onCheckedChange={() => handleChange('futureScenarios')}
          />
          <span className="text-sm">Include future-scenarios ("Future you")</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <Checkbox 
            checked={settings.suggestChanges}
            onCheckedChange={() => handleChange('suggestChanges')}
          />
          <span className="text-sm">Suggest contract changes</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <Checkbox 
            checked={settings.highlightDates}
            onCheckedChange={() => handleChange('highlightDates')}
          />
          <span className="text-sm">Highlight important dates & places</span>
        </label>
      </div>
    </div>
  );
};

export default AnalysisSettings;
