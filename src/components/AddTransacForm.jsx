import Modal from "./Modal";
import { useEffect, useState } from "react";

import PropTypes from 'prop-types';

export default function AddTransacForm({ setShowTransacForm, updateChart, transacType }) {
    const categories = [
        "__none__",
        "Food",
        "Transport",
        "Home",
        "Shopping",
        "Entertainment",
        "Health",
        "Other",
    ];

    const [message, setMessage] = useState('');
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        setCurrentDate(formattedDate);
    }, []);

    const handleAddTransac = async (e) => {
        e.preventDefault();

        const type = transacType === 'add' ? 'income' : 'expense';
        const title = e.target.title.value === '' ? type : e.target.title.value;
        const frequency = e.target.frequency.value;
        const amount = e.target.amount.value;
        const date = e.target.date.value;
        const description = e.target.description.value;
        const category = e.target.category.value;

        const formD = new FormData();

        formD.append("title", title);
        formD.append("type", type);
        formD.append("frequency", frequency);
        formD.append("amount", amount);
        formD.append("date", date);
        formD.append("description", description);
        formD.append("id_category", category);

        try {
            const response = await fetch(
                "http://localhost/finance-flow/backend/data.php?add-transaction",
                {
                    method: "POST",
                    credentials: "include",
                    body: formD,
                }
            );
            const data = await response.json();
            console.log(data);
            setMessage(data.message);
            if (data.success) {
                console.log("Transaction added");
                updateChart();
                setTimeout(() => {
                    setShowTransacForm(false);
                }, 2000);
            }

        } catch (error) {
            console.error("Network error:", error);
        }
    }

    return (
        <Modal>
            <div className="container_form">
                <button className="close_form" onClick={() => setShowTransacForm(false)}>X</button>
                <h3 className="title_form">{transacType === 'add' ? 'Add an income' : 'Add an expense'}</h3>
                <p className="message">
                    {message}
                </p>
                <div className="add_transc_form">
                    <form action="" onSubmit={handleAddTransac}>
                        <div className="input_form">
                            <label htmlFor="type">Titre</label>
                            <input type="text" name="title" id="title" />
                        </div>
                        <div className="input_form" hidden>
                            <label htmlFor="frequency">Frequency</label>
                            <select name="frequency" id="frequency">
                                <option value="once">Once</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                        <div className="input_form">
                            <label htmlFor="amount">Amount</label>
                            <input type="number" name="amount" id="amount" />
                        </div>
                        <div className="input_form">
                            <label htmlFor="date">Date</label>
                            <input
                                type="date" 
                                name="date" 
                                id="date" 
                                value={currentDate} 
                                onChange={(e) => setCurrentDate(e.target.value)} />
                        </div>
                        <div className="input_form">
                            <label htmlFor="description">Description</label>
                            <input type="text" name="description" id="description" />
                        </div>
                        <div className="input_form" hidden>
                            <label htmlFor="category">Category</label>
                            <select name="category" id="category">
                                {categories.map((category, index) => (
                                    <option key={index} value={index + 1}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <div className="input_form">
                            <button type="submit">Add</button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    )
}

AddTransacForm.propTypes = {
    setShowTransacForm: PropTypes.func.isRequired,
    updateChart: PropTypes.func.isRequired,
    transacType: PropTypes.string.isRequired,
};