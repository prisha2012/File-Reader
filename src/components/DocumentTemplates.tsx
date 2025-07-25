import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Mail,
  Presentation,
  BookOpen,
  Newspaper
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  content: string;
  category: string;
}

interface DocumentTemplatesProps {
  onTemplateSelect: (content: string, filename: string) => void;
}

export const DocumentTemplates = ({ onTemplateSelect }: DocumentTemplatesProps) => {
  const templates: DocumentTemplate[] = [
    {
      id: 'business-report',
      name: 'Business Report',
      description: 'Professional business analysis template',
      icon: Briefcase,
      color: 'text-blue-600',
      category: 'Business',
      content: `# Executive Summary

## Overview
[Provide a brief overview of the report's purpose and main findings]

## Key Findings
• Finding 1: [Detail the first key finding]
• Finding 2: [Detail the second key finding]
• Finding 3: [Detail the third key finding]

## Recommendations
1. [First recommendation with supporting rationale]
2. [Second recommendation with supporting rationale]
3. [Third recommendation with supporting rationale]

## Conclusion
[Summarize the main points and next steps]

---
Report prepared by: [Your Name]
Date: [Current Date]`
    },
    {
      id: 'academic-essay',
      name: 'Academic Essay',
      description: 'Structured academic writing format',
      icon: GraduationCap,
      color: 'text-purple-600',
      category: 'Academic',
      content: `# Essay Title

## Abstract
[Provide a brief summary of your essay's main argument and findings]

## Introduction
[Introduce your topic, provide background context, and present your thesis statement]

## Literature Review
[Discuss relevant existing research and scholarship on your topic]

## Methodology/Analysis
[Explain your approach to analyzing the topic]

## Discussion
[Present your main arguments with supporting evidence]

## Conclusion
[Summarize your findings and their implications]

## References
[List your sources in appropriate academic format]`
    },
    {
      id: 'meeting-minutes',
      name: 'Meeting Minutes',
      description: 'Template for recording meeting discussions',
      icon: Presentation,
      color: 'text-green-600',
      category: 'Business',
      content: `# Meeting Minutes

**Date:** [Meeting Date]
**Time:** [Start Time] - [End Time]
**Location:** [Meeting Location/Platform]

## Attendees
• [Name] - [Title]
• [Name] - [Title]
• [Name] - [Title]

## Agenda Items Discussed

### 1. [Topic 1]
**Discussion:** [Summary of discussion points]
**Decision:** [Any decisions made]
**Action Items:** 
- [ ] [Action item] - [Responsible person] - [Due date]

### 2. [Topic 2]
**Discussion:** [Summary of discussion points]
**Decision:** [Any decisions made]
**Action Items:**
- [ ] [Action item] - [Responsible person] - [Due date]

## Next Meeting
**Date:** [Next meeting date]
**Agenda Preview:** [Topics for next meeting]`
    },
    {
      id: 'project-proposal',
      name: 'Project Proposal',
      description: 'Comprehensive project planning template',
      icon: FileText,
      color: 'text-orange-600',
      category: 'Business',
      content: `# Project Proposal: [Project Name]

## Project Overview
[Brief description of the project and its objectives]

## Problem Statement
[Define the problem this project aims to solve]

## Objectives
• Primary Objective: [Main goal]
• Secondary Objectives:
  - [Objective 1]
  - [Objective 2]
  - [Objective 3]

## Scope
### In Scope:
• [What is included]
• [What is included]

### Out of Scope:
• [What is not included]
• [What is not included]

## Timeline
| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| Phase 1 | [Duration] | [Deliverables] |
| Phase 2 | [Duration] | [Deliverables] |
| Phase 3 | [Duration] | [Deliverables] |

## Budget
[Estimated costs and resource requirements]

## Risk Assessment
| Risk | Impact | Mitigation Strategy |
|------|--------|-------------------|
| [Risk 1] | [High/Medium/Low] | [Strategy] |
| [Risk 2] | [High/Medium/Low] | [Strategy] |

## Success Metrics
• [Metric 1]
• [Metric 2]
• [Metric 3]`
    },
    {
      id: 'email-template',
      name: 'Professional Email',
      description: 'Well-structured email template',
      icon: Mail,
      color: 'text-cyan-600',
      category: 'Communication',
      content: `Subject: [Clear and specific subject line]

Dear [Recipient Name],

[Opening - Brief greeting and context]

[Main Content - Present your message clearly and concisely]

Key Points:
• [Point 1]
• [Point 2]
• [Point 3]

[Call to Action - What you need from the recipient]

[Closing - Thank you and next steps]

Best regards,
[Your Name]
[Your Title]
[Contact Information]`
    },
    {
      id: 'research-notes',
      name: 'Research Notes',
      description: 'Organized research documentation',
      icon: BookOpen,
      color: 'text-indigo-600',
      category: 'Academic',
      content: `# Research Notes: [Topic]

## Research Question
[What are you trying to find out?]

## Sources
1. [Source 1] - [Author, Date, Publication]
2. [Source 2] - [Author, Date, Publication]
3. [Source 3] - [Author, Date, Publication]

## Key Findings

### Theme 1: [Main Theme]
**Source:** [Citation]
**Quote/Finding:** "[Important quote or finding]"
**Analysis:** [Your interpretation and significance]

### Theme 2: [Main Theme]
**Source:** [Citation]
**Quote/Finding:** "[Important quote or finding]"
**Analysis:** [Your interpretation and significance]

## Gaps in Research
• [What information is missing?]
• [What questions remain unanswered?]

## Next Steps
- [ ] [Follow-up research needed]
- [ ] [Additional sources to consult]
- [ ] [Analysis to complete]

## Synthesis
[How do these findings connect? What patterns emerge?]`
    }
  ];

  const categories = [...new Set(templates.map(t => t.category))];

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-muted/5 border-document-border">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Document Templates</h3>
        <p className="text-sm text-muted-foreground">
          Start with a professional template to structure your content
        </p>
      </div>
      
      {categories.map((category, categoryIndex) => (
        <div key={category} className="mb-6 last:mb-0">
          <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
            {category}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {templates
              .filter(template => template.category === category)
              .map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: (categoryIndex * 0.1) + (index * 0.05), 
                    duration: 0.3 
                  }}
                >
                  <Button
                    variant="outline"
                    className="w-full h-auto p-4 flex flex-col items-start gap-3 hover:shadow-md transition-all duration-200 hover:scale-[1.02] group"
                    onClick={() => onTemplateSelect(template.content, `${template.name.toLowerCase().replace(/\s+/g, '-')}.txt`)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className={`p-2 rounded-md bg-muted/50 ${template.color} group-hover:scale-110 transition-transform duration-200`}>
                        <template.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{template.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {template.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
          </div>
        </div>
      ))}
    </Card>
  );
};