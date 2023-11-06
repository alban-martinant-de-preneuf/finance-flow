import ProgressBar from './ProgressBar';
import TransactionBtn from './TransactionBtn';

export default function View() {
    return (
        <main>
            <ProgressBar />
            <TransactionBtn type="sub" />
            <TransactionBtn type="add" />
        </main>
    )
}