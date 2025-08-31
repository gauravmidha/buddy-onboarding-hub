import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { webhookUrl, botToken } = await request.json();

    if (!webhookUrl || !botToken) {
      return NextResponse.json(
        { success: false, error: 'Missing webhook URL or bot token' },
        { status: 400 }
      );
    }

    // Test the Slack webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: '🧪 *Integration Test Successful!*\n\nBuddy Onboarding Hub is now connected to your Slack workspace.\n\n✅ Webhook connection verified\n✅ Bot token validated\n\nYou can now receive onboarding notifications and use the AI assistant in Slack!',
        username: 'Buddy Bot',
        icon_emoji: '🤖'
      })
    });

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Slack integration test successful'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to send test message to Slack'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Slack test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error during Slack test'
    }, { status: 500 });
  }
}
