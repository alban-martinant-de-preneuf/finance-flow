import TransactionBtn from './TransactionBtn';
import AddTransacForm from "./AddTransacForm";
import { useState } from 'react';

export default function Foot({ updateChart }) {
    
        const [showTransacForm, setShowTransacForm] = useState(false);
    
        const handleTransac = (e) => {
            e.preventDefault();
            setShowTransacForm(true);
        }
    
        return (
            <main>
                <TransactionBtn type="sub" handleTransac={handleTransac} />
                <TransactionBtn type="add" handleTransac={handleTransac} />
                {showTransacForm && <AddTransacForm setShowTransacForm={setShowTransacForm} updateChart={updateChart} />}
            </main>
        )
}