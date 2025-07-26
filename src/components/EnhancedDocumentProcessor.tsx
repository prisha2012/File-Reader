import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppHeader } from './AppHeader';
import { EnhancedDocumentUpload } from './EnhancedDocumentUpload';
import { DocumentEditor } from './DocumentEditor';
import { DocumentStats } from './DocumentStats';
import { ToneSelector, ToneType } from './ToneSelector';
import { DocumentTemplates } from './DocumentTemplates';
import { useDocuments } from '@/hooks/useDocuments';
import { toast } from '@/hooks/use-toast';

interface ProcessedDocument {
  content: string;
  filename: string;
  type: string;
  processedAt: Date;
  id?: string;
}

interface EnhancedDocumentProcessorProps {
  onBack?: () => void;
  documentId?: string | null;
}

export const EnhancedDocumentProcessor: React.FC<EnhancedDocumentProcessorProps> = ({ 
  onBack, 
  documentId 
}) => {
  const [currentDocument, setCurrentDocument] = useState<ProcessedDocument | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTone, setSelectedTone] = useState<ToneType>('formal');
  const [showTemplates, setShowTemplates] = useState(false);
  const { documents, saveDocument, updateDocument } = useDocuments();

  // Load document if documentId is provided
  useEffect(() => {
    if (documentId && documents.length > 0) {
      const doc = documents.find(d => d.id === documentId);
      if (doc) {
        setCurrentDocument({
          content: doc.processed_content || doc.original_content,
          filename: doc.title,
          type: doc.file_type || 'text/plain',
          processedAt: new Date(doc.updated_at),
          id: doc.id
        });
        setSelectedTone((doc.tone as ToneType) || 'formal');
      }
    }
  }, [documentId, documents]);

  const handleFileUpload = async (content: string, filename: string, type: string) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Save to database
    const savedDoc = await saveDocument(filename, content, undefined, selectedTone, type);
    
    if (savedDoc) {
      const newDocument: ProcessedDocument = {
        content,
        filename,
        type,
        processedAt: new Date(),
        id: savedDoc.id
      };
      
      setCurrentDocument(newDocument);
      toast({
        title: "Document saved",
        description: "Your document has been saved to your account"
      });
    }
    
    setIsProcessing(false);
  };

  const handleTemplateSelect = (content: string, filename: string) => {
    handleFileUpload(content, filename, 'text/plain');
    setShowTemplates(false);
  };

  const handleNewDocument = () => {
    setCurrentDocument(null);
    setShowTemplates(false);
  };

  const handleContentChange = async (content: string) => {
    if (currentDocument) {
      const updatedDoc = { ...currentDocument, content };
      setCurrentDocument(updatedDoc);
      
      // Auto-save changes if document exists in database
      if (updatedDoc.id) {
        await updateDocument(updatedDoc.id, { 
          processed_content: content,
          tone: selectedTone 
        });
      }
    }
  };

  const handleToneChange = async (tone: ToneType) => {
    setSelectedTone(tone);
    
    // Update database if document exists
    if (currentDocument?.id) {
      await updateDocument(currentDocument.id, { tone });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <AppHeader 
        hasDocument={!!currentDocument}
        onNewDocument={handleNewDocument}
        onTemplatesToggle={() => setShowTemplates(!showTemplates)}
        showTemplates={showTemplates}
        onBack={onBack}
      />

      <div className="w-full px-4 py-8">
        <AnimatePresence mode="wait">
          {!currentDocument ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8 max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <motion.h2 
                  className="text-3xl font-bold mb-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Transform Your Documents with AI
                </motion.h2>
                <motion.p 
                  className="text-lg text-muted-foreground max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Upload Word, PowerPoint, PDF, and text files for intelligent processing
                </motion.p>
              </div>

              {showTemplates ? (
                <DocumentTemplates onTemplateSelect={handleTemplateSelect} />
              ) : (
                <>
                  <EnhancedDocumentUpload 
                    onFileUpload={handleFileUpload}
                    isProcessing={isProcessing}
                  />
                  <ToneSelector 
                    selectedTone={selectedTone}
                    onToneChange={handleToneChange}
                  />
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-none grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 gap-6"
            >
              <div className="xl:col-span-1 lg:col-span-1 space-y-6">
                <DocumentStats 
                  content={currentDocument.content}
                  filename={currentDocument.filename}
                />
                <ToneSelector 
                  selectedTone={selectedTone}
                  onToneChange={handleToneChange}
                  isProcessing={isProcessing}
                />
              </div>

              <div className="xl:col-span-3 lg:col-span-2">
                <DocumentEditor
                  content={currentDocument.content}
                  filename={currentDocument.filename}
                  onContentChange={handleContentChange}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};