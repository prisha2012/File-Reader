import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useDocuments } from '@/hooks/useDocuments';
import { useAuth } from '@/contexts/AuthContext';
import { EnhancedDocumentProcessor } from '@/components/EnhancedDocumentProcessor';
import { 
  FileText, 
  Calendar, 
  Clock, 
  LogOut, 
  Plus, 
  Trash2,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { documents, loading, deleteDocument } = useDocuments();
  const [showProcessor, setShowProcessor] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleNewDocument = () => {
    setSelectedDocument(null);
    setShowProcessor(true);
  };

  const handleViewDocument = (docId: string) => {
    setSelectedDocument(docId);
    setShowProcessor(true);
  };

  const handleBackToDashboard = () => {
    setShowProcessor(false);
    setSelectedDocument(null);
  };

  if (showProcessor) {
    return (
      <EnhancedDocumentProcessor 
        onBack={handleBackToDashboard}
        documentId={selectedDocument}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Document Processor</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user?.user_metadata?.display_name || user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={handleNewDocument} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Document
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {documents.filter(doc => {
                  const docDate = new Date(doc.created_at);
                  const now = new Date();
                  return docDate.getMonth() === now.getMonth() && 
                         docDate.getFullYear() === now.getFullYear();
                }).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Words</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {documents.reduce((total, doc) => total + (doc.word_count || 0), 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Documents</CardTitle>
            <CardDescription>
              {documents.length === 0 
                ? "No documents yet. Create your first document to get started."
                : `${documents.length} document${documents.length === 1 ? '' : 's'} in your workspace`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading documents...</div>
            ) : documents.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No documents yet</h3>
                <p className="text-muted-foreground mb-4">
                  Upload your first document to start processing
                </p>
                <Button onClick={handleNewDocument}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Document
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {documents.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <h3 className="font-medium">{doc.title}</h3>
                              {doc.tone && (
                                <Badge variant="secondary" className="text-xs">
                                  {doc.tone}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{doc.word_count || 0} words</span>
                              <span>{doc.character_count || 0} characters</span>
                              <span>{format(new Date(doc.created_at), 'MMM d, yyyy')}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDocument(doc.id)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteDocument(doc.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;