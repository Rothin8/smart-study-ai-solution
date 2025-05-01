
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 py-8 px-6 border-t border-gray-200">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-chatbot to-blue-500 flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="text-xl font-bold text-gray-800">Solution.AI</span>
            </Link>
            <p className="text-sm text-gray-500 mt-2">Your AI-powered study companion</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <p className="text-sm text-gray-500">&copy; {currentYear} Solution.AI. All rights reserved.</p>
            <div className="mt-2 flex space-x-4">
              <Link to="/terms" className="text-sm text-gray-500 hover:text-chatbot">
                Terms
              </Link>
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-chatbot">
                Privacy
              </Link>
              <Link to="/contact" className="text-sm text-gray-500 hover:text-chatbot">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
