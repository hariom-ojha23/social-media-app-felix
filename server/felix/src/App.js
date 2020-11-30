import React, { createContext, useReducer } from 'react';
import './App.css';
import Main from './components/Main';
import { BrowserRouter } from 'react-router-dom';
import { reducer, initialState } from './reducer/userReducer'


export const UserContext = createContext()

function App() {
  const[state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{state, dispatch}}>
      <BrowserRouter>
        <div>
          <Main />
        </div>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
