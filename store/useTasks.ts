import { create } from 'zustand';
import { TaskStatus } from '../lib/constants';

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  employee_id: string;
  category: string;
  estimated_time: string;
  created_at: string;
  updated_at: string;
}

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  byEmployee: (employeeId: string) => Task[];
  updateStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  startTask: (taskId: string) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  fetchTasks: (employeeId: string) => Promise<void>;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  byEmployee: (employeeId: string) => {
    return get().tasks.filter(task => task.employee_id === employeeId);
  },

  updateStatus: async (taskId: string, status: TaskStatus) => {
    set({ loading: true, error: null });

    try {
      // Optimistic update
      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === taskId ? { ...task, status, updated_at: new Date().toISOString() } : task
        ),
      }));

      // Call API
      await import('../lib/api').then(({ postTaskUpdate }) =>
        postTaskUpdate({
          employee_id: get().tasks.find(t => t.id === taskId)?.employee_id || '',
          task_id: taskId,
          status,
        })
      );
    } catch (error) {
      // Revert on error
      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === taskId ? { ...task, status: task.status } : task
        ),
        error: 'Failed to update task status',
      }));
    } finally {
      set({ loading: false });
    }
  },

  startTask: async (taskId: string) => {
    await get().updateStatus(taskId, 'doing');
  },

  completeTask: async (taskId: string) => {
    await get().updateStatus(taskId, 'done');
  },

  fetchTasks: async (employeeId: string) => {
    set({ loading: true, error: null });
    try {
      // Mock fetch - replace with actual API call
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Complete HR paperwork',
          description: 'Fill out W-4 and emergency contact forms',
          status: 'todo',
          employee_id: employeeId,
          category: 'HR',
          estimated_time: '15 mins',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        // Add more mock tasks as needed
      ];
      set({ tasks: mockTasks });
    } catch (error) {
      set({ error: 'Failed to fetch tasks' });
    } finally {
      set({ loading: false });
    }
  },
}));
