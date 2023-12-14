import TransactionBtn from './TransactionBtn';
import { useEffect, useContext } from 'react';
import BudgetContext from '../contexts/budget.context';

export default function Foot({ setShowTransacForm }) {

    const handleTransac = (e) => {
        e.preventDefault();
        setShowTransacForm(true);
    }

    const {
        prevBudget,
        setPrevBudget,
        monthIncomes,
        monthExpenses
    } = useContext(BudgetContext);

    const getPreviousBudget = async () => {
        try {
            const response = await fetch(
                "http://localhost/finance-flow/backend/data.php?get-previous-budget",
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            const data = await response.json();
            console.log(data);
            if (data.success) {
                setPrevBudget(data.remaining);
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    }

    useEffect(() => {
        getPreviousBudget();
    }, []);

    return (
        <footer>
            <div className='transac-btns'>
                <TransactionBtn type="sub" handleTransac={handleTransac} />
                <TransactionBtn type="add" handleTransac={handleTransac} />
            </div>
            <div className='infos'>
                <div className='spends'>
                    <p>${monthExpenses}</p>
                    <h4>Spends</h4>
                </div>
                <div className='budjet'>
                    <p>${prevBudget + monthIncomes}</p>
                    <h4>Budget</h4>
                </div>
            </div>
        </footer>
    )
}