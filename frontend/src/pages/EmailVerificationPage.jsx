/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { showToast } from '../lib/utils';


const EmailVerificationPage = () => {
    
    const [code, setCode] = useState(["", "", "", "", "", ""])
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    const { isLoading, verifyEmail, isAuthenticated, user} = useAuthStore();

useEffect(() => {
  if (isAuthenticated && user?.isVerified) {
    navigate("/", { replace: true });
  }
}, [isAuthenticated, user, navigate]);



    const handleChange = (index, value) => {
        const newCode = [...code];

        if(value.length > 1 ){
            const pastedCode = value.slice(0,6).split("");
            for(let i =0; i < 6; i++){
                newCode[i] = pastedCode[i] || "";
            }
            setCode(newCode)

            const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
            const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
            inputRefs.current[focusIndex].focus();
        }else{
            newCode[index] = value;
            setCode(newCode);

            if(value && index < 5){
                inputRefs.current[index + 1].focus();
            }
        }
    }

    const handleKeyDown = (index, e) => {
        if(e.key === "Backspace" && !code[index] && index > 0){
            inputRefs.current[index - 1].focus();
        }

    }

    const handlePaste = (e) => {
  const pastedData = e.clipboardData.getData("Text").trim();
  if (!/^\d{6}$/.test(pastedData)) return;

  const digits = pastedData.slice(0, 6).split("");
  setCode(digits);

  // Move focus to the last digit
  const lastIndex = digits.length - 1;
  inputRefs.current[lastIndex]?.focus();

  e.preventDefault();
};

    const handleSubmit = async (e) => {
        e.preventDefault();
        const verificationCode = code.join("");
        try {
            await verifyEmail(verificationCode);
            showToast("Email verified successfully");
        } catch (error) {
            console.log(error)
        }
        
    };

    useEffect(() => {
        if(code.every(digit => digit !== '')){
            handleSubmit(new Event('submit'));
        }
    }, [code])
  
  
    return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-base-100 rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-primary">
          Verify Your Email
        </h2>
        <p className="text-center text-base-content mb-6">
          Enter the 6-digit code sent to your email address.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(eL) => (inputRefs.current[index] = eL)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-2xl font-bold input input-bordered text-primary"
              />
            ))}
          </div>



          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading || code.some((digit) => !digit)}
            className="w-full btn btn-primary"
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </motion.button>
        </form>
        <p className="mt-4 text-sm text-center text-base-content">
          Already have a verified account?{" "}
          <a href="/login" className="text-primary hover:underline">
            Login
          </a>
        </p>



      </motion.div>
    </div>
  )
}

export default EmailVerificationPage