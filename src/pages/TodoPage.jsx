import { useEffect, useState } from 'react';
import { getTodos } from '../api/todos';
import { Footer, Header, TodoCollection, TodoInput } from 'components';

const TodoPage = () => {
  // 輸入內容
  const [inputValue, setInputValue] = useState('');
  // 待辦事項
  const [todos, setTodos] = useState([]);

  // 更新輸入內容
  const handleChange = (value) => {
    setInputValue(value);
  };

  const handleAddTodo = () => {
    // 判斷是否有輸入內容
    if (inputValue.length === 0) {
      return;
    }

    setTodos((prevTodos) => {
      //透過解構賦值將原本的todos拆解，並在後方增加新的todo
      return [
        ...prevTodos,
        {
          id: Math.random() * 100,
          title: inputValue,
          isDone: false,
        },
      ];
    });

    // 清空inputValue
    setInputValue('');
  };

  // 透過Enter新增todo
  const handleKeyDown = () => {
    if (inputValue.length === 0) {
      return;
    }

    setTodos((prevTodos) => {
      return [
        ...prevTodos,
        {
          id: Math.random() * 100,
          title: inputValue,
          isDone: false,
        },
      ];
    });

    setInputValue('');
  };

  // 透過id切換完成狀態
  const handleToggleDone = (id) => {
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
  const handleSave = ({ id, title }) => {
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
  };

  // 刪除todo，篩選出非點擊到的id
  const handleDelete = (id) => {
    setTodos((prevTodos) => {
      return prevTodos.filter((todo) => todo.id !== id);
    });
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

  return (
    <div>
      TodoPage
      <Header />
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
      <Footer todos={todos} />
    </div>
  );
};

export default TodoPage;
