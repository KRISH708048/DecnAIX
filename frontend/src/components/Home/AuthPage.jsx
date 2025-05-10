import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userAtom } from "@/store/authAtom";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(userAtom);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    walletAddress: "",
    role: "Both",
  });
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear error when user types
  };

  const handleRoleChange = (value) => {
    setFormData({ ...formData, role: value });
  };

  const validateForm = () => {
    if (!formData.email) {
      setError("Email is required");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (!isLogin && !formData.name) {
      setError("Name is required");
      return false;
    }
    if (!isLogin && !formData.walletAddress) {
      setError("Wallet address is required");
      return false;
    }
    return true;
  };

  const handleAuthSuccess = (response) => {
    const token = response.data.token;
    let payload;
    try {
      payload = JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      setError("Invalid authentication token received");
      return;
    }

    const expiry = payload.exp * 1000;
    
    // Store auth data
    localStorage.setItem("token", token);
    localStorage.setItem("tokenExpiry", expiry.toString());
    localStorage.setItem("user", JSON.stringify(response.data.user));
    
    // Update Recoil state
    setUser({
      userId: response.data.user.id,
      name: response.data.user.name,
      role: response.data.user?.role || formData.role,
      validTill: expiry.toString(),
    });

    // Navigate based on role
    const role = response.data.user?.role || formData.role;
    switch (role.toLowerCase()) {
      case "both":
        navigate("/");
        break;
      case "tenant":
        navigate("/rent");
        break;
      case "provider":
        navigate("/provider");
        break;
      default:
        navigate("/");
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const response = await axios.post(
          "http://localhost:3000/api/v1/user/login",
          {
            email: formData.email,
            password: formData.password,
          },
          {
            timeout: 10000, // 10 second timeout
          }
        );
        handleAuthSuccess(response);
      } else {
        await axios.post(
          "http://localhost:3000/api/v1/user/sign-up", 
          formData,
          { timeout: 10000 }
        );
        setIsSignupSuccess(true);
        setIsLogin(true);
        setFormData(prev => ({
          ...prev,
          password: "",
          walletAddress: "",
          name: "",
        }));
      }
    } catch (error) {
      let errorMessage = "Authentication failed";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Network error - please check your connection";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Auto-redirect if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      if (user?.userId && user?.validTill) {
        const now = Date.now();
        const expiry = parseInt(user.validTill);
        
        if (now < expiry) {
          const role = user.role.toLowerCase();
          switch (role) {
            case "both":
              navigate("/");
              break;
            case "tenant":
              navigate("/rent");
              break;
            case "provider":
              navigate("/provider");
              break;
            default:
              navigate("/");
          }
        } else {
          // Token expired - clear storage
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiry");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
    };

    checkAuth();
  }, [user, navigate, setUser]);

  return (
    <div className="w-full h-screen flex bg-[#5b2333]">
      {/* Left side with centered image */}
      <div className="w-2/3 flex items-center justify-center bg-[#5b2333] p-8">
        <img
          src="/assets/authbg.png"
          alt="Authentication Background"
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Right side with form */}
      <div className="md:w-1/3 sm:w-full h-screen bg-[#d49c79] text-white shadow-lg p-8 rounded-l-2xl border-4 border-[#d38a65] flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Card className="border-0 ">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-3xl font-bold text-center text-[#5b2333] mb-4">
                {isLogin ? "Login to decnAIX" : "Sign Up for decnAIX"}
              </h2>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Success Alert */}
              {isSignupSuccess && (
                <Alert className="mb-4 bg-green-100 border-green-400 text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>
                    Account created. Please login now.
                  </AlertDescription>
                </Alert>
              )}

              {!isLogin && (
                <div className="space-y-2">
                  <Label className="text-[#5b2333]">Full Name</Label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="bg-white text-[#5b2333] border-[#5b2333] focus-visible:ring-[#5b2333]"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-[#5b2333]">Email Address</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="bg-white text-[#5b2333] border-[#5b2333] focus-visible:ring-[#5b2333]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#5b2333]">Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="bg-white text-[#5b2333] border-[#5b2333] focus-visible:ring-[#5b2333]"
                />
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label className="text-[#5b2333]">Wallet Address</Label>
                    <Input
                      name="walletAddress"
                      value={formData.walletAddress}
                      onChange={handleChange}
                      placeholder="0x..."
                      className="bg-white text-[#5b2333] border-[#5b2333] focus-visible:ring-[#5b2333]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="block text-[#5b2333]">Account Type</Label>
                    <RadioGroup
                      defaultValue={formData.role}
                      onValueChange={handleRoleChange}
                      className="grid grid-cols-3 gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="Tenant"
                          id="r1"
                          className="text-[#5b2333] border-[#5b2333]"
                        />
                        <Label htmlFor="r1" className="text-[#5b2333]">
                          Renter
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="Provider"
                          id="r2"
                          className="text-[#5b2333] border-[#5b2333]"
                        />
                        <Label htmlFor="r2" className="text-[#5b2333]">
                          Provider
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="Both"
                          id="r3"
                          className="text-[#5b2333] border-[#5b2333]"
                        />
                        <Label htmlFor="r3" className="text-[#5b2333]">
                          Both
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </>
              )}

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#5b2333] hover:bg-[#7a3b4b] text-white py-6 text-lg font-semibold mt-4"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isLogin ? (
                  "Login"
                ) : (
                  "Sign Up"
                )}
              </Button>

              <p className="text-center text-sm text-[#5b2333] mt-4">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
                  }}
                  className="font-medium underline hover:text-[#7a3b4b]"
                >
                  {isLogin ? "Sign up" : "Login"}
                </button>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}