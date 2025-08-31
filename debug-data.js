// Debug script to test dataStore connection
import { dataStore } from './lib/dataStore.js';

console.log('=== DataStore Debug Test ===');

// Test getting all employees
const employees = dataStore.getEmployees();
console.log('Employees:', employees);
console.log('Number of employees:', employees.length);

// Test getting Emily Chen specifically
const emily = employees.find(emp => emp.name === 'Emily Chen');
console.log('Emily Chen:', emily);

// Test getting Emily's tasks
if (emily) {
  const tasks = dataStore.getEmployeeTasks(emily.id);
  console.log('Emily Chen tasks:', tasks);
}

// Test metrics
const metrics = dataStore.getMetrics();
console.log('Metrics:', metrics);

console.log('=== Debug Complete ===');
