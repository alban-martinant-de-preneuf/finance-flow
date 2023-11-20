import { useEffect, useState, useContext, useRef } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import UserContext from '../contexts/user.context';

export default function ProgressBar() {

    const [dbData, setDbData] = useState([]);
    const [income, setIncome] = useState(0);
    const [expenses, setExpenses] = useState(0);
    const [total, setTotal] = useState(0);
    const [totalValueMessage, setTotalValueMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [pieData, setPieData] = useState([{ name: 'empty', value: 100, color: 'gray' }]);
    const { user } = useContext(UserContext);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost/finance-flow/backend/data.php?get-transactions', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();
            let income = 0;
            let expenses = 0;
            for (const entry of data) {
                if (entry.type === 'income') income += entry.amount;
                if (entry.type === 'expense') expenses += entry.amount;
            }
            console.log(income, expenses);
            setDbData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user.isAuth) {
            fetchData();
        } else {
            setDbData([]);
            setLoading(false);
        }
    }, [user])

    useEffect(() => {
        setIncome(0);
        setExpenses(0);
        for (const entry of dbData) {
            if (entry.type === 'income') setIncome(prev => prev + entry.amount);
            if (entry.type === 'expense') setExpenses(prev => prev + entry.amount);
        }
    }, [dbData]);
    
    useEffect(() => {
        if (income === 0 && expenses === 0) {
            setPieData([{ name: 'empty', value: 100, color: 'gray' }]);
            setTotal(0);
        } else {
            income > expenses ? setPieData([
                { name: 'rest', value: income - expenses, color: 'green' },
                { name: 'expense', value: expenses, color: 'red' },
            ]) : setPieData([
                { name: 'rest', value: expenses - income, color: 'black' },
                { name: 'income', value: income, color: 'red' },
            ]);
            setTotal(income - expenses);
        }
    }, [income, expenses]);
    
    useEffect(() => {
        if (income === 0 && expenses === 0) {
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
                <>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={pieData}
                            cx={200}
                            cy={200}
                            innerRadius={90}
                            outerRadius={100}
                            blendStroke
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                    <p>{totalValueMessage}</p>
                </>
            )}
        </>
    );
}
