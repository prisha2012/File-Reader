import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppHeader } from './AppHeader';
import { EnhancedDocumentUpload } from './EnhancedDocumentUpload';
import { DocumentEditor } from './DocumentEditor';
import { DocumentStats } from './DocumentStats';
import { ToneSelector, ToneType } from './ToneSelector';
import { DocumentTemplates } from './DocumentTemplates';

interface ProcessedDocument {
  content: string;
  filename: string;
  type: string;
  processedAt: Date;
}

export const EnhancedDocumentProcessor = () => {
  const [currentDocument, setCurrentDocument] = useState<ProcessedDocument | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTone, setSelectedTone] = useState<ToneType>('formal');
  const [showTemplates, setShowTemplates] = useState(false);

  const handleFileUpload = async (content: string, filename: string, type: string) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newDocument: ProcessedDocument = {
      content,
      filename,
      type,
      processedAt: new Date()
    };
    
    setCurrentDocument(newDocument);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <AppHeader 
        hasDocument={!!currentDocument}
        onNewDocument={handleNewDocument}
        onTemplatesToggle={() => setShowTemplates(!showTemplates)}
        showTemplates={showTemplates}
      />

      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!currentDocument ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
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
                  Upload, format, summarize, and export with intelligent processing
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
                    onToneChange={setSelectedTone}
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
              className="grid grid-cols-1 lg:grid-cols-4 gap-6"
            >
              <div className="lg:col-span-1 space-y-6">
                <DocumentStats 
                  content={currentDocument.content}
                  filename={currentDocument.filename}
                />
                <ToneSelector 
                  selectedTone={selectedTone}
                  onToneChange={setSelectedTone}
                  isProcessing={isProcessing}
                />
              </div>

              <div className="lg:col-span-3">
                <DocumentEditor
                  content={currentDocument.content}
                  filename={currentDocument.filename}
                  onContentChange={(content) => 
                    setCurrentDocument(prev => prev ? {...prev, content} : null)
                  }
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};