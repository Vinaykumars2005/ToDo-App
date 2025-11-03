import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = 'TASKS';

export const saveTasks = async (tasks: any[]) => {
  try {
    const jsonValue = JSON.stringify(tasks);
    await AsyncStorage.setItem(TASKS_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving tasks:', e);
  }
};

export const loadTasks = async (): Promise<any[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(TASKS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error loading tasks:', e);
    return [];
  }
};
