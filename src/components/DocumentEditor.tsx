import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  List, 
  Download, 
  Wand2, 
  RefreshCw, 
  Eye, 
  Edit3,
  Copy,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { saveAs } from 'file-saver';

interface DocumentEditorProps {
  content: string;
  filename: string;
  onContentChange: (content: string) => void;
}

type ViewMode = 'document' | 'summary';
type ProcessingType = 'format' | 'summarize';

export const DocumentEditor = ({ content, filename, onContentChange }: DocumentEditorProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('document');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formattedContent, setFormattedContent] = useState('');
  const [summaryContent, setSummaryContent] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFormattedContent(content);
  }, [content]);

  const processContent = async (type: ProcessingType) => {
    setIsProcessing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (type === 'format') {
      // Basic formatting logic
      const formatted = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
          // Capitalize first letter of sentences
          return line.replace(/^\w/, char => char.toUpperCase());
        })
        .join('\n\n');
      
      setFormattedContent(formatted);
      toast({
        title: "Content Formatted",
        description: "Document has been formatted with improved structure.",
      });
    } else {
      // Basic summarization logic
      const sentences = content
        .split(/[.!?]+/)
        .map(s => s.trim())
        .filter(s => s.length > 20);
      
      const keyPoints = sentences
        .slice(0, Math.min(8, Math.ceil(sentences.length / 3)))
        .map((sentence, index) => `• ${sentence.replace(/^\w/, char => char.toUpperCase())}.`)
        .join('\n\n');
      
      setSummaryContent(keyPoints || '• No key points identified.');
      toast({
        title: "Summary Generated",
        description: "Key points have been extracted from the document.",
      });
    }
    
    setIsProcessing(false);
  };

  const handleExport = (format: string) => {
    const currentContent = viewMode === 'document' ? formattedContent : summaryContent;
    const exportFilename = `${filename.split('.')[0]}_${viewMode}`;
    
    switch (format) {
      case 'txt':
        const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, `${exportFilename}.txt`);
        break;
      case 'md':
        const mdContent = viewMode === 'summary' ? 
          `# Summary of ${filename}\n\n${currentContent}` :
          `# ${filename}\n\n${currentContent}`;
        const mdBlob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
        saveAs(mdBlob, `${exportFilename}.md`);
        break;
      default:
        toast({
          title: "Export Format",
          description: `${format.toUpperCase()} export coming soon!`,
        });
    }
    
    toast({
      title: "Export Successful",
      description: `Document exported as ${format.toUpperCase()}`,
    });
  };

  const copyToClipboard = async () => {
    const currentContent = viewMode === 'document' ? formattedContent : summaryContent;
    await navigator.clipboard.writeText(currentContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast({
      title: "Copied to Clipboard",
      description: "Content has been copied to your clipboard.",
    });
  };

  const currentContent = viewMode === 'document' ? formattedContent : summaryContent;
  const wordCount = currentContent.split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <Card className="p-4 bg-toolbar border-document-border">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{filename}</h2>
            <Badge variant="secondary" className="text-xs">
              {wordCount} words
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex rounded-md border border-document-border overflow-hidden">
              <Button
                variant={viewMode === 'document' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('document')}
                className="rounded-none"
              >
                <FileText className="h-4 w-4 mr-1" />
                Document
              </Button>
              <Button
                variant={viewMode === 'summary' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('summary')}
                className="rounded-none"
              >
                <List className="h-4 w-4 mr-1" />
                Summary
              </Button>
            </div>
          </div>
        </div>
        
        {/* Processing Buttons */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <Button
            onClick={() => processContent('format')}
            disabled={isProcessing}
            variant="outline"
            size="sm"
          >
            {isProcessing ? (
              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4 mr-1" />
            )}
            Format Content
          </Button>
          
          <Button
            onClick={() => processContent('summarize')}
            disabled={isProcessing}
            variant="outline"
            size="sm"
          >
            {isProcessing ? (
              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <List className="h-4 w-4 mr-1" />
            )}
            Generate Summary
          </Button>
          
          <div className="flex-1" />
          
          <Button
            onClick={copyToClipboard}
            variant="outline"
            size="sm"
          >
            {isCopied ? (
              <Check className="h-4 w-4 mr-1 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 mr-1" />
            )}
            Copy
          </Button>
          
          {/* Export Buttons */}
          <div className="flex gap-1">
            <Button
              onClick={() => handleExport('txt')}
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4 mr-1" />
              TXT
            </Button>
            <Button
              onClick={() => handleExport('md')}
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4 mr-1" />
              MD
            </Button>
          </div>
        </div>
      </Card>

      {/* Editor */}
      <Card className="p-6 bg-editor border-document-border shadow-document">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {viewMode === 'document' ? (
              <Edit3 className="h-5 w-5 text-primary" />
            ) : (
              <Eye className="h-5 w-5 text-primary" />
            )}
            <h3 className="font-medium">
              {viewMode === 'document' ? 'Document Editor' : 'Summary View'}
            </h3>
          </div>
          
          <Textarea
            value={currentContent}
            onChange={(e) => {
              if (viewMode === 'document') {
                setFormattedContent(e.target.value);
                onContentChange(e.target.value);
              } else {
                setSummaryContent(e.target.value);
              }
            }}
            className={cn(
              "min-h-[500px] resize-none border-0 p-4 text-base leading-relaxed",
              "focus:ring-2 focus:ring-primary/20 focus:border-primary/30",
              "bg-gradient-to-b from-background to-background/50"
            )}
            placeholder={
              viewMode === 'document' 
                ? "Your document content will appear here. You can edit it directly..."
                : "Summary will appear here after processing..."
            }
            style={{
              fontFamily: 'ui-serif, Georgia, Cambria, serif',
              lineHeight: '1.7'
            }}
          />
        </div>
      </Card>
    </div>
  );
};