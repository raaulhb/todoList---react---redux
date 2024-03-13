import { combineReducers } from "redux";
import todosReducer from "../features/todoList/TodoSlice";

const rootReducer = combineReducers({
  todoList: todosReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
