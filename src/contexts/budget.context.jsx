import { createContext, useState } from "react";

const BudgetContext = createContext(null);

export default BudgetContext;

function BudgetContextProvider({ children }) {
    const [prevBudget, setPrevBudget] = useState(0);
    const [monthIncomes, setMonthIncomes] = useState(0);
    const [monthExpenses, setMonthExpenses] = useState(0);

    return (
        <BudgetContext.Provider value={{ prevBudget, setPrevBudget, monthIncomes, setMonthIncomes, monthExpenses, setMonthExpenses }}>
            {children}
        </BudgetContext.Provider>
    );
}

export { BudgetContextProvider };