import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { UserContextProvider } from './contexts/user.context';
import { BudgetContextProvider } from './contexts/budget.context';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserContextProvider>
      <BudgetContextProvider>
        <App />
      </BudgetContextProvider>
    </UserContextProvider>
  </React.StrictMode>,
)
