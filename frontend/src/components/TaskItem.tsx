import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

type TaskItemProps = {
  item: {
    _id?: string;
    title: string;
    deadline?: string | null;
    priority: "Low" | "Medium" | "High";
    completed?: boolean;
  };
  onToggle: () => void;
  onDelete: () => void;
};

const TaskItem: React.FC<TaskItemProps> = ({ item, onToggle, onDelete }) => {
  return (
    <View style={styles.item}>
      <TouchableOpacity onPress={onToggle} style={styles.left}>
        <Ionicons
          name={item.completed ? "checkmark-circle" : "ellipse-outline"}
          size={24}
          color={item.completed ? COLORS.success : COLORS.primary}
        />
        <View>
          <Text
            style={[
              styles.text,
              item.completed && { textDecorationLine: "line-through", color: COLORS.gray },
            ]}
          >
            {item.title}
          </Text>
          {item.deadline && (
            <Text style={styles.deadline}>
              🕒 {new Date(item.deadline).toLocaleString()}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={onDelete}>
        <Ionicons name="trash-outline" size={22} color={COLORS.danger} />
      </TouchableOpacity>
    </View>
  );
};

export default TaskItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: COLORS.gray,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
  },
  deadline: {
    fontSize: 12,
    color: COLORS.gray,
  },
});
