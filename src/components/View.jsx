import ProgressBar from './ProgressBar';

export default function View({ update, setTotal, total }) {

    return (
        <main>
            <ProgressBar update={update} setTotal={setTotal} total={total} />
        </main>
    )
}