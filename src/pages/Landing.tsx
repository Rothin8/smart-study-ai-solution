
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import { BookOpen, MessageSquare, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="hero-pattern py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Master Your Studies with AI
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Solution.AI is your personalized study assistant, powered by artificial intelligence. 
                  Get answers, explanations, and help with any subject instantly.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  {isAuthenticated ? (
                    <Link to="/chat">
                      <Button className="w-full sm:w-auto bg-chatbot hover:bg-chatbot/90 text-lg py-6 px-8">
                        Start Chatting
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/auth?tab=register">
                      <Button className="w-full sm:w-auto bg-chatbot hover:bg-chatbot/90 text-lg py-6 px-8">
                        Get Started
                      </Button>
                    </Link>
                  )}
                  <Link to="/subscription">
                    <Button variant="outline" className="w-full sm:w-auto text-lg py-6 px-8">
                      View Plans
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="md:w-1/2 animate-fade-in" style={{ animationDelay: "200ms" }}>
                <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
                  <div className="bg-gradient-bg text-white p-4">
                    <h3 className="font-bold">Solution.AI Chat</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="chat-bubble-user p-3 ml-auto max-w-[80%]">
                      <p>Can you explain photosynthesis in simple terms?</p>
                    </div>
                    <div className="chat-bubble-ai p-3 max-w-[80%]">
                      <p>
                        Photosynthesis is how plants make their food! They take carbon dioxide from the air, water from the soil, and energy from sunlight to create glucose (sugar) and oxygen. The glucose gives plants energy to grow, and the oxygen is released into the air for us to breathe.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Why Choose Solution.AI?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="animate-fade-in" style={{ animationDelay: "0ms" }}>
                <FeatureCard
                  icon={<BookOpen />}
                  title="Personalized Learning"
                  description="Get customized explanations based on your class, board, and learning style. We adapt to your educational needs."
                />
              </div>
              
              <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
                <FeatureCard
                  icon={<MessageSquare />}
                  title="24/7 Study Help"
                  description="Get instant answers to your questions any time of day or night. Never feel stuck on a problem again."
                />
              </div>
              
              <div className="animate-fade-in" style={{ animationDelay: "400ms" }}>
                <FeatureCard
                  icon={<Calendar />}
                  title="Exam Preparation"
                  description="Prepare for exams with practice questions, concept reviews, and study materials tailored to your syllabus."
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-chatbot text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Learning Journey?
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join thousands of students who have improved their grades and understanding with Solution.AI.
            </p>
            {isAuthenticated ? (
              <Link to="/chat">
                <Button className="bg-white text-chatbot hover:bg-gray-100 text-lg py-6 px-8">
                  Start Chatting Now
                </Button>
              </Link>
            ) : (
              <Link to="/auth?tab=register">
                <Button className="bg-white text-chatbot hover:bg-gray-100 text-lg py-6 px-8">
                  Sign Up For Free
                </Button>
              </Link>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Landing;
