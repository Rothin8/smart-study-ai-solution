
import { Link } from "react-router-dom";

interface LogoProps {
  size?: "small" | "medium" | "large";
  showTagline?: boolean;
}

const Logo = ({ size = "medium", showTagline = true }: LogoProps) => {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "text-xl md:text-2xl";
      case "large":
        return "text-4xl md:text-5xl";
      default:
        return "text-2xl md:text-3xl";
    }
  };

  return (
    <Link to="/" className="flex items-center">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-chatbot to-blue-500 flex items-center justify-center text-white font-bold text-lg">
          S
        </div>
        <div className="ml-2">
          <h1 className={`font-bold bg-clip-text text-transparent bg-gradient-to-r from-chatbot to-blue-500 ${getSizeClasses()}`}>
            Solution.AI
          </h1>
          {showTagline && (
            <p className="text-sm text-gray-500">Your Study Buddy</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Logo;
