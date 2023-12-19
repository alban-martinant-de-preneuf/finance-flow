export default function TransactionBtn({ type, handleTransac }) {
    return (
        <button className={`transaction-btn`} onClick={handleTransac} name={`${type}-btn`}>
            {type === 'sub' ? '-' : '+'}
        </button>
    )
}