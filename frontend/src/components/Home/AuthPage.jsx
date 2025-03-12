import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    walletAddress: "",
    role: "DEVELOPER",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value) => {
    setFormData({ ...formData, role: value });
  };

  const handleSubmit = async () => {
    try {
      const url = isLogin ? "/api/v1/user/login" : "/api/v1/user/sign-up";
      const data = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;
      const response = await axios.post(url, data);
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#5b2333]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-96 bg-[#d49c79] text-white shadow-lg p-6 rounded-2xl border-4 border-[#d38a65]">
          <h2 className="text-2xl font-bold text-center text-[#5b2333]">
            {isLogin ? "Login to decnAIX" : "Sign Up for decnAIX"}
          </h2>
          <CardContent className="mt-4 space-y-4">
            {!isLogin && (
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="bg-[#5b2333] text-white"
              />
            )}
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="bg-[#5b2333] text-white"
            />
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="bg-[#5b2333] text-white"
            />
            {!isLogin && (
              <Input
                name="walletAddress"
                value={formData.walletAddress}
                onChange={handleChange}
                placeholder="Wallet Address"
                className="bg-[#5b2333] text-white"
              />
            )}
            {!isLogin && (
              <RadioGroup
                defaultValue={formData.role}
                onValueChange={handleRoleChange}
                className="flex justify-between"
              >
                <div className="flex items-center space-x-2 text-[#5b2333]">
                  <RadioGroupItem value="DEVELOPER" id="r1" />
                  <Label htmlFor="r1">Renter</Label>
                </div>
                <div className="flex items-center space-x-2 text-[#5b2333]">
                  <RadioGroupItem value="GPU_CONTRIBUTOR" id="r2" />
                  <Label htmlFor="r2">Provider</Label>
                </div>
                <div className="flex items-center space-x-2 text-[#5b2333]">
                  <RadioGroupItem value="UNIVERSAL" id="r3" />
                  <Label htmlFor="r3">Both</Label>
                </div>
              </RadioGroup>
            )}
            <Button
              onClick={handleSubmit}
              className="w-full bg-[#5b2333] hover:bg-[#685c42]"
            >
              {isLogin ? "Login" : "Sign Up"}
            </Button>
            <p
              className="text-center text-sm text-[#5b2333] cursor-pointer"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Login"}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
