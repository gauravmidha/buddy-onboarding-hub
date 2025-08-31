'use client';

import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Slack,
  MessageSquare,
  Settings,
  CheckCircle,
  AlertCircle,
  Zap,
  Webhook,
  Key,
  TestTube,
  Database,
  Building2
} from 'lucide-react';
import { api } from '@/lib/api';

interface IntegrationSettingsProps {
  onIntegrationChange?: () => void;
}

export const IntegrationSettings = ({ onIntegrationChange }: IntegrationSettingsProps) => {
  const [slackEnabled, setSlackEnabled] = useState(false);
  const [slackWebhookUrl, setSlackWebhookUrl] = useState('');
  const [slackBotToken, setSlackBotToken] = useState('');
  const [teamsEnabled, setTeamsEnabled] = useState(false);
  const [teamsWebhookUrl, setTeamsWebhookUrl] = useState('');
  const [teamsClientId, setTeamsClientId] = useState('');
  const [teamsClientSecret, setTeamsClientSecret] = useState('');
  const [hrisEnabled, setHrisEnabled] = useState(false);
  const [hrisProvider, setHrisProvider] = useState<'bamboohr' | 'workday' | 'adp' | 'custom'>('bamboohr');
  const [hrisApiKey, setHrisApiKey] = useState('');
  const [hrisBaseUrl, setHrisBaseUrl] = useState('');
  const [hrisCompanyId, setHrisCompanyId] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<{ slack?: boolean; teams?: boolean; hris?: boolean }>({});

  const testSlackIntegration = async () => {
    if (!slackWebhookUrl || !slackBotToken) return;

    setTesting(true);
    try {
      const response = await fetch('/api/test-slack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: slackWebhookUrl,
          botToken: slackBotToken
        })
      });
      const result = await response.json();
      setTestResults(prev => ({ ...prev, slack: result.success }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, slack: false }));
    } finally {
      setTesting(false);
    }
  };

  const testTeamsIntegration = async () => {
    if (!teamsWebhookUrl || !teamsClientId || !teamsClientSecret) return;

    setTesting(true);
    try {
      const response = await fetch('/api/test-teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: teamsWebhookUrl,
          clientId: teamsClientId,
          clientSecret: teamsClientSecret
        })
      });
      const result = await response.json();
      setTestResults(prev => ({ ...prev, teams: result.success }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, teams: false }));
    } finally {
      setTesting(false);
    }
  };

  const testHrisIntegration = async () => {
    if (!hrisApiKey || !hrisBaseUrl) return;

    setTesting(true);
    try {
      const response = await fetch('/api/test-hris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: hrisProvider,
          apiKey: hrisApiKey,
          baseUrl: hrisBaseUrl,
          companyId: hrisCompanyId
        })
      });
      const result = await response.json();
      setTestResults(prev => ({ ...prev, hris: result.success }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, hris: false }));
    } finally {
      setTesting(false);
    }
  };

  const saveIntegrations = () => {
    // Save to localStorage for demo purposes
    const integrations = {
      slack: {
        enabled: slackEnabled,
        webhookUrl: slackWebhookUrl,
        botToken: slackBotToken
      },
      teams: {
        enabled: teamsEnabled,
        webhookUrl: teamsWebhookUrl,
        clientId: teamsClientId,
        clientSecret: teamsClientSecret
      },
      hris: {
        enabled: hrisEnabled,
        provider: hrisProvider,
        apiKey: hrisApiKey,
        baseUrl: hrisBaseUrl,
        companyId: hrisCompanyId
      }
    };

    localStorage.setItem('integrations', JSON.stringify(integrations));
    if (onIntegrationChange) {
      onIntegrationChange();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Settings className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Integration Settings
          </h2>
        </div>

        <div className="space-y-8">
          {/* Slack Integration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Slack className="w-5 h-5 text-purple-600" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Slack Integration
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Send onboarding notifications and allow chatbot access via Slack
                  </p>
                </div>
              </div>
              <Switch
                checked={slackEnabled}
                onCheckedChange={setSlackEnabled}
              />
            </div>

            {slackEnabled && (
              <div className="ml-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="slack-webhook">Webhook URL</Label>
                    <Input
                      id="slack-webhook"
                      type="url"
                      placeholder="https://hooks.slack.com/services/..."
                      value={slackWebhookUrl}
                      onChange={(e) => setSlackWebhookUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slack-token">Bot Token</Label>
                    <Input
                      id="slack-token"
                      type="password"
                      placeholder="xoxb-your-bot-token"
                      value={slackBotToken}
                      onChange={(e) => setSlackBotToken(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Button
                    onClick={testSlackIntegration}
                    disabled={testing || !slackWebhookUrl || !slackBotToken}
                    variant="outline"
                  >
                    <TestTube className="w-4 h-4 mr-2" />
                    Test Connection
                  </Button>

                  {testResults.slack !== undefined && (
                    <div className="flex items-center space-x-2">
                      {testResults.slack ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-green-600">Connection successful</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-red-600" />
                          <span className="text-sm text-red-600">Connection failed</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <Alert>
                  <Webhook className="h-4 w-4" />
                  <AlertDescription>
                    <strong>How to set up Slack integration:</strong>
                    <ol className="mt-2 ml-4 list-decimal space-y-1">
                      <li>Create a Slack app at <a href="https://api.slack.com/apps" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">api.slack.com/apps</a></li>
                      <li>Add "Incoming Webhooks" and "Bot Users" features</li>
                      <li>Copy the webhook URL and bot token here</li>
                      <li>Install the app to your workspace</li>
                    </ol>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>

          {/* Teams Integration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Microsoft Teams Integration
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Send onboarding notifications and enable Teams bot functionality
                  </p>
                </div>
              </div>
              <Switch
                checked={teamsEnabled}
                onCheckedChange={setTeamsEnabled}
              />
            </div>

            {teamsEnabled && (
              <div className="ml-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teams-webhook">Webhook URL</Label>
                    <Input
                      id="teams-webhook"
                      type="url"
                      placeholder="https://outlook.office.com/webhook/..."
                      value={teamsWebhookUrl}
                      onChange={(e) => setTeamsWebhookUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teams-client-id">Client ID</Label>
                    <Input
                      id="teams-client-id"
                      placeholder="Application (client) ID"
                      value={teamsClientId}
                      onChange={(e) => setTeamsClientId(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teams-client-secret">Client Secret</Label>
                    <Input
                      id="teams-client-secret"
                      type="password"
                      placeholder="Client secret value"
                      value={teamsClientSecret}
                      onChange={(e) => setTeamsClientSecret(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Button
                    onClick={testTeamsIntegration}
                    disabled={testing || !teamsWebhookUrl || !teamsClientId || !teamsClientSecret}
                    variant="outline"
                  >
                    <TestTube className="w-4 h-4 mr-2" />
                    Test Connection
                  </Button>

                  {testResults.teams !== undefined && (
                    <div className="flex items-center space-x-2">
                      {testResults.teams ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-green-600">Connection successful</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-red-600" />
                          <span className="text-sm text-red-600">Connection failed</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <Alert>
                  <Key className="h-4 w-4" />
                  <AlertDescription>
                    <strong>How to set up Teams integration:</strong>
                    <ol className="mt-2 ml-4 list-decimal space-y-1">
                      <li>Register an app at <a href="https://portal.azure.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Azure Portal</a></li>
                      <li>Add "Microsoft Graph" permissions for Teams</li>
                      <li>Create a webhook connector in Teams</li>
                      <li>Copy the webhook URL and app credentials here</li>
                    </ol>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>

          {/* HRIS Integration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Database className="w-5 h-5 text-green-600" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    HRIS Integration
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Sync employee data and automate onboarding workflows with your HRIS
                  </p>
                </div>
              </div>
              <Switch
                checked={hrisEnabled}
                onCheckedChange={setHrisEnabled}
              />
            </div>

            {hrisEnabled && (
              <div className="ml-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hris-provider">HRIS Provider</Label>
                    <select
                      id="hris-provider"
                      value={hrisProvider}
                      onChange={(e) => setHrisProvider(e.target.value as 'bamboohr' | 'workday' | 'adp' | 'custom')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    >
                      <option value="bamboohr">BambooHR</option>
                      <option value="workday">Workday</option>
                      <option value="adp">ADP</option>
                      <option value="custom">Custom API</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hris-base-url">API Base URL</Label>
                    <Input
                      id="hris-base-url"
                      type="url"
                      placeholder="https://api.bamboohr.com/api/gateway.php/yourcompany/v1/"
                      value={hrisBaseUrl}
                      onChange={(e) => setHrisBaseUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hris-api-key">API Key</Label>
                    <Input
                      id="hris-api-key"
                      type="password"
                      placeholder="Your API key"
                      value={hrisApiKey}
                      onChange={(e) => setHrisApiKey(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hris-company-id">Company ID (Optional)</Label>
                    <Input
                      id="hris-company-id"
                      placeholder="yourcompany"
                      value={hrisCompanyId}
                      onChange={(e) => setHrisCompanyId(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Button
                    onClick={testHrisIntegration}
                    disabled={testing || !hrisApiKey || !hrisBaseUrl}
                    variant="outline"
                  >
                    <TestTube className="w-4 h-4 mr-2" />
                    Test Connection
                  </Button>

                  {testResults.hris !== undefined && (
                    <div className="flex items-center space-x-2">
                      {testResults.hris ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-green-600">Connection successful</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-red-600" />
                          <span className="text-sm text-red-600">Connection failed</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <Alert>
                  <Building2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>How to set up HRIS integration:</strong>
                    <div className="mt-2 space-y-2">
                      <div><strong>BambooHR:</strong> Get API key from Account → API Keys</div>
                      <div><strong>Workday:</strong> Generate API client credentials in Workday Studio</div>
                      <div><strong>ADP:</strong> Create API application in ADP Developer Portal</div>
                      <div><strong>Custom:</strong> Ensure your API follows REST standards</div>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>

          {/* Integration Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Integration Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 bg-blue-50 dark:bg-blue-900/20">
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Automated Notifications</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Send task reminders and completion updates
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-green-50 dark:bg-green-900/20">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Chatbot Integration</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      AI assistant available in Slack/Teams
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-purple-50 dark:bg-purple-900/20">
                <div className="flex items-center space-x-3">
                  <Webhook className="w-5 h-5 text-purple-600" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Real-time Updates</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Instant progress notifications
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-orange-50 dark:bg-orange-900/20">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-orange-600" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Feedback Collection</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Automated pulse surveys via chat
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-6 border-t">
          <Button onClick={saveIntegrations} className="bg-blue-600 hover:bg-blue-700">
            Save Integration Settings
          </Button>
        </div>
      </Card>
    </div>
  );
};
