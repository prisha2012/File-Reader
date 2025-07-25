import { useState } from 'react';
import { DocumentUpload } from './DocumentUpload';
import { DocumentEditor } from './DocumentEditor';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, CheckCircle } from 'lucide-react';

interface ProcessedDocument {
  content: string;
  filename: string;
  type: string;
  processedAt: Date;
}

export const DocumentProcessor = () => {
  const [currentDocument, setCurrentDocument] = useState<ProcessedDocument | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [documentHistory, setDocumentHistory] = useState<ProcessedDocument[]>([]);

  const handleFileUpload = async (content: string, filename: string, type: string) => {
    setIsProcessing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newDocument: ProcessedDocument = {
      content,
      filename,
      type,
      processedAt: new Date()
    };
    
    setCurrentDocument(newDocument);
    setDocumentHistory(prev => [newDocument, ...prev.slice(0, 4)]); // Keep last 5
    setIsProcessing(false);
  };

  const handleContentChange = (content: string) => {
    if (currentDocument) {
      setCurrentDocument({
        ...currentDocument,
        content
      });
    }
  };

  const loadFromHistory = (doc: ProcessedDocument) => {
    setCurrentDocument(doc);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Document Processor
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload, process, edit, and export your documents with intelligent formatting and summarization
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Status Card */}
            <Card className="p-4 bg-gradient-to-br from-card to-muted/10 border-document-border">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Status
              </h3>
              {currentDocument ? (
                <div className="space-y-2">
                  <Badge variant="secondary" className="w-full justify-center">
                    Document Loaded
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    <p className="truncate">{currentDocument.filename}</p>
                    <p>{currentDocument.processedAt.toLocaleTimeString()}</p>
                  </div>
                </div>
              ) : (
                <Badge variant="outline" className="w-full justify-center">
                  Ready to Upload
                </Badge>
              )}
            </Card>

            {/* History */}
            {documentHistory.length > 0 && (
              <Card className="p-4 bg-gradient-to-br from-card to-muted/10 border-document-border">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  Recent Documents
                </h3>
                <div className="space-y-2">
                  {documentHistory.map((doc, index) => (
                    <button
                      key={index}
                      onClick={() => loadFromHistory(doc)}
                      className="w-full text-left p-2 rounded-md hover:bg-muted/50 transition-colors border border-transparent hover:border-document-border"
                    >
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{doc.filename}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.processedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {!currentDocument ? (
              <DocumentUpload 
                onFileUpload={handleFileUpload}
                isProcessing={isProcessing}
              />
            ) : (
              <DocumentEditor
                content={currentDocument.content}
                filename={currentDocument.filename}
                onContentChange={handleContentChange}
              />
            )}
          </div>
        </div>

        {/* Features Overview */}
        {!currentDocument && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Smart Upload",
                  description: "Drag & drop support for multiple document formats including TXT, PDF, and Word documents.",
                  icon: "📁"
                },
                {
                  title: "Intelligent Processing",
                  description: "Automatically format content and generate concise summaries with key points extraction.",
                  icon: "🤖"
                },
                {
                  title: "Export Options",
                  description: "Export your processed documents in multiple formats including TXT, Markdown, and more.",
                  icon: "💾"
                }
              ].map((feature, index) => (
                <Card key={index} className="p-6 text-center border-document-border bg-gradient-to-br from-card to-muted/5">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};