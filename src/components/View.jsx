import ProgressBar from './ProgressBar';

export default function View({ update }) {

    return (
        <main>
            <ProgressBar update={update} />
        </main>
    )
}