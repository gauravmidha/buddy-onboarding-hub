import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { webhookUrl, clientId, clientSecret } = await request.json();

    if (!webhookUrl || !clientId || !clientSecret) {
      return NextResponse.json(
        { success: false, error: 'Missing required Teams integration parameters' },
        { status: 400 }
      );
    }

    // Test the Teams webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "themeColor": "0076D7",
        "summary": "Buddy Onboarding Hub Integration Test",
        "sections": [{
          "activityTitle": "🤖 Integration Test Successful!",
          "activitySubtitle": "Buddy Onboarding Hub",
          "activityImage": "https://example.com/bot-icon.png",
          "facts": [
            {
              "name": "Status",
              "value": "✅ Connected"
            },
            {
              "name": "Features",
              "value": "Notifications, AI Assistant, Task Reminders"
            }
          ],
          "text": "Your Microsoft Teams integration is now active. You can receive onboarding notifications and use the AI assistant directly in Teams!"
        }],
        "potentialAction": [{
          "@type": "OpenUri",
          "name": "Open Dashboard",
          "targets": [{
            "os": "default",
            "uri": "https://your-app-domain.com"
          }]
        }]
      })
    });

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Teams integration test successful'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to send test message to Teams'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Teams test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error during Teams test'
    }, { status: 500 });
  }
}
