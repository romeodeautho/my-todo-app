import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, StatusBar } from 'react-native';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Описываем, как выглядит задача (чтобы TypeScript перестал ругаться)
interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const TASKS_KEY = 'my_tasks';

export default function HomeScreen() {
  // 2. Явно говорим: в этом стейте будет массив задач
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const load = async () => {
      const json = await AsyncStorage.getItem(TASKS_KEY);
      if (json) {
        setTasks(JSON.parse(json));
      } else {
        const defaultTasks: Task[] = [
          { id: '1', text: 'Изучить основы React Native', completed: false },
          { id: '2', text: 'Настроить навигацию', completed: true },
        ];
        setTasks(defaultTasks);
        await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(defaultTasks));
      }
    };
    load();
  }, []);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  useEffect(() => {
    AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Мои задачи</Text>
        <Text style={styles.count}>{tasks.length} задач</Text>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable 
            style={styles.taskItem} 
            onPress={() => toggleTask(item.id)}
          >
            <View style={[styles.circle, item.completed && styles.circleCompleted]} />
            <Text 
              style={[
                styles.taskText, 
                item.completed && styles.taskTextCompleted
              ]}
            >
              {item.text}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Список пуст. Добавьте задачу!</Text>}
      />

      <Link href="/add-task" asChild>
        <Pressable style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 20 },
  header: { padding: 16, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  count: { fontSize: 16, color: '#888', marginTop: 4 },
  taskItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    padding: 16, borderRadius: 12, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 2,
  },
  circle: { width: 24, height: 24, borderWidth: 2, borderColor: '#007AFF', borderRadius: 12, marginRight: 16 },
  circleCompleted: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  taskText: { fontSize: 16, flex: 1 },
  taskTextCompleted: { textDecorationLine: 'line-through', color: '#aaa' },
  emptyText: { textAlign: 'center', color: '#888', fontSize: 16, marginTop: 20 },
  fab: { position: 'absolute', bottom: 30, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabText: { color: '#fff', fontSize: 32, lineHeight: 48 },
});
