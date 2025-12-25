import { useState, useRef, DragEvent } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onAnalyze: () => void;
  onClear: () => void;
  isAnalyzing: boolean;
}

const FileUpload = ({ files, onFilesChange, onAnalyze, onClear, isAnalyzing }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => 
      file.type === 'application/pdf' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'text/plain'
    );
    
    onFilesChange([...files, ...validFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      onFilesChange([...files, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={`drag-zone cursor-pointer ${isDragging ? 'active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
        <p className="text-foreground font-medium mb-1">Drag & drop PDF, DOCX, or TXT here</p>
        <Button 
          variant="secondary" 
          size="sm" 
          className="mt-3"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          Choose File
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx,.txt"
          multiple
          onChange={handleFileSelect}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          className="flex-1"
          onClick={onAnalyze}
          disabled={files.length === 0 || isAnalyzing}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze'}
        </Button>
        <Button 
          variant="secondary"
          className="flex-1"
          onClick={onClear}
          disabled={files.length === 0}
        >
          Clear
        </Button>
      </div>

      {/* Separator */}
      <div className="border-t border-border" />

      {/* Files List */}
      <div>
        <h3 className="font-semibold mb-3">Files</h3>
        {files.length === 0 ? (
          <p className="text-muted-foreground text-sm">No files uploaded</p>
        ) : (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-2 bg-card rounded-lg"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileText className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm truncate">{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="text-muted-foreground text-xs mt-3 italic">
          Tip: for best results use searchable PDFs or upload original DOCX.
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
