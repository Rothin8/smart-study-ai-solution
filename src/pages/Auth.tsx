import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";

// Schema for login form
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Schema for registration form
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Schema for phone login form
const phoneSchema = z.object({
  phone: z.string().min(10, "Please enter a valid phone number"),
});

// Schema for OTP verification
const otpSchema = z.object({
  otp: z.string().min(4, "Please enter a valid OTP"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;
type PhoneFormValues = z.infer<typeof phoneSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

const Auth = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "login";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [activeAuthMethod, setActiveAuthMethod] = useState("login");
  const [showOtp, setShowOtp] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const { toast } = useToast();
  const { signIn, signUp, requestOTP, verifyOTP, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Initialize forms
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
    },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate("/subscription");
    }
  }, [isAuthenticated, navigate]);

  // Handle login form submission
  const onLoginSubmit = async (values: LoginFormValues) => {
    try {
      await signIn(values.email, values.password);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in. Please check your credentials.",
        variant: "destructive",
      });
    }
  };

  // Handle registration form submission
  const onRegisterSubmit = async (values: RegisterFormValues) => {
    try {
      await signUp(values.email, values.password, values.name);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle phone form submission
  const onPhoneSubmit = async (values: PhoneFormValues) => {
    try {
      setPhoneNumber(values.phone);
      await requestOTP(values.phone);
      setShowOtp(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle OTP form submission
  const onOtpSubmit = async (values: OtpFormValues) => {
    try {
      await verifyOTP(values.otp);
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-white py-4 px-6 shadow-sm">
        <div className="container mx-auto flex justify-center">
          <Logo size="large" />
        </div>
      </div>
      
      <main className="flex-grow flex items-center justify-center py-12 px-6 hero-pattern">
        <div className="w-full max-w-md animate-fade-in">
          <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-200">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {showOtp ? "Verify OTP" : activeAuthMethod === "login" ? "Welcome Back" : "Create an Account"}
              </h1>
              <p className="text-gray-600 mt-2">
                {showOtp
                  ? `Enter the code sent to ${phoneNumber}`
                  : activeAuthMethod === "login"
                  ? "Sign in to continue to Solution.AI"
                  : "Start your learning journey with Solution.AI"}
              </p>
            </div>
            
            {showOtp ? (
              <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>One-Time Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter OTP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="submit"
                    className="w-full bg-chatbot hover:bg-chatbot/90 rounded-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full rounded-full"
                    onClick={() => setShowOtp(false)}
                    disabled={isLoading}
                  >
                    Back to Phone Login
                  </Button>
                </form>
              </Form>
            ) : (
              <>
                {/* Sign In / Sign Up buttons */}
                <div className="flex gap-2 mb-6">
                  <Button
                    type="button"
                    variant={activeAuthMethod === "login" ? "default" : "outline"}
                    className={`w-1/2 rounded-full ${activeAuthMethod === "login" ? "bg-chatbot hover:bg-chatbot/90" : ""}`}
                    onClick={() => setActiveAuthMethod("login")}
                  >
                    Sign In
                  </Button>
                  <Button
                    type="button"
                    variant={activeAuthMethod === "register" ? "default" : "outline"}
                    className={`w-1/2 rounded-full ${activeAuthMethod === "register" ? "bg-chatbot hover:bg-chatbot/90" : ""}`}
                    onClick={() => setActiveAuthMethod("register")}
                  >
                    Sign Up
                  </Button>
                </div>
              
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-2 mb-8">
                    <TabsTrigger value="login">Email Login</TabsTrigger>
                    <TabsTrigger value="phone">Phone Login</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login" className="space-y-6">
                    {activeAuthMethod === "login" ? (
                      <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                          <FormField
                            control={loginForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="your@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="******" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button
                            type="submit"
                            className="w-full bg-chatbot hover:bg-chatbot/90 rounded-full"
                            disabled={isLoading}
                          >
                            {isLoading ? "Signing in..." : "Sign In"}
                          </Button>
                        </form>
                      </Form>
                    ) : (
                      <Form {...registerForm}>
                        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                          <FormField
                            control={registerForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="your@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="******" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="******" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button
                            type="submit"
                            className="w-full bg-chatbot hover:bg-chatbot/90 rounded-full"
                            disabled={isLoading}
                          >
                            {isLoading ? "Creating Account..." : "Create Account"}
                          </Button>
                        </form>
                      </Form>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="phone" className="space-y-6">
                    <Form {...phoneForm}>
                      <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
                        <FormField
                          control={phoneForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button
                          type="submit"
                          className="w-full bg-chatbot hover:bg-chatbot/90 rounded-full"
                          disabled={isLoading}
                        >
                          {isLoading ? "Sending OTP..." : "Send OTP"}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </>
            )}
            
            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-gray-500 hover:text-chatbot">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Auth;
