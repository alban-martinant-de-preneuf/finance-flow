import { useEffect, useState, useContext, useRef } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import UserContext from '../contexts/user.context';

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December',
];

export default function ProgressBar({ update }) {

    const [dbData, setDbData] = useState([]);
    const [income, setIncome] = useState(0);
    const [expenses, setExpenses] = useState(0);
    const [total, setTotal] = useState(0);
    const [totalValueMessage, setTotalValueMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [pieData, setPieData] = useState([{ name: 'empty', value: 100, color: 'gray' }]);
    const { user } = useContext(UserContext);
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
                // { name: 'foramination', value: 0, color: 'green'},
                { name: 'income', value: income, color: 'red' },
                { name: 'rest', value: expenses - income, color: 'black' },
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
                <section className="progress-bar">
                    <PieChart width={300} height={300}>
                        <Pie
                            data={pieData}
                            cx={150}
                            cy={150}
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
