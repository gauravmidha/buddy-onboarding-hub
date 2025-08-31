import { chat, quickAction, addNewHire, exportCSV, generateRiskReport } from '@/lib/hrCopilot';

describe('HR Copilot API', () => {
  test('chat function returns proper response structure', async () => {
    const response = await chat('Hello');
    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('role');
    expect(response).toHaveProperty('content');
    expect(response).toHaveProperty('timestamp');
    expect(response.role).toBe('assistant');
  });

  test('quickAction returns proper response for risk', async () => {
    const response = await quickAction('risk');
    expect(response).toHaveProperty('content');
    expect(response.content).toContain('risk');
  });

  test('addNewHire returns success response', async () => {
    const payload = {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Developer',
      startDate: '2024-01-01'
    };
    const response = await addNewHire(payload);
    expect(response).toHaveProperty('success', true);
    expect(response).toHaveProperty('employeeId');
  });

  test('exportCSV returns download URL', async () => {
    const response = await exportCSV();
    expect(response).toHaveProperty('success', true);
    expect(response).toHaveProperty('downloadUrl');
  });

  test('generateRiskReport returns report URL', async () => {
    const response = await generateRiskReport();
    expect(response).toHaveProperty('success', true);
    expect(response).toHaveProperty('reportUrl');
  });
});
