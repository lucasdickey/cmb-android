import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useMutation, useQuery} from 'convex/react';
import {api} from '../../convex/_generated/api';
import {Id} from '../../convex/_generated/dataModel';

interface Note {
  _id: Id<'notes'>;
  title: string;
  note: string;
  externalRefUrl: string;
  projectCardUrl: string;
}

export default function NotesScreen() {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [externalRefUrl, setExternalRefUrl] = useState('');
  const [projectCardUrl, setProjectCardUrl] = useState('');

  const notes = useQuery(api.notes.list) || [];
  const createNote = useMutation(api.notes.createNote);
  const updateNote = useMutation(api.notes.update);
  const deleteNote = useMutation(api.notes.remove);

  const handleSubmit = async () => {
    try {
      await createNote({
        title,
        note,
        externalRefUrl,
        projectCardUrl,
      });
      // Clear form
      setTitle('');
      setNote('');
      setExternalRefUrl('');
      setProjectCardUrl('');
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const renderNote = ({item}: {item: Note}) => (
    <View style={styles.noteItem}>
      <View style={styles.noteHeader}>
        <Text style={styles.noteTitle}>{item.title}</Text>
        <TouchableOpacity
          onPress={() => deleteNote({id: item._id})}
          style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.noteText}>{item.note}</Text>
      {item.externalRefUrl ? (
        <Text style={styles.urlText}>Ref: {item.externalRefUrl}</Text>
      ) : null}
      {item.projectCardUrl ? (
        <Text style={styles.urlText}>Project: {item.projectCardUrl}</Text>
      ) : null}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, styles.noteInput]}
          placeholder="Note"
          value={note}
          onChangeText={setNote}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="External Reference URL (optional)"
          value={externalRefUrl}
          onChangeText={setExternalRefUrl}
        />
        <TextInput
          style={styles.input}
          placeholder="Project Card URL (optional)"
          value={projectCardUrl}
          onChangeText={setProjectCardUrl}
        />
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Add Note</Text>
        </TouchableOpacity>
      </View>

      <FlatList<Note>
        data={notes}
        renderItem={renderNote}
        keyExtractor={item => item._id.toString()}
        style={styles.list}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  form: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  noteInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  noteItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteText: {
    fontSize: 16,
    marginBottom: 8,
  },
  urlText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: '#FF5252',
    padding: 8,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
  },
});
