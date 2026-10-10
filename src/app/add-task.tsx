import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
// Нам понадобится AsyncStorage, чтобы хранить задачи между экранами
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Task {
    id: string;
    text: string;
    completed: boolean;
  }

// Функция для сохранения списка
const saveTasks = async (tasks: any[]) => {
  await AsyncStorage.setItem('my_tasks', JSON.stringify(tasks));
};

// Функция для загрузки списка
const loadTasks = async () => {
  const json = await AsyncStorage.getItem('my_tasks');
  if (json) return JSON.parse(json);
  
  // Если ничего нет, возвращаем демо-данные
  return [
    { id: '1', text: 'Изучить основы React Native', completed: false },
    { id: '2', text: 'Настроить навигацию', completed: true },
  ];
};

export default function AddTaskScreen() {
    const [text, setText] = useState('');
    const router = useRouter();
  
    const handleAdd = async () => {
      if (!text.trim()) return;
  
      const currentTasks = await AsyncStorage.getItem('my_tasks');
      const parsedTasks: Task[] = currentTasks ? JSON.parse(currentTasks) : [];
      
      const newTask: Task = {
        id: Date.now().toString(),
        text,
        completed: false,
      };
  
      const updatedTasks: Task[] = [newTask, ...parsedTasks];
      await AsyncStorage.setItem('my_tasks', JSON.stringify(updatedTasks));
  
      router.back();
    };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.title}>Новая задача</Text>

        <TextInput
          style={styles.input}
          placeholder="Например: Купить молоко"
          value={text}
          onChangeText={setText}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        <Button title="Сохранить" onPress={handleAdd} color="#007AFF" />

        <View style={{ marginTop: 10 }}>
          <Button
            title="Отмена"
            onPress={() => router.back()}
            color="#999"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20, flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 120,
  },
});
