import {ChangeEvent, ChangeEventHandler, useCallback, useEffect, useMemo, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTodoList, addTodo, updateTodo, removeTodo, filterCompletedTodo, State } from '../features/todoList/TodoSlice';
import './styles/TodoList.css';
import { clickOptions } from '@testing-library/user-event/dist/click';

function TodoList() {
  const [inputValue, setInputValue] = useState('');
  const [priorityCriteria, setPriorityCriteria] = useState("High");
  const [filter, setFilter] = useState('All');

  const dispatch = useDispatch();
  const todoList = useSelector((state: State) => state.todoList);
  
  useEffect(() => {
    document.title = `You have ${todoList.length} todos`;
}, [todoList]);
  //  console.log(todoList)
  const handleAddTodo = useCallback(() => {
    if (!inputValue) {
      alert('Please enter a new Task')
      return;
    }
    dispatch(addTodo({
      task: inputValue,
      priorityCriteria,
      isCompleted: false
    }));
    setInputValue('');
  },[dispatch, inputValue, priorityCriteria])
  
  const handleRemoveTodo = useCallback((todoId: string) => {
    const todoToRemove = todoList.find(todo => todo.id === todoId);
    if (todoToRemove){
      dispatch(removeTodo({
        id: todoId,
      }))
    }
  }, [dispatch, todoList])


  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) =>{
    const inputValue = e.target.value
    setInputValue(inputValue)
  }, []);
  
  const handlePriorityCriteria = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setPriorityCriteria(e.target.value)
  },[]);

  const handleUpdatePriority: ChangeEventHandler<HTMLSelectElement> = useCallback((e) => {
    const updatedPriority = e.target.value  
    // console.log(updatedPriority)
    const id = e.currentTarget.dataset.todoId 
      if (id) {
        dispatch(updateTodo({
          id: id,
          priorityCriteria: updatedPriority
        }))
      }
  }, [dispatch, todoList])
  /*I tried to update the priority 
  inside the select options box, but I could't find a way, 
  even though it does change the value as you can see with the console.log*/

  const handleToggleTodo = useCallback((todoId: string) => {
    const todoToToggle = todoList.find(todo => todo.id === todoId);
    if (todoToToggle) {
      dispatch(updateTodo({
        id: todoId,
        isCompleted: !todoToToggle.isCompleted
       }))
    }
  },[dispatch, todoList])

  //Sort
  const filteredTodoList = useMemo(() => {
    switch(filter) {
      case 'Completed':
        return todoList.filter(todo => todo.isCompleted);
      case 'Pending': 
        return todoList.filter(todo => !todo.isCompleted);
      default:
        return todoList;
    }
  },[todoList, filter])

  return (
    <>
    <h1>Raul's Todo List</h1>

    <div className="addTodoContainer">
        <input
         className="input"
         id="todo"
         type="text"
         value={inputValue} 
         placeholder='Add your todo...'
         onChange={handleInputChange}
         /> 
          <select 
            value={priorityCriteria}
            onChange={handlePriorityCriteria}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
         <button
         className="buttons"
         onClick={handleAddTodo}
         >ADD TODO</button>
    </div>
      <br />
    <div className="buttons">
      <button className="buttons" onClick={() => setFilter('Completed')}>Show Completed</button>
      <button className="buttons" onClick={() => setFilter('Pending')}>Show Pending</button>
      <button className="buttons" onClick={() => setFilter('All')}>Show All</button>
    </div>
      {filteredTodoList.map(todo => (
        <div className="todo" key={todo.id}>
        <h2 className="task">{todo.task}</h2>
        <h3>This task is {todo.isCompleted ? 'Completed' : 'Pending'}</h3>
        <button className="buttons"
          onClick={() => handleToggleTodo(todo.id)}
        >{todo.isCompleted ? 'Mark Incomplete' : 'Mark Complete'}</button>
        <br />
        <select
            className="buttons"
            value={todo.id === priorityCriteria ? todo.priorityCriteria : priorityCriteria}
            onChange={(e) => handleUpdatePriority(e)}
            data-todo-id={todo.id}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <br />
          <br />
        <button
         className="buttons"
         onClick={() => handleRemoveTodo(todo.id)}>Remove</button>
        </div>
       
      ))}
    </>
  )
}

export default TodoList;