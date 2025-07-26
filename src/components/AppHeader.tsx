import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sun, 
  Moon, 
  Settings, 
  FileText, 
  Sparkles,
  MoreVertical,
  ArrowLeft
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface AppHeaderProps {
  hasDocument: boolean;
  onNewDocument: () => void;
  onTemplatesToggle: () => void;
  showTemplates: boolean;
  onBack?: () => void;
}

export const AppHeader = ({ 
  hasDocument, 
  onNewDocument, 
  onTemplatesToggle,
  showTemplates,
  onBack
}: AppHeaderProps) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 border-b border-document-border bg-background/80 backdrop-blur-lg"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            {onBack && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
            <div className="relative">
              <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
                <FileText className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                DocuMaster
              </h1>
              <p className="text-xs text-muted-foreground">AI-Powered Document Processing</p>
            </div>
          </motion.div>
          </div>

          {/* Status and Actions */}
          <div className="flex items-center gap-4">
            {/* Status Indicator */}
            <div className="hidden md:flex items-center gap-2">
              <Badge 
                variant={hasDocument ? "default" : "secondary"}
                className="animate-pulse"
              >
                {hasDocument ? "Document Loaded" : "Ready"}
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {hasDocument && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNewDocument}
                  className="hidden sm:flex"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  New Document
                </Button>
              )}

              <Button
                variant={showTemplates ? "default" : "outline"}
                size="sm"
                onClick={onTemplatesToggle}
                className="hidden sm:flex"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                Templates
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="hidden sm:flex"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              {/* Mobile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="sm:hidden">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {hasDocument && (
                    <>
                      <DropdownMenuItem onClick={onNewDocument}>
                        <FileText className="h-4 w-4 mr-2" />
                        New Document
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={onTemplatesToggle}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {showTemplates ? 'Hide Templates' : 'Show Templates'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={toggleTheme}>
                    {theme === 'dark' ? (
                      <>
                        <Sun className="h-4 w-4 mr-2" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4 mr-2" />
                        Dark Mode
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};