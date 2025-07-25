import { useCallback, useState } from 'react';
import { Upload, FileText, File, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface DocumentUploadProps {
  onFileUpload: (content: string, filename: string, type: string) => void;
  isProcessing: boolean;
}

export const DocumentUpload = ({ onFileUpload, isProcessing }: DocumentUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const processFile = async (file: File) => {
    try {
      const fileType = file.type;
      let content = '';
      
      if (fileType === 'text/plain') {
        content = await file.text();
      } else if (fileType === 'application/pdf') {
        // Basic PDF text extraction would go here
        content = 'PDF processing coming soon...';
        toast({
          title: "PDF Support",
          description: "PDF text extraction will be implemented in the next update.",
          variant: "default",
        });
        return;
      } else if (fileType.includes('word') || fileType.includes('document')) {
        // Word document processing would go here
        content = 'Word document processing coming soon...';
        toast({
          title: "Word Document Support",
          description: "Word document processing will be implemented in the next update.",
          variant: "default",
        });
        return;
      } else {
        // Try to read as text for other formats
        content = await file.text();
      }

      onFileUpload(content, file.name, fileType);
      
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been processed and loaded.`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to process the uploaded file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <File className="h-8 w-8 text-red-500" />;
    if (fileType.includes('word') || fileType.includes('document')) return <FileText className="h-8 w-8 text-blue-500" />;
    if (fileType.includes('image')) return <Image className="h-8 w-8 text-green-500" />;
    return <FileText className="h-8 w-8 text-muted-foreground" />;
  };

  return (
    <Card
      className={cn(
        "relative border-2 border-dashed transition-all duration-200 cursor-pointer",
        isDragOver 
          ? "border-primary bg-primary/5 scale-[1.02]" 
          : "border-document-border hover:border-primary/50 hover:bg-primary/2",
        isProcessing && "opacity-50 cursor-not-allowed"
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        
        <h3 className="text-lg font-semibold mb-2">Upload Your Document</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Drag and drop your file here, or click to browse. Supports TXT, PDF, Word documents, and more.
        </p>
        
        <div className="flex gap-4 justify-center mb-6">
          {[
            { type: 'text/plain', label: 'TXT' },
            { type: 'application/pdf', label: 'PDF' },
            { type: 'application/msword', label: 'DOC' },
          ].map((format) => (
            <div key={format.type} className="flex flex-col items-center gap-1">
              {getFileIcon(format.type)}
              <span className="text-xs text-muted-foreground">{format.label}</span>
            </div>
          ))}
        </div>
        
        <input
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
          accept=".txt,.pdf,.doc,.docx"
          disabled={isProcessing}
        />
        
        <Button 
          asChild 
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          disabled={isProcessing}
        >
          <label htmlFor="file-upload" className="cursor-pointer">
            {isProcessing ? 'Processing...' : 'Choose File'}
          </label>
        </Button>
        
        <p className="text-xs text-muted-foreground mt-4">
          Maximum file size: 10MB
        </p>
      </div>
    </Card>
  );
};