import heart from '../../../assets/icons/heart-icon.png'
import github from '../../../assets/icons/github-icon.png'
import '../../../../public/styles/navigation/footer.css'


/**
 * Component for rendering site footer
 * @returns {React.JSX.Element}
 */
export default function Footer(): React.JSX.Element {
    return (
        <footer>
            <div id='footer-div'>
                <div id='footer-text'>
                    <h4>Engineered with Love</h4>
                </div>

                <div className='footer-icon'>
                    <a href='https://www.mariannedillard.com'>
                        <img src={heart} alt='red-heart-icon' />
                    </a>
                </div>

                <div className='footer-icon'>
                    <a href='https://www.github.com/dillardm89'>
                        <img src={github} alt='github-icon' />
                    </a>
                </div>
            </div>
        </footer>
    )
}
