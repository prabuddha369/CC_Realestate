'use client';
import Image from 'next/image';
import Link from 'next/link';
import { toast, Toaster } from "react-hot-toast";
import { useState, useEffect } from 'react';
import { redirect } from "next/navigation";
import { BiShow } from "react-icons/bi";
import { BiSolidHide } from "react-icons/bi";
import { UserAuth } from "../context/AuthContext";
import { UploadUserData, modifyEmail, UploadUserphNumber } from '../utils/upload_data';

let flg = false;

export default function Signup() {
  const { user, googleSignIn, facebookSignIn, signUpWithEmailAndPassword } = UserAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cnfpassword, setcnfPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [phNumber, setphNumber] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [cnfpasswordVisible, setcnfPasswordVisible] = useState(false);


  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const togglecnfPasswordVisibility = () => {
    setcnfPasswordVisible(!cnfpasswordVisible);
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      flg = true;
    } catch (error) {
      console.log(error);
    }
  };
  const handleFacebookSignIn = async () => {
    try {
      await facebookSignIn();
      flg = true;
    } catch (error) {
      console.log(error);
    }
  };
  const handleEmailSignUp = () => {
    try {
      if (userName.trim() === "") {
        toast.error("Enter your full name");
      } else if (phNumber.trim() === "") {
        toast.error("Enter your phone number");
      } else if (!isValidEmail(email)) {
        toast.error("Enter a valid email!");
      } else if (!isValidPassword(password)) {
        toast.error("Password must be 8 characters or longer!");
      } else if (password !== cnfpassword) {
        toast.error("Both passwords don't match");
      }
      else {
        signUpWithEmailAndPassword(email, password);
        UploadUserData(modifyEmail(email), userName, "https://i.ibb.co/n3j7DWd/Windows-10-Default-Profile-Picture-svg.png");
        UploadUserphNumber(modifyEmail(email), phNumber);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (user) {
    if (flg) {
      UploadUserData(modifyEmail(user.email), user.displayName, user.photoURL);
    }
    redirect("/");
  }

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    return password.length >= 8;
  };



  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    windowWidth >= 768 ? (
      <div className="flex bg-cover bg-no-repeat bg-center h-screen bg-img">
        <Toaster toastOptions={{ duration: 2000 }} />
        <div className="ps-10 pt-5">
          <Link href="/"><Image src="/logo.png" height={100} width={100} /></Link>
        </div>
        <div className='ms-[20%] m-auto h-[95%] px-10 pt-2 rounded-3xl w-1/3 bg-[#D9D9D9]'>
          <div className='mb-5 font-chonburi text-black text-5xl font-bold'>Sign up</div>
          <input
            className="ps-5 mt-4 bg-white w-full h-[35px] rounded-full text-xl border-none outline-none text-black placeholder-[#808080]"
            placeholder="Enter your full name"
            type="text"
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            className="ps-5 mt-4 bg-white w-full h-[35px] rounded-full text-xl border-none outline-none text-black placeholder-[#808080]"
            placeholder="Enter your phone number"
            type="tel"
            onChange={(e) => setphNumber(e.target.value)}
          />
          <input
            className="ps-5 mt-4 bg-white w-full h-[35px] rounded-full text-xl border-none outline-none text-black placeholder-[#808080]"
            placeholder="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className='flex ps-5 mt-4 bg-white w-full h-[35px] rounded-full items-center'>
            <input
              className="w-[80%] text-xl border-none outline-none text-black placeholder-[#808080]"
              placeholder="new password"
              type={passwordVisible ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={togglePasswordVisibility}
              className="text-[#808080] cursor-pointer">
              {passwordVisible ? <BiSolidHide size={25} /> : <BiShow size={25} />}
            </button>
          </div>
          <div className='flex ps-5 mt-4 bg-white w-full h-[35px] rounded-full items-center'>
            <input
              className="w-[80%] text-xl border-none outline-none text-black placeholder-[#808080]"
              placeholder="confirm password"
              type={cnfpasswordVisible ? "text" : "password"}
              onChange={(e) => setcnfPassword(e.target.value)}
            />
            <button
              onClick={togglecnfPasswordVisibility}
              className="text-[#808080] cursor-pointer">
              {cnfpasswordVisible ? <BiSolidHide size={25} /> : <BiShow size={25} />}
            </button>
          </div>
          <div className='text-center mb-5'>
            <input
              className="mt-4 bg-black w-1/2 h-[40px] rounded-full text-xl border-none outline-none text-white"
              type="button"
              value="Sign up"
              onClick={handleEmailSignUp}
            />
          </div>
          <div className='flex text-[#4a4a4a] text-xs justify-center'>
            or
          </div>
          <div className='flex text-[#4a4a4a] text-xs justify-center'>
            Signin with
          </div>
          <div className='flex justify-center mt-2'>
            <Image onClick={handleGoogleSignIn} style={{ cursor: 'pointer' }} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEkUlEQVR4nO2Zb0wbZRzHn3taesUtRpOJYbo/DoQM5c/GMgryzxkYxbGBiQsbNBCEFGaIY8zCCuaUMSiQAQMGQWAgcSY2GeuNuzpc8NqNvRoCItE3841Dthj3ToNzbX+mVRBI197Zo2VJv8n3XZ+nn89dn6dPrwj5448/HgcoJIWqgGIoxywU4HuQTfwJSsIKBxBAKgJIQzbIJhZBhX+BE/g6VAUU2ccgXwc0UgWU4tvwNmGBJASCqiQsoMa3QRsQ433wOlk4qPEsvCkQ2llTEUAxnoEaFOIdeA3RCumEzWPwtT2IrHCK0K0f+HkUCMX4B9HBk9b0PTwNFJKJC9+NngcVfrDu8En/toJoFw9+EMnhOPGr1+DLCE40eIeAGn/vPXgsMvyHRIfgrbEMT0IlroUmaQpQaAtQKAjOSN6C05hy7Db21zgbW4pN4sI3kyGQQVh5g5+W9PJZfEChZ+ADydAqkVKR4R1vVIHv8IIvwPNwDr0oeP4aFAJ5+P76wJvl22CcfAQaCUCyC/gSPAV6JEEbLWAmdWAmwdHeAIB0wvmV35DweiQBs2x+WcDeURmACv8Hn0lYoAK9hDZiwCSPXwW/VI4E0En/ObuclPSjjRowybROBZY6FPAAyhGJNmrATF5xKWCSdQiZL1gzC2I0XDthO9rUd9e9gImccynAkRm+EAjWzMIbddcW+Qg8dCMQ6iuB3TW3rHwEHrkWQJt9JbCjehKeaoHtVd+C5x+hm7IwXwns1t60Pd2L+JNRHovYTI642UY7fSVwRDc8z0NAduZJ8A+5Z6Geif/jvF4RiEROy3D+puiPvrG4Eii/0DjqXoALVDiDnx0PBhWthENXs6HDGHtJbIGTnfX97u6Arq/iuHsBQBjMsntL4DYzCfRYOGQbDjvg7c2jlZaL11/bJhZ8W496Z2SNyeoK/vVas4XiKH5P88BENtrhfzdthrNMwjL4ylaPJi9wXIrHjwcpjpIeafxswd3VL2lrm+A9KXCBL98df+GvEjrdKfxSP2YTZjyRoDhKmt/SM+d2/6+egsbuylhBkzcwihlX8CvvRP/X4VuFwvfeiNhe1lX3E5/d51hz75zQ+RE9FvZKPq208pHIp5WWzq/2DlCDKXJ38w6PRW1qZ/b15RmU1pyRHDja2uH2FEp9ekrQl+dyutmY1iweAitFGljFdJdxL6VnIw5cGdsVdJkL2zJgjEq8aNxTV8ckTNpfs3JM1kgOFPZQsLXqO6cC77c3dSNPomPjpvkKeNKiwXLYWX1nFfy7TQM/Ik+j10fINHTqfW9IFH5RCJG1Jgd8ev2Xv53o6hJ0cHxiOG7HczVM4oI3JI7pc0HVemGeGq4MEgV+hYT8LBM/K2RN/J+eYxXTRmPo+v3m7jNGNecaMq2iX3lDprWXjWlG3sgwvSe0gY2beseQ5TF4ztXDjqt++caru5C3MzQWGdvM7L9VZDj4WCh4AZ3xuJGJm/icifb+n3xrowck6WeiC1uN+0a1TOLPajptUWVQWu13yH4IzDVk2tSGtMWqa8nzLex+ts8YU2Afg/zxxx/kaf4GzSVnCicBYF0AAAAASUVORK5CYII=" alt="Google" width={40} height={40} className='me-10' />
            <Image onClick={handleFacebookSignIn} style={{ cursor: 'pointer' }} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADK0lEQVR4nO2Zz08TQRTHNzM0MQHixaMnI2jE4Mmr/4A/okej3r0oAn+AiYke9IYkpDNFDAkRqokHL4bEEzFelIqAJP5IDPvetrXQAhXSsrRjplYMboGdnd0th/0m79TN7Pcz8+bN7KthRIoUKZJUbNg8Qxj0UYZJwnCGcsxTjpv1yBOGH2u/cbNXPmscCCVy7YRDP2XwmXIUSsFgXgIbg9m28I3fFS1yJinDZWXjDhBcIgzvyDHDMR/Hk4RjStv4f0EYThsJOBGodxqHS5RD0W/z9F9arVEOFwMxTxLWDcrBDsw8/xtgE25dD2LmQzCP2xCUwQV/3A+ZHX+WVs9U24glOiey4uzLn6LreVZ0jGfE4afWXhBFud98qDbeN2wLR3H1TV5Mpctis1IVjXR5cnn3jc3hg1Z1qpVKj+YPDVti4vuG2E9X9gCoQcSxx5v70XQr5ZDzCvBwpriveTcA8pyQB6aH2Yd+r+aPjmVEeZeUUQbg8oyAPmUAT9eDevS+W2lotlCuiPupNXFzqrAdx55l9h+TwbySeXnZ0qk4498a5/65VznPY8YS6dOhpI+Mt5myw/zs8qbn8ajqZpbXXp2XzeVtB8DY1w0tAMpwXGEF8JPOyxYKToDHc7/0VoBjSmUFlvwGGNAEoBxyKgDlgweApUAA7k2viXypsiO2GhwBpa2q47l8qSK6X2QDAXCdQo9cnriNVBVCtI9Y/qeQyibWAfhR3ApsEyfDAJiEUkBlVLZHQgAYUNjYhONt1wAxbnarfKgcGU3viC8rzirEFtYdz7U+cZv/KGIs3eUaoL4KswolLtgyyhQvc6ppFDQA4WZvqB80vgIwXPLcvZMds2YDEIa3DK2PeobTzQIgHN4bSUENLfHF45TBavgA4ENbpS7Z7lNpbOkDgE0T5nnDT8l2n1sIPQCwCcNrRhCS7T43XTrPAAxWfZ95hxh0yo6Z3wBEbtghs8MIRbI6xbFnt2u3GgDkaqVSu9p40WC2TZ7YhMOcKoC8qhB5wjblL6YGkpet2qpwnHhtlgqLRbuybleFDLNoVx6kVi15Ja61R4atU832GylSJONg6DekIcfGE7hs2QAAAABJRU5ErkJggg==" alt="Facebook" width={40} height={40} />
          </div>
          <div className='mt-3  flex justify-center'> <div className='text-sm text-[#4a4a4a]'>Already have an account?</div><Link className='text-sm text-blue-700' href="../signin"><span>Sign in</span></Link></div>
        </div>
      </div>
    ) : (
      <div className="flex bg-cover bg-no-repeat bg-center h-screen bg-img-mob">
          <Toaster toastOptions={{ duration: 2000 }} />
        <div className='mx-5 m-auto h-[73%] px-10 pt-2 rounded-3xl w-full bg-opacity-80 bg-[#D9D9D9]'>
          <div className='my-6 font-chonburi text-black text-5xl font-bold'>Sign up</div>
          <input
            className="ps-5 mt-4 bg-white w-full h-[35px] rounded-full text-xl border-none outline-none text-black placeholder-[#808080]"
            placeholder="Enter your full name"
            type="text"
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            className="ps-5 mt-4 bg-white w-full h-[35px] rounded-full text-xl border-none outline-none text-black placeholder-[#808080]"
            placeholder="Enter your phone number"
            type="tel"
            onChange={(e) => setphNumber(e.target.value)}
          />
          <input
            className="ps-5 mt-4 bg-white w-full h-[35px] rounded-full text-xl border-none outline-none text-black placeholder-[#808080]"
            placeholder="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className='flex ps-5 mt-4 bg-white w-full h-[35px] rounded-full items-center'>
            <input
              className="w-[80%] text-xl border-none outline-none text-black placeholder-[#808080]"
              placeholder="new password"
              type={passwordVisible ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={togglePasswordVisibility}
              className="text-[#808080] cursor-pointer">
              {passwordVisible ? <BiSolidHide size={25} /> : <BiShow size={25} />}
            </button>
          </div>
          <div className='flex ps-5 mt-4 bg-white w-full h-[35px] rounded-full items-center'>
            <input
              className="w-[80%] text-xl border-none outline-none text-black placeholder-[#808080]"
              placeholder="confirm password"
              type={cnfpasswordVisible ? "text" : "password"}
              onChange={(e) => setcnfPassword(e.target.value)}
            />
            <button
              onClick={togglecnfPasswordVisibility}
              className="text-[#808080] cursor-pointer">
              {cnfpasswordVisible ? <BiSolidHide size={25} /> : <BiShow size={25} />}
            </button>
          </div>
          <div className='text-center mb-5'>
            <input
              className="mt-4 bg-black w-1/2 h-[40px] rounded-full text-xl border-none outline-none text-white"
              type="button"
              value="Sign up"
              onClick={handleEmailSignUp}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div className='flex text-[#4a4a4a] text-xs justify-center'>
            or
          </div>
          <div className='flex text-[#4a4a4a] text-xs justify-center'>
            Signin with
          </div>
          <div className='flex justify-center mt-2'>
            <Image onClick={handleGoogleSignIn} style={{ cursor: 'pointer' }} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEkUlEQVR4nO2Zb0wbZRzHn3taesUtRpOJYbo/DoQM5c/GMgryzxkYxbGBiQsbNBCEFGaIY8zCCuaUMSiQAQMGQWAgcSY2GeuNuzpc8NqNvRoCItE3841Dthj3ToNzbX+mVRBI197Zo2VJv8n3XZ+nn89dn6dPrwj5448/HgcoJIWqgGIoxywU4HuQTfwJSsIKBxBAKgJIQzbIJhZBhX+BE/g6VAUU2ccgXwc0UgWU4tvwNmGBJASCqiQsoMa3QRsQ433wOlk4qPEsvCkQ2llTEUAxnoEaFOIdeA3RCumEzWPwtT2IrHCK0K0f+HkUCMX4B9HBk9b0PTwNFJKJC9+NngcVfrDu8En/toJoFw9+EMnhOPGr1+DLCE40eIeAGn/vPXgsMvyHRIfgrbEMT0IlroUmaQpQaAtQKAjOSN6C05hy7Db21zgbW4pN4sI3kyGQQVh5g5+W9PJZfEChZ+ADydAqkVKR4R1vVIHv8IIvwPNwDr0oeP4aFAJ5+P76wJvl22CcfAQaCUCyC/gSPAV6JEEbLWAmdWAmwdHeAIB0wvmV35DweiQBs2x+WcDeURmACv8Hn0lYoAK9hDZiwCSPXwW/VI4E0En/ObuclPSjjRowybROBZY6FPAAyhGJNmrATF5xKWCSdQiZL1gzC2I0XDthO9rUd9e9gImccynAkRm+EAjWzMIbddcW+Qg8dCMQ6iuB3TW3rHwEHrkWQJt9JbCjehKeaoHtVd+C5x+hm7IwXwns1t60Pd2L+JNRHovYTI642UY7fSVwRDc8z0NAduZJ8A+5Z6Geif/jvF4RiEROy3D+puiPvrG4Eii/0DjqXoALVDiDnx0PBhWthENXs6HDGHtJbIGTnfX97u6Arq/iuHsBQBjMsntL4DYzCfRYOGQbDjvg7c2jlZaL11/bJhZ8W496Z2SNyeoK/vVas4XiKH5P88BENtrhfzdthrNMwjL4ylaPJi9wXIrHjwcpjpIeafxswd3VL2lrm+A9KXCBL98df+GvEjrdKfxSP2YTZjyRoDhKmt/SM+d2/6+egsbuylhBkzcwihlX8CvvRP/X4VuFwvfeiNhe1lX3E5/d51hz75zQ+RE9FvZKPq208pHIp5WWzq/2DlCDKXJ38w6PRW1qZ/b15RmU1pyRHDja2uH2FEp9ekrQl+dyutmY1iweAitFGljFdJdxL6VnIw5cGdsVdJkL2zJgjEq8aNxTV8ckTNpfs3JM1kgOFPZQsLXqO6cC77c3dSNPomPjpvkKeNKiwXLYWX1nFfy7TQM/Ik+j10fINHTqfW9IFH5RCJG1Jgd8ev2Xv53o6hJ0cHxiOG7HczVM4oI3JI7pc0HVemGeGq4MEgV+hYT8LBM/K2RN/J+eYxXTRmPo+v3m7jNGNecaMq2iX3lDprWXjWlG3sgwvSe0gY2beseQ5TF4ztXDjqt++caru5C3MzQWGdvM7L9VZDj4WCh4AZ3xuJGJm/icifb+n3xrowck6WeiC1uN+0a1TOLPajptUWVQWu13yH4IzDVk2tSGtMWqa8nzLex+ts8YU2Afg/zxxx/kaf4GzSVnCicBYF0AAAAASUVORK5CYII=" alt="Google" width={40} height={40} className='me-10' />
            <Image onClick={handleFacebookSignIn} style={{ cursor: 'pointer' }} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADK0lEQVR4nO2Zz08TQRTHNzM0MQHixaMnI2jE4Mmr/4A/okej3r0oAn+AiYke9IYkpDNFDAkRqokHL4bEEzFelIqAJP5IDPvetrXQAhXSsrRjplYMboGdnd0th/0m79TN7Pcz8+bN7KthRIoUKZJUbNg8Qxj0UYZJwnCGcsxTjpv1yBOGH2u/cbNXPmscCCVy7YRDP2XwmXIUSsFgXgIbg9m28I3fFS1yJinDZWXjDhBcIgzvyDHDMR/Hk4RjStv4f0EYThsJOBGodxqHS5RD0W/z9F9arVEOFwMxTxLWDcrBDsw8/xtgE25dD2LmQzCP2xCUwQV/3A+ZHX+WVs9U24glOiey4uzLn6LreVZ0jGfE4afWXhBFud98qDbeN2wLR3H1TV5Mpctis1IVjXR5cnn3jc3hg1Z1qpVKj+YPDVti4vuG2E9X9gCoQcSxx5v70XQr5ZDzCvBwpriveTcA8pyQB6aH2Yd+r+aPjmVEeZeUUQbg8oyAPmUAT9eDevS+W2lotlCuiPupNXFzqrAdx55l9h+TwbySeXnZ0qk4498a5/65VznPY8YS6dOhpI+Mt5myw/zs8qbn8ajqZpbXXp2XzeVtB8DY1w0tAMpwXGEF8JPOyxYKToDHc7/0VoBjSmUFlvwGGNAEoBxyKgDlgweApUAA7k2viXypsiO2GhwBpa2q47l8qSK6X2QDAXCdQo9cnriNVBVCtI9Y/qeQyibWAfhR3ApsEyfDAJiEUkBlVLZHQgAYUNjYhONt1wAxbnarfKgcGU3viC8rzirEFtYdz7U+cZv/KGIs3eUaoL4KswolLtgyyhQvc6ppFDQA4WZvqB80vgIwXPLcvZMds2YDEIa3DK2PeobTzQIgHN4bSUENLfHF45TBavgA4ENbpS7Z7lNpbOkDgE0T5nnDT8l2n1sIPQCwCcNrRhCS7T43XTrPAAxWfZ95hxh0yo6Z3wBEbtghs8MIRbI6xbFnt2u3GgDkaqVSu9p40WC2TZ7YhMOcKoC8qhB5wjblL6YGkpet2qpwnHhtlgqLRbuybleFDLNoVx6kVi15Ja61R4atU832GylSJONg6DekIcfGE7hs2QAAAABJRU5ErkJggg==" alt="Facebook" width={40} height={40} />
          </div>
          <div className='mt-3  flex justify-center'> <div className='text-sm text-[#4a4a4a]'>Already have an account?</div><Link className='text-sm text-blue-700' href="../signin"><span>Sign in</span></Link></div>
        </div>
      </div>
    )
  );
}