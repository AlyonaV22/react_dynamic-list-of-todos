import React, { useEffect, useState } from 'react';
import { Loader } from '../Loader';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';
import { getUser } from '../../api';

type Props = {
  selectTodo: Todo;
  setSelectTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
};

export const TodoModal: React.FC<Props> = ({ selectTodo, setSelectTodo }) => {
  const [user, setUser] = useState<User | null>(null);
  const [hasLoading, setHasLoading] = useState(false);

  useEffect(() => {
    const userData = async () => {
      setHasLoading(true);
      try {
        const hasUserData = await getUser(selectTodo.userId);

        setUser(hasUserData);
      } finally {
        setHasLoading(false);
      }
    };

    userData();
  }, [selectTodo.userId]);

  const onClose = () => {
    setSelectTodo(null);
  };

  return (
    <div className="modal is-active" data-cy="modal">
      <div className="modal-background" />
      {hasLoading ? (
        <Loader />
      ) : (
        <div className="modal-card">
          <header className="modal-card-head">
            <div
              className="modal-card-title has-text-weight-medium"
              data-cy="modal-header"
            >
              Todo #{selectTodo.id}
            </div>
            <button
              type="button"
              className="delete"
              data-cy="modal-close"
              onClick={onClose}
            />
          </header>
          <div className="modal-card-body">
            <p className="block" data-cy="modal-title">
              {selectTodo.title}
            </p>
            <p className="block" data-cy="modal-user">
              {selectTodo.completed ? (
                <strong className="has-text-success">Done</strong>
              ) : (
                <strong className="has-text-danger">Planned</strong>
              )}
              {' by '}
              <a href={`mailto:${user?.email}`}>{user?.name}</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
