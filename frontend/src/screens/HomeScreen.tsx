import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Alert,
} from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
// Assuming COLORS and TaskItem are correctly defined and imported
import { COLORS } from "../constants/theme"; 
import TaskItem from "../components/TaskItem"; 
import { getTasks, addTask, deleteTask, updateTask } from "../api/taskApi";

type Task = {
    _id?: string;
    title: string;
    description?: string;
    deadline?: string | null;
    priority: "Low" | "Medium" | "High";
    completed?: boolean;
};

type HomeScreenProps = {
    navigation: any;
    onLogout: () => Promise<void>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, onLogout }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [task, setTask] = useState("");
    const [deadline, setDeadline] = useState<Date | null>(null);
    const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Low");
    const [isPickerVisible, setIsPickerVisible] = useState(false);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const fetched = await getTasks();
            const formatted = (fetched.data || []).map((t: any) => ({
                ...t,
                deadline:
                    t.deadline && !isNaN(Date.parse(t.deadline))
                        ? new Date(t.deadline)
                        : null,
            }));
            setTasks(formatted);
        } catch (error) {
            console.log("Error loading tasks:", error);
            // Optionally, handle 401/403 errors here to force logout
        }
    };

    const addNewTask = async () => {
        if (!task.trim()) return Alert.alert("Enter a task title!");

        try {
            const taskData = {
                title: task,
                description: "",
                deadline: deadline ? deadline.toISOString() : null,
                priority,
            };

            const res = await addTask(taskData);
            // The deadline comes back from the backend as an ISO string (or null), 
            // so we convert it back to a Date object for the state.
            const newTask = {
                ...res.data,
                deadline: res.data.deadline ? new Date(res.data.deadline) : null,
            };

            setTasks([...tasks, newTask]);
            setTask("");
            setDeadline(null);
        } catch (error) {
            console.log("Error adding task:", error);
            Alert.alert("Error", "Unable to add task");
        }
    };

    const handleDelete = async (taskId: string) => {
        try {
            await deleteTask(taskId);
            setTasks(tasks.filter((t) => t._id !== taskId));
        } catch (error) {
            console.log("Error deleting:", error);
        }
    };

    const toggleTask = async (task: Task) => {
        try {
            const updated = await updateTask(task._id!, {
                completed: !task.completed,
            });
            // Ensure the updated task has a Date object for the deadline field for consistency
            const formattedUpdated = {
                ...updated.data,
                deadline: updated.data.deadline ? new Date(updated.data.deadline) : null,
            }
            setTasks(tasks.map((t) => (t._id === task._id ? formattedUpdated : t)));
        } catch (error) {
            console.log("Error updating:", error);
        }
    };

    const handleLogout = async () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            { text: "Logout", onPress: onLogout },
        ]);
    };

    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // Use setTimeout(0) to delay the state update.
    // This allows the native Android module to finish its action
    // before we unmount the picker component, preventing the crash.
    setTimeout(() => {
      // 1. Always hide the picker component
      setIsPickerVisible(false);

      // 2. If the user confirmed a date, update the state
      if (event.type === 'set' && selectedDate) {
        setDeadline(selectedDate);
      }
      // If event.type is 'dismissed', we just hide the picker 
      // and don't update the date.
    }, 0); 
  };

    const renderDateTimePicker = () => {
        if (!isPickerVisible) return null;
        return (
            <DateTimePicker
                value={deadline ?? new Date()}
                mode="datetime"
                display={Platform.OS === "ios" ? "spinner" : "default"} // Changed 'inline' to 'spinner' for better default behavior
                onChange={handleDateChange}
            />
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My To-Do List</Text>
                <TouchableOpacity onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={26} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Enter task..."
                    style={styles.input}
                    value={task}
                    onChangeText={setTask}
                />
                <Button title="Add" onPress={addNewTask} color={COLORS.primary} />
            </View>

            <TouchableOpacity
                onPress={() => setIsPickerVisible(true)}
                style={styles.deadlineButton}
            >
                <Text style={{ color: COLORS.white }}>
                    {deadline
                        ? `Deadline: ${deadline.toLocaleString()}`
                        : "Set Deadline"}
                </Text>
            </TouchableOpacity>

            {renderDateTimePicker()}

            <View style={styles.priorityContainer}>
                {["Low", "Medium", "High"].map((p) => (
                    <TouchableOpacity
                        key={p}
                        style={[
                            styles.priorityButton,
                            priority === p && { backgroundColor: COLORS.primary },
                        ]}
                        onPress={() => setPriority(p as any)}
                    >
                        <Text
                            style={{
                                color: priority === p ? COLORS.white : COLORS.primary,
                            }}
                        >
                            {p}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
                renderItem={({ item }) => (
                    <TaskItem
                        item={item}
                        onToggle={() => toggleTask(item)}
                        onDelete={() => handleDelete(item._id!)}
                    />
                )}
            />
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.primary,
    },
    inputContainer: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.gray,
        padding: 10,
        borderRadius: 8,
    },
    deadlineButton: {
        backgroundColor: COLORS.primary,
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10,
    },
    priorityContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 10,
    },
    priorityButton: {
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 16,
    },
});