import { useCallback, useState, useRef } from 'react';
import { Upload, FileText, File, Image, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedDocumentUploadProps {
  onFileUpload: (content: string, filename: string, type: string) => void;
  isProcessing: boolean;
}

interface FilePreview {
  file: File;
  preview?: string;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
}

export const EnhancedDocumentUpload = ({ onFileUpload, isProcessing }: EnhancedDocumentUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const simulateProgress = (fileIndex: number) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles(prev => prev.map((f, i) => 
          i === fileIndex ? { ...f, progress: 100, status: 'complete' } : f
        ));
      } else {
        setFiles(prev => prev.map((f, i) => 
          i === fileIndex ? { ...f, progress } : f
        ));
      }
    }, 100);
  };

  const processFile = async (file: File, fileIndex: number) => {
    try {
      setFiles(prev => prev.map((f, i) => 
        i === fileIndex ? { ...f, status: 'processing' } : f
      ));

      const fileType = file.type;
      let content = '';
      
      if (fileType === 'text/plain') {
        content = await file.text();
      } else if (fileType === 'application/pdf') {
        content = 'PDF processing coming soon...';
        toast({
          title: "PDF Support",
          description: "PDF text extraction will be implemented in the next update.",
          variant: "default",
        });
        return;
      } else if (fileType.includes('word') || fileType.includes('document') || 
                 fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                 fileType === 'application/msword') {
        try {
          const mammoth = await import('mammoth');
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          content = result.value;
          
          if (result.messages.length > 0) {
            console.warn('Word document processing warnings:', result.messages);
          }
        } catch (error) {
          toast({
            title: "Word Document Error",
            description: "Failed to process Word document. Please try converting to TXT format.",
            variant: "destructive",
          });
          return;
        }
      } else if (fileType.includes('presentation') || 
                 fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
                 fileType === 'application/vnd.ms-powerpoint') {
        content = 'PowerPoint processing coming soon...';
        toast({
          title: "PowerPoint Support",
          description: "PowerPoint text extraction will be implemented in the next update.",
          variant: "default",
        });
        return;
      } else {
        content = await file.text();
      }

      onFileUpload(content, file.name, fileType);
      
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been processed and loaded.`,
      });

      // Clear files after successful upload
      setTimeout(() => {
        setFiles([]);
      }, 2000);

    } catch (error) {
      setFiles(prev => prev.map((f, i) => 
        i === fileIndex ? { ...f, status: 'error' } : f
      ));
      toast({
        title: "Upload failed",
        description: "Failed to process the uploaded file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFiles = (fileList: FileList | File[]) => {
    const newFiles = Array.from(fileList).map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const
    }));

    setFiles(newFiles);

    newFiles.forEach((filePreview, index) => {
      simulateProgress(index);
      setTimeout(() => {
        processFile(filePreview.file, index);
      }, 1000);
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      handleFiles(fileList);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const fileList = e.dataTransfer.files;
    if (fileList.length > 0) {
      handleFiles(fileList);
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

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <File className="h-8 w-8 text-red-500" />;
    if (fileType.includes('word') || fileType.includes('document')) return <FileText className="h-8 w-8 text-blue-500" />;
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return <FileText className="h-8 w-8 text-orange-500" />;
    if (fileType.includes('image')) return <Image className="h-8 w-8 text-green-500" />;
    return <FileText className="h-8 w-8 text-muted-foreground" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Main Upload Area */}
      <Card
        className={cn(
          "relative border-2 border-dashed transition-all duration-300 cursor-pointer",
          isDragOver 
            ? "border-primary bg-primary/5 scale-[1.02] shadow-lg animate-glow" 
            : "border-document-border hover:border-primary/50 hover:bg-primary/2 hover:shadow-md",
          isProcessing && "opacity-50 cursor-not-allowed"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <motion.div 
          className="p-12 text-center"
          animate={isDragOver ? { scale: 1.05 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div 
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/20 mb-6"
            animate={isDragOver ? { rotate: 10 } : { rotate: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Upload className="h-10 w-10 text-primary" />
          </motion.div>
          
          <h3 className="text-xl font-semibold mb-3">Upload Your Document</h3>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Drag and drop your file here, or click to browse. Experience intelligent processing with our advanced AI engine.
          </p>
          
          <div className="flex gap-6 justify-center mb-8">
            {[
              { type: 'text/plain', label: 'TXT', color: 'text-blue-500' },
              { type: 'application/pdf', label: 'PDF', color: 'text-red-500' },
              { type: 'application/msword', label: 'DOC', color: 'text-green-500' },
              { type: 'application/vnd.ms-powerpoint', label: 'PPT', color: 'text-orange-500' },
            ].map((format, index) => (
              <motion.div 
                key={format.type} 
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`p-3 rounded-xl bg-muted/50 ${format.color}`}>
                  {getFileIcon(format.type)}
                </div>
                <span className="text-sm font-medium">{format.label}</span>
              </motion.div>
            ))}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            accept=".txt,.pdf,.doc,.docx,.ppt,.pptx"
            disabled={isProcessing}
            multiple
          />
          
          <Button 
            asChild 
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-200"
            disabled={isProcessing}
            size="lg"
          >
            <label htmlFor="file-upload" className="cursor-pointer">
              {isProcessing ? 'Processing...' : 'Choose Files'}
            </label>
          </Button>
          
          <p className="text-xs text-muted-foreground mt-6">
            Maximum file size: 10MB • Supports multiple files
          </p>
        </motion.div>
      </Card>

      {/* File Preview Area */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4 border-document-border">
              <h4 className="font-medium mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Processing Files
              </h4>
              <div className="space-y-3">
                {files.map((filePreview, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-lg border border-border/50 bg-background/50"
                  >
                    <div className="flex-shrink-0">
                      {getFileIcon(filePreview.file.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium truncate">
                          {filePreview.file.name}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(filePreview.file.size)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={filePreview.progress} 
                          className="flex-1 h-2"
                        />
                        <span className="text-xs font-mono">
                          {Math.round(filePreview.progress)}%
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1">
                        {filePreview.status === 'complete' && (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        )}
                        <span className="text-xs text-muted-foreground capitalize">
                          {filePreview.status}
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};