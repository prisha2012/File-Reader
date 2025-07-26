import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  MessageCircle, 
  GraduationCap, 
  Sparkles,
  Newspaper,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';

export type ToneType = 'formal' | 'casual' | 'academic' | 'creative' | 'journalistic' | 'friendly';

interface ToneSelectorProps {
  selectedTone: ToneType;
  onToneChange: (tone: ToneType) => void;
  isProcessing?: boolean;
}

export const ToneSelector = ({ selectedTone, onToneChange, isProcessing }: ToneSelectorProps) => {
  const tones: Array<{
    type: ToneType;
    label: string;
    description: string;
    icon: React.ComponentType<any>;
    color: string;
    example: string;
  }> = [
    {
      type: 'formal',
      label: 'Formal',
      description: 'Professional and structured',
      icon: Briefcase,
      color: 'text-blue-600',
      example: 'Business reports, official documents'
    },
    {
      type: 'casual',
      label: 'Casual',
      description: 'Relaxed and conversational',
      icon: MessageCircle,
      color: 'text-green-600',
      example: 'Blog posts, personal notes'
    },
    {
      type: 'academic',
      label: 'Academic',
      description: 'Scholarly and precise',
      icon: GraduationCap,
      color: 'text-purple-600',
      example: 'Research papers, essays'
    },
    {
      type: 'creative',
      label: 'Creative',
      description: 'Imaginative and engaging',
      icon: Sparkles,
      color: 'text-pink-600',
      example: 'Marketing copy, storytelling'
    },
    {
      type: 'journalistic',
      label: 'Journalistic',
      description: 'Clear and factual',
      icon: Newspaper,
      color: 'text-orange-600',
      example: 'News articles, reports'
    },
    {
      type: 'friendly',
      label: 'Friendly',
      description: 'Warm and approachable',
      icon: Users,
      color: 'text-emerald-600',
      example: 'Social media, newsletters'
    }
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-muted/5 border-document-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Writing Tone</h3>
          <p className="text-sm text-muted-foreground">Choose the style for processing</p>
        </div>
        <Badge variant="outline" className="capitalize">
          {selectedTone}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {tones.map((tone, index) => (
          <motion.div
            key={tone.type}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
          >
            <Button
              variant={selectedTone === tone.type ? "default" : "outline"}
              className={`w-full h-auto p-3 flex items-center justify-start gap-3 transition-all duration-200 text-left ${
                selectedTone === tone.type 
                  ? 'ring-2 ring-primary/20 shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => onToneChange(tone.type)}
              disabled={isProcessing}
            >
              <div className={`p-2 rounded-md bg-muted/50 ${tone.color} flex-shrink-0`}>
                <tone.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{tone.label}</div>
                <div className="text-xs text-muted-foreground">
                  {tone.description}
                </div>
                <div className="text-xs opacity-70 mt-1">
                  {tone.example}
                </div>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};