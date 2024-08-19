import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

function Footer() {
    return (
        <footer className="bg-blue-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center space-x-8 mb-8">
                <a href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">Facebook</span>
                    <FontAwesomeIcon icon={faFacebookF} className="text-2xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">Twitter</span>
                    <FontAwesomeIcon icon={faTwitter} className="text-2xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">Instagram</span>
                    <FontAwesomeIcon icon={faInstagram} className="text-2xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">LinkedIn</span>
                    <FontAwesomeIcon icon={faLinkedinIn} className="text-2xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">Email</span>
                    <FontAwesomeIcon icon={faEnvelope} className="text-2xl" />
                </a>
            </div>
            <div className="text-center text-gray-400 text-sm">
                
                <div className="mt-8">
                    &copy; 2024 Kiber Club. Todos los derechos reservados.
                </div>
            </div>
        </div>
    </footer>
    );
}

export default Footer;
