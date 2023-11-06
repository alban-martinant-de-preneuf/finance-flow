export default function TransactionBtn({ type }) {
    return (
        <button className={`transaction-btn-${type}`}>
            {type === 'sub' ? '-' : '+'}
        </button>
    )
}