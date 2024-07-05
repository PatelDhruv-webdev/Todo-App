import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import { database } from './firebase';
import { ref, push, onValue, remove, update } from 'firebase/database';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [inputTitle, setInputTitle] = useState('');

  useEffect(() => {
    const tasksRef = ref(database, 'tasks');
    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      const tasksList = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setTasks(tasksList);
    });
  }, []);

  const addTask = () => {
    if (inputTitle.trim()) {
      const newTask = {
        title: inputTitle,
        status: 'due/false'
      };
      const tasksRef = ref(database, 'tasks');
      push(tasksRef, newTask);
      setInputTitle('');
    }
  };

  const deleteTask = (id) => {
    const taskRef = ref(database, `tasks/${id}`);
    remove(taskRef);
  };

  const toggleStatus = (id, currentStatus) => {
    const taskRef = ref(database, `tasks/${id}`);
    update(taskRef, {
      status: currentStatus === 'due/false' ? 'done/true' : 'due/false'
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Task Title"
        value={inputTitle}
        onChangeText={setInputTitle}
      />
      <Button
        title="Add Task"
        onPress={addTask}
        disabled={!inputTitle.trim()}
      />
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.title} - Status: {item.status === 'due/false' ? 'Due' : 'Done'}</Text>
            <TouchableOpacity onPress={() => toggleStatus(item.id, item.status)} style={[styles.toggleButton, { backgroundColor: item.status === 'due/false' ? '#add8e6' : '#0074D9' }]}>
              <Text style={styles.toggleButtonText}>Toggle Status</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteButton}>
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
  },
  taskText: {
    flex: 1,
  },
  toggleButton: {
    marginRight: 10,
    padding: 10,
    borderRadius: 5,
  },
  toggleButtonText: {
    color: 'white',
  },
  deleteButton: {
    padding: 10,
    backgroundColor: 'salmon',
    borderRadius: 5,
  }
});
