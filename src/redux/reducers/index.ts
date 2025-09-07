const initialState = {
  todos: [
    {
      id: 1,
      completed: true,
    },
  ],
  filters: {
    id: 1,
  },
};
export default function appReducer(state = initialState, action: any) {
  switch (action.type) {
    case "todos/todoAdded": {
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: 1,
            text: action.payload,
            completed: false,
          },
        ],
      };
    }
    case "todos/todoToggled": {
      return {
        ...state,
        todos: state.todos.map((todo) => {
          if (todo.id !== action.payload) {
            return todo;
          }

          return {
            ...todo,
            completed: !todo.completed,
          };
        }),
      };
    }
    case "filters/statusFilterChanged": {
      return {
        // Copy the whole state
        ...state,
        // Overwrite the filters value
        filters: {
          // copy the other filter fields
          ...state.filters,
          // And replace the status field with the new value
          status: action.payload,
        },
      };
    }
    default:
      return state;
  }
}
