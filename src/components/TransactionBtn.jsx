export default function TransactionBtn({ type, handleTransac }) {
    return (
        <button className={`transaction-btn-${type}`} onClick={handleTransac}>
            {type === 'sub' ? '-' : '+'}
        </button>
    )
}