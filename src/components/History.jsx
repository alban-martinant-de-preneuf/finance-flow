import { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/user.context";
import { monthNames } from '../utils/constants';

export default function History() {
    const { user } = useContext(UserContext);
    const [currentMonth, setCurrentMonth] = useState(0);
    const [currentYear, setCurrentYear] = useState(0);
    const [dbMonthData, setDbMonthData] = useState([]);
    const [monthResult, setMonthResult] = useState(0);

    useEffect(() => {
        const date = new Date();
        setCurrentMonth(date.getMonth() + 1);
        setCurrentYear(date.getFullYear());
    }, []);

    useEffect(() => {
        if (user.isAuth) {
            fetchData();
        } else {
            setDbMonthData([]);
        }
    }, [currentMonth, currentYear]);

    useEffect(() => {
        let total = 0;
        for (const day in dbMonthData) {
            for (const entry of dbMonthData[day]) {
                if (entry.type === 'expense') total -= entry.amount;
                else if (entry.type === 'income') total += entry.amount;
            }
        }
        console.log(total);
        setMonthResult(total);
    }, [dbMonthData]);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost/finance-flow/backend/data.php?get-transactions&month=' + currentMonth + '&year=' + currentYear, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();
            let transacsByDay = {};
            for (const entry of data) {
                if (typeof transacsByDay[entry.date] == 'undefined') {
                    transacsByDay[entry.date] = [];
                }
                transacsByDay[entry.date].push(entry);
            }
            setDbMonthData(transacsByDay);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    return (
        <div className="history">
            <div className="history-header">
                <h2>{monthNames[currentMonth - 1]} {currentYear}</h2>
                <p>Result: {monthResult} €</p>
                <button className="btn btn-prev" onClick={() => {
                    setCurrentMonth(prev => {
                        if (prev === 1) {
                            setCurrentYear(prev => prev - 1);
                            return 12;
                        }
                        return prev - 1;
                    });
                }
                }>&lt;</button>
                <button className="btn btn-next" onClick={() => {
                    setCurrentMonth(prev => {
                        if (prev === 12) {
                            setCurrentYear(prev => prev + 1);
                            return 1;
                        }
                        return prev + 1;
                    });
                }
                }>&gt;</button>
                <hr className="history-header-separator" />
            </div>
            <div className="history-body">
                <div className="history-body-content">
                    {Object.keys(dbMonthData).map((date, index) => (
                        <div className="history-day" key={index}>
                            {/* format December 20, 2023 */}
                            <h4>{new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h4>
                            {dbMonthData[date].map((entry, index) => (
                                <div className="history-entry" key={index}>
                                    <p>{entry.title}</p>
                                    {entry.type === 'expense'
                                        && <p className="expense">- {entry.amount} €</p>
                                    }
                                    {entry.type === 'income'
                                        && <p className="income">+ {entry.amount} €</p>
                                    }
                                </div>
                            ))}
                            <hr className="history-day-separator" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
