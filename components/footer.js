import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faHeart} from '@fortawesome/free-regular-svg-icons'

const Footer = () => {
    return (
        <footer className="text-center">
            <FontAwesomeIcon icon={faHeart}/>
            {` Made with !ooh by deltron.eth `}
            <FontAwesomeIcon icon={faHeart}/>
            <br/>
            {` Updated with season 47 changes. `}
        </footer>
    )
}

export default Footer;