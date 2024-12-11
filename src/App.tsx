import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { Todo } from './types/Todo';
import { getTodos } from './api';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [selectTodo, setSelectTodo] = useState<Todo | null>(null);
  const [selectFilter, setSelectFilter] = useState('all');
  const [hasLoading, setHasLoading] = useState(false);

  useEffect(() => {
    const loadTodos = async () => {
      setHasLoading(true);
      try {
        const hasLoadTodos = await getTodos();

        setTodos(hasLoadTodos);
      } finally {
        setHasLoading(false);
      }
    };

    loadTodos();
  }, []);

  const isTodos = todos
    .filter(todo => {
      if (selectFilter === 'active') {
        return !todo.completed;
      }

      if (selectFilter === 'completed') {
        return todo.completed;
      }

      return true;
    })
    .filter(todo => {
      const isQuery = query.toLowerCase().trim();

      if (!isQuery) {
        return true;
      }

      return todo.title.toLowerCase().includes(isQuery);
    });

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                query={query}
                setQuery={setQuery}
                hasFilterChange={setSelectFilter}
                selectFilter={selectFilter}
              />
            </div>

            <div className="block">
              {hasLoading && <Loader />}

              {!hasLoading && todos.length > 0 && (
                <TodoList
                  todos={isTodos}
                  selectTodo={selectTodo}
                  setSelectTodo={setSelectTodo}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {selectTodo && (
        <TodoModal selectTodo={selectTodo} setSelectTodo={setSelectTodo} />
      )}
    </>
  );
};
