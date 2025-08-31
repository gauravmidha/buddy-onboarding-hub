# 🤖 Buddy Onboarding Hub

> **AI-Powered Employee Onboarding Platform** - Streamlining HR processes with intelligent automation and real-time progress tracking.

[![Next.js](https://img.shields.io/badge/Next.js-13.5.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC)](https://tailwindcss.com/)
[![n8n](https://img.shields.io/badge/n8n-1.0-orange)](https://n8n.io/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 🌟 Overview

Buddy Onboarding Hub is a comprehensive, AI-powered employee onboarding platform that transforms the traditional onboarding experience. Built with modern web technologies and integrated with n8n workflow automation, it provides HR teams and new employees with an intelligent, streamlined onboarding journey.

### 🎯 Key Features

- **🤖 AI-Powered Assistant**: Intelligent chatbot that guides employees through onboarding tasks
- **📊 Real-Time Progress Tracking**: Live dashboard with completion metrics and analytics
- **🔐 Role-Based Access Control**: Secure separation between HR and employee portals
- **⚡ Workflow Automation**: n8n integration for automated task creation and notifications
- **📱 Responsive Design**: Seamless experience across desktop and mobile devices
- **🎨 Modern UI/UX**: Clean, professional interface with dark mode support
- **📋 Comprehensive Task Management**: Organized checklists with category-based grouping
- **🔗 External Integrations**: Ready for Slack, Teams, and HRIS system connections

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **n8n** instance (cloud or self-hosted)
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/buddy-onboarding-hub.git
   cd buddy-onboarding-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

   Configure your environment variables:
   ```env
   # n8n Webhook URLs
   NEXT_PUBLIC_N8N_NEW_HIRE_WEBHOOK=https://your-n8n-instance.app.n8n.cloud/webhook/new-hire
   NEXT_PUBLIC_N8N_TASK_UPDATE_WEBHOOK=https://your-n8n-instance.app.n8n.cloud/webhook/task-update

   # API Keys
   N8N_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

### 🎭 Demo Accounts

**HR Dashboard:**
- Email: `hr@acme.com`
- Password: `demo123`

**Employee Portal:**
- Email: `emily.chen@acme.com` (or any employee email)
- Password: `demo123`

## 🏗️ Architecture

### Tech Stack

#### Frontend
- **Framework**: [Next.js 13](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + Custom Components
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Icons**: [Lucide React](https://lucide.dev/)

#### Backend Integration
- **Workflow Automation**: [n8n](https://n8n.io/)
- **Data Storage**: Client-side storage (expandable to database)
- **API Communication**: RESTful webhooks

### Folder Structure

```
buddy-onboarding-hub/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   ├── employee/                 # Employee dashboard
│   ├── hr-dashboard/            # HR management portal
│   ├── api/                      # API routes
│   ├── globals.css              # Global styles
│   └── layout.tsx               # Root layout
├── components/                   # Reusable components
│   ├── ui/                       # Base UI components
│   ├── hr/                       # HR-specific components
│   ├── EmployeeTable.tsx         # Employee management
│   ├── TaskChecklist.tsx         # Task management
│   └── BuddyPanel.tsx           # AI assistant
├── hooks/                        # Custom React hooks
│   ├── useAuth.tsx              # Authentication
│   ├── useTheme.tsx             # Theme management
│   └── useBuddyHook.tsx         # AI assistant logic
├── lib/                          # Utility libraries
│   ├── api.ts                   # API client functions
│   ├── constants.ts             # Application constants
│   ├── dataStore.ts             # Data management
│   └── hrAssistantClient.ts     # HR assistant client
├── store/                        # State management
│   └── useTasks.ts              # Task state management
├── types/                        # TypeScript definitions
└── public/                       # Static assets
```

## 🔗 n8n Workflow Integration

### Webhook Endpoints

The application integrates with n8n through two primary webhooks:

#### 1. New Hire Creation
```http
POST https://your-n8n-instance.app.n8n.cloud/webhook/new-hire
Content-Type: application/json
X-API-Key: your_api_key

{
  "employee_id": "EMP001",
  "name": "John Doe",
  "email": "john.doe@company.com",
  "manager": "Jane Smith",
  "start_date": "2024-01-15"
}
```

#### 2. Task Status Updates
```http
POST https://your-n8n-instance.app.n8n.cloud/webhook/task-update
Content-Type: application/json
X-API-Key: your_api_key

{
  "employee_id": "EMP001",
  "task_id": "task_123",
  "status": "done"
}
```

### Workflow Automation Examples

Your n8n workflows can automate:

- **Welcome Email Sequences**: Automated emails with personalized content
- **Task Reminders**: Scheduled follow-ups for incomplete tasks
- **Manager Notifications**: Alerts when employees complete milestones
- **HRIS Updates**: Sync employee data with HR systems
- **Slack/Teams Integration**: Channel notifications for HR teams
- **Document Generation**: Automated form creation and distribution

## 📚 API Reference

### Core Functions

#### Employee Management
```typescript
// Create new hire and trigger onboarding workflow
await createNewHire({
  employee_id: string,
  name: string,
  email: string,
  manager: string,
  start_date: string
});
```

#### Task Management
```typescript
// Update task status
await updateTaskStatus({
  employee_id: string,
  task_id: string,
  status: 'todo' | 'doing' | 'done'
});

// Fetch employee tasks
const tasks = await getEmployeeTasks(employeeId);
```

#### AI Assistant
```typescript
// Send message to AI assistant
await sendHRChat(message: string);

// Run HR admin actions
await runHRAction(action: 'new_hire' | 'remind' | 'export' | 'at_risk');
```

## 🎨 UI Components

### Key Components

#### BuddyPanel
AI-powered assistant with chat interface and task guidance
```tsx
<BuddyPanel
  open={isOpen}
  onClose={() => setIsOpen(false)}
/>
```

#### TaskChecklist
Interactive task management with progress tracking
```tsx
<TaskChecklist
  employeeId={user.id}
  onStepClick={handleStepClick}
/>
```

#### HRAssistantDrawer
HR dashboard AI assistant with actions and resources
```tsx
<HRAssistantDrawer
  open={assistantOpen}
  onClose={() => setAssistantOpen(false)}
/>
```

## 🚀 Deployment

### Environment Variables

Create a `.env.local` file with:

```env
# n8n Configuration
NEXT_PUBLIC_N8N_NEW_HIRE_WEBHOOK=https://your-n8n-instance.app.n8n.cloud/webhook/new-hire
NEXT_PUBLIC_N8N_TASK_UPDATE_WEBHOOK=https://your-n8n-instance.app.n8n.cloud/webhook/task-update
N8N_API_KEY=your_api_key_here

# Application Settings
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker Deployment (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and test thoroughly
4. Commit with descriptive messages
5. Push to your fork and create a Pull Request

### Code Style

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting for consistency
- **Prettier**: Automatic code formatting
- **Tailwind**: Utility-first CSS approach

### Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📊 Features in Detail

### For HR Teams
- **📈 Dashboard Analytics**: Real-time onboarding metrics and completion rates
- **👥 Employee Management**: Comprehensive employee lifecycle management
- **📋 Automated Workflows**: n8n-powered task creation and notifications
- **📊 Progress Monitoring**: Visual progress tracking and bottleneck identification
- **🔄 Integration Ready**: Pre-built connectors for major HR systems

### For New Employees
- **🎯 Personalized Onboarding**: AI-guided task completion
- **💬 Interactive Support**: 24/7 chatbot assistance
- **📱 Mobile-First Design**: Complete mobile experience
- **📚 Resource Access**: Centralized company policies and guides
- **⚡ Quick Actions**: One-click task completion and status updates

## 🔒 Security

- **Role-based access control** (HR vs Employee portals)
- **Secure API communication** with n8n webhooks
- **Input validation** and sanitization
- **Environment variable protection** for sensitive data
- **HTTPS enforcement** in production

## 📈 Performance

- **Optimized bundle size** with Next.js code splitting
- **Lazy loading** for non-critical components
- **Efficient state management** with Zustand
- **Responsive images** and optimized assets
- **Caching strategies** for better performance

## 🐛 Troubleshooting

### Common Issues

**n8n Webhooks Not Working:**
- Verify webhook URLs in `lib/constants.ts`
- Check n8n workflow is active and published
- Confirm API key is correct

**Authentication Issues:**
- Clear browser cache and cookies
- Check user roles and permissions
- Verify demo accounts are working

**Styling Issues:**
- Ensure Tailwind CSS is properly configured
- Check for conflicting CSS rules
- Verify dark mode toggle functionality

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/buddy-onboarding-hub/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/buddy-onboarding-hub/discussions)
- **Documentation**: [Wiki](https://github.com/yourusername/buddy-onboarding-hub/wiki)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **n8n** for powerful workflow automation
- **Next.js** for the incredible React framework
- **Tailwind CSS** for utility-first styling
- **Radix UI** for accessible component primitives
- **Lucide** for beautiful icons

---

## ❓ Questions for Workflow/Backend Details

To make this README even better, I'd love to know more about:

1. **n8n Workflow Details:**
   - What specific automations does your n8n workflow handle?
   - Are there additional webhooks or API endpoints I should document?
   - Any specific n8n nodes or integrations you're using?

2. **Backend Architecture:**
   - Are you planning to add a database (PostgreSQL, MongoDB, etc.)?
   - Any additional API integrations (HRIS systems, email providers)?
   - Authentication system details (custom auth, OAuth providers)?

3. **Deployment & Infrastructure:**
   - Preferred hosting platform (Vercel, Netlify, AWS, etc.)?
   - Any specific CI/CD requirements?
   - Environment-specific configurations?

4. **Future Features:**
   - Planned integrations or features I should mention?
   - Any specific business logic or workflows?

Please let me know if you'd like me to update the README with any of these details! 🚀
