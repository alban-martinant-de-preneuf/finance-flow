export default function TransactionBtn({ type, handleTransac }) {
    return (
        <button className={`transaction-btn`} onClick={handleTransac}>
            {type === 'sub' ? '-' : '+'}
        </button>
    )
}