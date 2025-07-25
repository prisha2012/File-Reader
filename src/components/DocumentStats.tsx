import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Clock, 
  Target, 
  BarChart3,
  TrendingUp,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DocumentStatsProps {
  content: string;
  filename: string;
  processingTime?: number;
}

export const DocumentStats = ({ content, filename, processingTime = 0 }: DocumentStatsProps) => {
  const words = content.split(/\s+/).filter(word => word.length > 0);
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const characters = content.length;
  const charactersNoSpaces = content.replace(/\s/g, '').length;
  
  const avgWordsPerSentence = sentences.length > 0 ? Math.round(words.length / sentences.length) : 0;
  const readingTime = Math.ceil(words.length / 200); // 200 words per minute average
  
  const stats = [
    { 
      label: 'Words', 
      value: words.length.toLocaleString(), 
      icon: FileText, 
      color: 'text-blue-500',
      description: 'Total words in document'
    },
    { 
      label: 'Characters', 
      value: characters.toLocaleString(), 
      icon: BarChart3, 
      color: 'text-green-500',
      description: `${charactersNoSpaces.toLocaleString()} without spaces`
    },
    { 
      label: 'Sentences', 
      value: sentences.length.toLocaleString(), 
      icon: Target, 
      color: 'text-purple-500',
      description: `${avgWordsPerSentence} avg words per sentence`
    },
    { 
      label: 'Paragraphs', 
      value: paragraphs.length.toLocaleString(), 
      icon: TrendingUp, 
      color: 'text-orange-500',
      description: 'Content sections'
    },
    { 
      label: 'Reading Time', 
      value: `${readingTime} min`, 
      icon: Clock, 
      color: 'text-red-500',
      description: '~200 words per minute'
    },
    { 
      label: 'Readability', 
      value: getReadabilityScore(avgWordsPerSentence), 
      icon: Eye, 
      color: 'text-indigo-500',
      description: 'Based on sentence complexity'
    }
  ];

  function getReadabilityScore(avgWordsPerSentence: number): string {
    if (avgWordsPerSentence <= 15) return 'Easy';
    if (avgWordsPerSentence <= 20) return 'Medium';
    return 'Complex';
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-muted/10 border-document-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Document Statistics</h3>
        <Badge variant="outline" className="font-mono text-xs">
          {filename}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="group"
          >
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-all duration-200 hover:shadow-sm bg-background/50">
              <div className={`p-2 rounded-md bg-muted/50 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold">{stat.value}</span>
                </div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {stat.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {processingTime > 0 && (
        <div className="mt-4 text-center">
          <Badge variant="secondary" className="text-xs">
            Processed in {processingTime}ms
          </Badge>
        </div>
      )}
    </Card>
  );
};