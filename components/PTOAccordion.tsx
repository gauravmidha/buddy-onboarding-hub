'use client';

import { useState } from 'react';
import { Card } from './Card';
import { ChevronDown, Calendar, Clock, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export const PTOAccordion = () => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const sections = [
    {
      id: 'pto-policy',
      title: 'PTO Policy',
      icon: Calendar,
      content: `
        • Annual Leave: 15 days in your first year, increasing to 20 days after 2 years
        • Sick Leave: 10 days per year, unused days roll over up to 40 days
        • Personal Days: 3 floating personal days per year
        • Holidays: 12 company holidays plus your birthday
        • Request Process: Submit requests at least 2 weeks in advance via HRIS
        • Approval: Manager approval required for requests over 3 consecutive days
      `
    },
    {
      id: 'benefits',
      title: 'Benefits Overview',
      icon: FileText,
      content: `
        • Health Insurance: Company covers 100% of employee premiums, 80% for family
        • Dental & Vision: Fully covered for employee and family
        • 401(k): 6% company match, immediate vesting
        • Life Insurance: 2x annual salary at no cost
        • Flexible Spending: Health and Dependent Care FSA available
        • Wellness: $500 annual wellness reimbursement
        • Professional Development: $2,000 annual learning budget
      `
    },
    {
      id: 'help',
      title: 'Need Help?',
      icon: Clock,
      content: `
        • HR Team: hr@company.com or ext. 2400
        • IT Support: it-help@company.com or ext. 3500
        • Your Manager: Available for any questions about role expectations
        • Buddy System: You'll be paired with a buddy within your first week
        • Open Door Policy: Senior leadership available for feedback
        • Employee Resource Groups: Join communities based on interests and identity
      `
    }
  ];

  return (
    <Card title="PTO Policy & Help" subtitle="Important information and resources">
      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = section.icon;
          const isOpen = openSections.has(section.id);
          
          return (
            <div key={section.id} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">{section.title}</span>
                </div>
                <ChevronDown className={cn(
                  'w-5 h-5 text-gray-500 transition-transform duration-200',
                  isOpen && 'transform rotate-180'
                )} />
              </button>
              
              {isOpen && (
                <div className="px-4 pb-4">
                  <div className="pl-8 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {section.content}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};