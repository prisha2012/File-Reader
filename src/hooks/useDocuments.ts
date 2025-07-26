import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Document {
  id: string;
  title: string;
  original_content: string;
  processed_content?: string;
  tone?: string;
  file_type?: string;
  file_size?: number;
  word_count?: number;
  character_count?: number;
  created_at: string;
  updated_at: string;
}

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchDocuments = async () => {
    if (!user) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        toast({
          title: "Error",
          description: "Failed to load documents",
          variant: "destructive"
        });
      } else {
        setDocuments(data || []);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveDocument = async (
    title: string,
    originalContent: string,
    processedContent?: string,
    tone?: string,
    fileType?: string,
    fileSize?: number
  ) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save documents",
        variant: "destructive"
      });
      return null;
    }

    try {
      const wordCount = originalContent.split(/\s+/).filter(word => word.length > 0).length;
      const characterCount = originalContent.length;

      const { data, error } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          title,
          original_content: originalContent,
          processed_content: processedContent,
          tone,
          file_type: fileType,
          file_size: fileSize,
          word_count: wordCount,
          character_count: characterCount
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving document:', error);
        toast({
          title: "Error",
          description: "Failed to save document",
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Success",
        description: "Document saved successfully"
      });

      // Refresh the documents list
      fetchDocuments();
      return data;
    } catch (error) {
      console.error('Error saving document:', error);
      toast({
        title: "Error",
        description: "Failed to save document",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateDocument = async (
    id: string,
    updates: Partial<Pick<Document, 'title' | 'processed_content' | 'tone'>>
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating document:', error);
        toast({
          title: "Error",
          description: "Failed to update document",
          variant: "destructive"
        });
        return null;
      }

      // Update local state
      setDocuments(prev => 
        prev.map(doc => doc.id === id ? { ...doc, ...data } : doc)
      );

      return data;
    } catch (error) {
      console.error('Error updating document:', error);
      return null;
    }
  };

  const deleteDocument = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting document:', error);
        toast({
          title: "Error",
          description: "Failed to delete document",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Document deleted successfully"
      });

      // Update local state
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  return {
    documents,
    loading,
    saveDocument,
    updateDocument,
    deleteDocument,
    refetch: fetchDocuments
  };
};