import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getTodos, createTodo, patchTodo, deleteTodo } from '../api/todos';
import { Footer, Header, TodoCollection, TodoInput } from 'components';

const TodoPage = () => {
  // 輸入內容
  const [inputValue, setInputValue] = useState('');
  // 待辦事項
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated, currentMember } = useAuth();

  // todo剩餘項目
  const todoNums = todos.length;

  // 更新輸入內容
  const handleChange = (value) => {
    setInputValue(value);
  };

  const handleAddTodo = async () => {
    // 判斷是否有輸入內容
    if (inputValue.length === 0) {
      return;
    }

    try {
      // 從後端取得建立的todo
      const data = await createTodo({
        title: inputValue,
        isDone: false,
      });

      setTodos((prevTodos) => {
        //透過解構賦值將原本的todos拆解，並在後方增加新的todo
        return [
          ...prevTodos,
          {
            id: data.id,
            title: data.title,
            isDone: data.isDone,
            isEdit: false,
          },
        ];
      });

      // 清空inputValue
      setInputValue('');
    } catch (error) {
      console.error(error);
    }
  };

  // 透過Enter新增todo
  const handleKeyDown = async () => {
    if (inputValue.length === 0) {
      return;
    }

    try {
      // 從後端取得建立的todo
      const data = await createTodo({
        title: inputValue,
        isDone: false,
      });

      setTodos((prevTodos) => {
        //透過解構賦值將原本的todos拆解，並在後方增加新的todo
        return [
          ...prevTodos,
          {
            id: data.id,
            title: data.title,
            isDone: data.isDone,
            isEdit: false,
          },
        ];
      });

      // 清空inputValue
      setInputValue('');
    } catch (error) {
      console.error(error);
    }
  };

  // 透過id切換完成狀態
  const handleToggleDone = async (id) => {
    // 用find找到第一個符合的item，回傳該item，todo為物件
    const currentTodo = todos.find((todo) => todo.id === id);

    try {
      await patchTodo({
        id,
        isDone: !currentTodo.isDone,
      });
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              isDone: !todo.isDone,
            };
          }
          // 不是點擊的id回傳原本的狀態
          return todo;
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  // 切換編輯模式
  const handleChangeMode = ({ id, isEdit }) => {
    setTodos((prevTools) => {
      return prevTools.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            isEdit,
          };
        }

        return { ...todo, isEdit: false };
      });
    });
  };

  // 儲存todo
  const handleSave = async ({ id, title }) => {
    try {
      await patchTodo({
        id,
        title,
      });
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              title,
              isEdit: false,
            };
          }

          return todo;
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  // 刪除todo，篩選出非點擊到的id
  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // 取得todos
    const getTodosAsync = async () => {
      try {
        const todos = await getTodos();

        // 每個todo加上isEdit屬性並更新todos狀態
        setTodos(todos.map((todo) => ({ ...todo, isEdit: false })));
      } catch (error) {
        console.error(error);
      }
    };

    getTodosAsync();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate, isAuthenticated]);

  return (
    <div>
      TodoPage
      <Header username={currentMember?.name} />
      <TodoInput
        inputValue={inputValue}
        onChange={handleChange}
        onAddTodo={handleAddTodo}
        onKeyDown={handleKeyDown}
      />
      <TodoCollection
        todos={todos}
        onToggleDone={handleToggleDone}
        onChangeMode={handleChangeMode}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      <Footer numOfTodos={todoNums} />
    </div>
  );
};

export default TodoPage;
