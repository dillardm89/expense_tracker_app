import '../../../../public/styles/components/loading-spinner.css'


/**
 * Component for rendering loading spinner when logging in user or loading data
 * @returns {React.JSX.Element}
 */
export default function LoadingSpinner(): React.JSX.Element {
    return (
        <div className='spinner-container'>
            <div className='loader'>
            </div>
        </ div >
    )
}
