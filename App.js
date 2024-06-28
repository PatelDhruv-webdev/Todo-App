import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [inputTitle, setInputTitle] = useState('');

  const addTask = () => {
    if (inputTitle.trim()) { // Ensure the title is not just empty spaces
      const newTask = {
        id: Date.now(),
        title: inputTitle,
        status: 'due/false'  // Default status
      };
      setTasks([...tasks, newTask]);
      setInputTitle('');  // Clear input field after adding
    }
  };

  const deleteTask = id => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleStatus = id => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: task.status === 'due/false' ? 'done/true' : 'due/false' } : task
    ));
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
        disabled={!inputTitle.trim()}  // Disable the button if input is empty or spaces
      />
      <FlatList
        data={tasks}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.title} - Status: {item.status === 'due/false' ? 'Due' : 'Done'}</Text>
            <TouchableOpacity onPress={() => toggleStatus(item.id)} style={[styles.toggleButton, { backgroundColor: item.status === 'due/false' ? '#add8e6' : '#0074D9'}]}>
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
  instructions: {
    fontSize: 14,
    marginBottom: 10,
    color: 'grey'
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
    marginTop: 10,

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
