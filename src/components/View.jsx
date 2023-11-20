import ProgressBar from './ProgressBar';
import TransactionBtn from './TransactionBtn';
import AddTransacForm from "./AddTransacForm";
import { useState } from 'react';

export default function View() {

    const [showTransacForm, setShowTransacForm] = useState(false);
    const [update, setUpdated] = useState(0);

    const handleTransac = (e) => {
        e.preventDefault();
        setShowTransacForm(true);
    }

    return (
        <main>
            <ProgressBar update={update} />
            <TransactionBtn type="sub" handleTransac={handleTransac} />
            <TransactionBtn type="add" handleTransac={handleTransac} />
            {showTransacForm && <AddTransacForm setShowTransacForm={setShowTransacForm} setUpdated={setUpdated} />}
        </main>
    )
}