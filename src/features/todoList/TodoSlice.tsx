import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuids4 } from 'uuid';

interface Todo {
    id: string;
    task: string;
    isCompleted: boolean;
    priorityCriteria: string;
}
export interface State {
    todoList: Todo[];
}

const initialState: Todo[] = [];

export const TodoSlice = createSlice({
    name: 'todoList',
    initialState,
    reducers: {
        setTodoList: (state, action) => {
            state = action.payload;
        },
        addTodo: (state, action) => {
            const { task, priorityCriteria } = action.payload;
            state.push({
              id: uuids4(),
              task,
              priorityCriteria,
              isCompleted: false,
            });
        },
        updateTodo: (state, action) => {
          const { id, isCompleted, priorityCriteria } = action.payload;
          const todoToUpdate = state.find(todo => todo.id === id);
          if (todoToUpdate) {
            todoToUpdate.isCompleted = isCompleted;
            todoToUpdate.priorityCriteria = priorityCriteria;
          }
        },
        removeTodo: (state, action) => {
            const { id } = action.payload;
            const newTodoList = state.filter(todo => todo.id !== id);
            return newTodoList;
        },
        filterCompletedTodo: (state, action) => {
            const { id, isCompleted } = action.payload;
            const completedList = state.filter(todo => todo.isCompleted === isCompleted);
            return completedList;
        }
    },
})

export const { setTodoList, addTodo, updateTodo, removeTodo, filterCompletedTodo } = TodoSlice.actions
export default TodoSlice.reducer;