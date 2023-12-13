import { useEffect, useState, useContext, useRef } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import UserContext from '../contexts/user.context';
import BudgetContext from '../contexts/budget.context';

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December',
];

export default function ProgressBar({ update }) {

    const [dbData, setDbData] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalValueMessage, setTotalValueMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [pieData, setPieData] = useState([{ name: 'empty', value: 100, color: 'gray' }]);
    const { user } = useContext(UserContext);
    const { monthIncomes,
        setMonthIncomes,
        monthExpenses,
        setMonthExpenses,
        prevBudget,
    } = useContext(BudgetContext);
    const [month, setMonth] = useState(0);

    const fetchData = async () => {
        const date = new Date();
        const updatedMonth = date.getMonth();
        setMonth(date.getMonth());
        try {
            const response = await fetch('http://localhost/finance-flow/backend/data.php?get-transactions&month=' + (parseInt(updatedMonth) + 1), {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();
            setDbData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log('update');
        if (user.isAuth) {
            console.log('fetching data');
            fetchData();
        } else {
            setDbData([]);
            setLoading(false);
        }
    }, [user, update])

    useEffect(() => {
        setMonthIncomes(0);
        setMonthExpenses(0);
        for (const entry of dbData) {
            if (entry.type === 'income') setMonthIncomes(prev => prev + entry.amount);
            if (entry.type === 'expense') setMonthExpenses(prev => prev + entry.amount);
        }
    }, [dbData]);

    useEffect(() => {
        const monthBudget = prevBudget + monthIncomes;
        const expensesPercentage = monthExpenses / monthBudget * 100;
        let remainingPercentage = 100 - expensesPercentage;
        if (monthIncomes === 0 && monthExpenses === 0) {
            setPieData([{ name: 'empty', value: 100, color: 'gray' }]);
            setTotal(0);
        } else {
            if (expensesPercentage <= 100) {
                setPieData([
                    { value: remainingPercentage, color: 'green' },
                    { value: expensesPercentage, color: 'red' },
                ]);
            } else {
                const exededPercentage = expensesPercentage - 100;
                remainingPercentage = 100 - exededPercentage;
                setPieData([
                    { value: remainingPercentage, color: 'red' },
                    { value: exededPercentage, color: 'black' },
                ]);
            }
            setTotal(monthBudget - monthExpenses);
        }
    }, [monthIncomes, monthExpenses]);

    useEffect(() => {
        if (monthIncomes === 0 && monthExpenses === 0) {
            setTotalValueMessage('No transactions yet');
        } else {
            setTotalValueMessage(`Total: ${total}€`);
        }
    }, [total]);

    return (
        <>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <section className="progress-bar">
                    <PieChart width={300} height={300}>
                        <Pie
                            data={pieData}
                            cx={145}
                            cy={145}
                            innerRadius={90}
                            outerRadius={100}
                            blendStroke
                        // isAnimationActive={false}
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                    <div className="total-value">
                        <h5>{monthNames[month]}</h5>
                        <p>{totalValueMessage}</p>
                    </div>
                </section>
            )}
        </>
    );
}
