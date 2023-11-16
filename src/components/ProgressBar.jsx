import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts';

export default function ProgressBar() {

    const [dbData, setDbData] = useState([]);
    const [income, setIncome] = useState(0);
    const [expenses, setExpenses] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

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
            setDbData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (!loading) {
            setIncome(0);
            setExpenses(0);
            for (const entry of dbData) {
                if (entry.type === 'income') setIncome(prev => prev + entry.amount);
                if (entry.type === 'expense') setExpenses(prev => prev + entry.amount);
            }
        }
    }, [dbData, loading]);

    useEffect(() => {
        setTotal(income - expenses);
    }, [income, expenses]);

    const pieData = [
        { name: 'add', value: income, color: 'green' },
        { name: 'min', value: expenses, color: 'red' },
    ];

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
                    <p>Total: {total}€</p>
                </>
            )}
        </>
    );
}
