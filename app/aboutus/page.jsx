"use client";
import { BsFillPersonFill } from "react-icons/bs";
import { BsFacebook } from "react-icons/bs";
import { BsInstagram } from "react-icons/bs";
import { BiSolidDownArrow } from "react-icons/bi";
import { BiSolidUpArrow } from "react-icons/bi";
import { AiOutlinePoweroff } from "react-icons/ai";
import { FiMail } from "react-icons/fi";
import { BsWhatsapp } from "react-icons/bs";
import { useState, useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';

import Image from "next/image";
import Link from "next/link";

export default function Aboutus() {
  const { user, logOut } = UserAuth();

  const [userName, setUserName] = useState("<Anonymous>");
  const [dpUrl, setDpUrl] = useState(
    "https://i.ibb.co/n3j7DWd/Windows-10-Default-Profile-Picture-svg.png"
  );

  const [showSignOutDropdown, setShowSignOutDropdown] = useState(false);
  const handleToggleSignOutDropdown = () => {
    setShowSignOutDropdown(!showSignOutDropdown);
  };

  useEffect(() => {
    if (user) {
      setUserName(user.displayName);
      setDpUrl(user.photoURL);
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER;
  const whatsappURL = `http://wa.me/${phoneNumber}`;


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
      <div className="bg-cover bg-no-repeat bg-center h-screen bg-img">
        <div className="flex">
          <div className="ps-10 pt-5">
            <Link href="/"><Image src="/logo.png" height={100} width={100} /></Link>
          </div>
          <div className="flex mt-9 ms-[10%] me-20 h-14 w-[60%] bg-white text-black rounded-full justify-between items-center text-xl">
            <Link href="../../"><div className="ps-10">Home</div></Link>
            <Link href="../properties/all"><div>Properties</div></Link>
            <Link href="../sell_rent"><div>Sell/Rent</div></Link>
            <Link href=""><div className="pe-10 text-blue-700">About us</div></Link>
          </div>
          {user ? (
            <div style={{ cursor: 'pointer' }} className='flex mt-11 h-fit me-5 absolute right-0 text-right items-center' onClick={handleToggleSignOutDropdown}>
              <div>
                <Image
                  src={dpUrl}
                  alt="Photo"
                  width={40}
                  height={40}
                  className="rounded-full" />
              </div>
              <div>{showSignOutDropdown ? <BiSolidUpArrow className='text- ms-5 text-black' size={12} /> : <BiSolidDownArrow className='ms-5 text-black' size={12} />}</div>
              {showSignOutDropdown && (
                <div
                  className="absolute right-0 w-[10vh] mt-24 bg-white text-black rounded-xl p-2">
                  <div className="flex items-center" onClick={handleSignOut}>
                    <AiOutlinePoweroff size={10} />
                    <button className="ps-2 text-[8px]">
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (<Link href="/signup">
            <div className='pt-11 flex text-black'>
              <BsFillPersonFill size={30} />
              <div className='ps-2 pt-1'>Sign up</div>
            </div>
          </Link>)}
        </div>
        <div className="mx-40 mt-[5%] h-[70.5%] w-[75%] p-5 bg-[#D9D9D9] bg-opacity-95 rounded-t-3xl overflow-y-auto custom-scrollbar" style={{ maxHeight: "100%" }}>
          <style jsx>
            {`
            /* Style for custom scrollbar */
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: gray transparent;
            }

            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: gray;
              border-radius: 5px;
            }

            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
          `}
          </style>
          <div className="pt-5 ps-5 font-bold font-chonburi text-5xl text-black">ABOUT US</div>
          <br />
          <div className="p-5 text-black text-lg leading-relaxed">
            <div className="font-chonburi font-bold text-3xl text-black">About CC Real Estate</div>
            <p>
              Welcome to CC Real Estate, where your dreams of finding the perfect property become a reality. Our passion for real estate and commitment to excellence drive us to provide exceptional services for both buyers and sellers.
            </p>
            <div className="font-chonburi font-bold text-3xl text-black">Who We Are</div>
            <p>
              At CC Real Estate, we are more than just real estate agents; we are your trusted partners in the world of real estate. Our dedicated team is comprised of experienced professionals who possess in-depth knowledge of the local real estate market. With years of industry experience, we have the expertise to guide you through the complex process of buying, selling, or investing in properties.
            </p>
            <div className="font-chonburi font-bold text-3xl text-black">Our Mission</div>
            <p>
              Our mission at CC Real Estate is to help you achieve your real estate goals while making the journey as seamless as possible. Whether you are looking for your dream home, selling a property, or exploring investment opportunities, we are committed to delivering the highest level of service, integrity, and professionalism. We believe in building lasting relationships with our clients based on trust and satisfaction.
            </p>
            <div className="font-chonburi font-bold text-3xl text-black">Connect with us</div>
            <div className="flex pt-10 ps-60 w-[70%] justify-between items-center">
              <BsFacebook size={30} />
              <BsInstagram size={30} />
              <Link href="mailto:cc.realestate.in@gmail.com"><FiMail size={30} /></Link>
              <Link href={whatsappURL}><BsWhatsapp size={30} /></Link>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="bg-cover bg-no-repeat bg-center h-screen bg-img-mob">
        <div className="flex">
          <div className="ps-10 pt-5">
            <Link href="/"><Image src="/logo.png" height={100} width={100} /></Link>
          </div>
          <div className="flex mx-[5%] mt-9 h-14 w-[90%] bg-white text-black rounded-full justify-between items-center text-sm fixed bottom-5">
            <Link href="/"><div className='px-5 py-4'>Home</div></Link>
            <Link href="/properties/all" className='px-2 py-4'><div>Properties</div></Link>
            <Link href="/sell_rent" className='px-2 py-4 '><div>Sell/Rent</div></Link>
            <Link href="" className='px-2 py-4 text-blue-700'><div className='pe-5'>About us</div></Link>
          </div>
          <Link href={whatsappURL} className='fixed bottom-14 right-2'>
            <img className='w-[50px] h-[50px]' src="data:image/png;base64,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" />
          </Link>
          {user ? (
            <div style={{ cursor: 'pointer' }} className='flex mt-8 h-fit me-5 absolute right-0 text-right items-center' onClick={handleToggleSignOutDropdown}>
              <div>
                <Image
                  src={dpUrl}
                  alt="Photo"
                  width={40}
                  height={40}
                  className="rounded-full" />
              </div>
              <div>{showSignOutDropdown ? <BiSolidUpArrow className='text- ms-5 text-black' size={12} /> : <BiSolidDownArrow className='ms-5 text-black' size={12} />}</div>
              {showSignOutDropdown && (
                <div
                  className="absolute right-0 w-[10vh] mt-24 bg-white text-black rounded-xl p-2">
                  <div className="flex items-center" onClick={handleSignOut}>
                    <AiOutlinePoweroff size={10} />
                    <button className="ps-2 text-[8px]">
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (<Link href="/signup" className="absolute right-5  mt-8">
            <div className='flex text-black'>
              <BsFillPersonFill size={30} />
              <div className='ps-2 pt-1'>Sign up</div>
            </div>
          </Link>)}
        </div>
        <div className="ms-[10%] mt-[5%] h-[65%] w-[80%] p-5 bg-[#D9D9D9] bg-opacity-95 rounded-3xl overflow-y-auto custom-scrollbar" style={{ maxHeight: "100%" }}>
          <style jsx>
            {`
            /* Style for custom scrollbar */
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: gray transparent;
            }

            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: gray;
              border-radius: 5px;
            }

            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
          `}
          </style>
          <div className="pt-5 ps-16 font-bold font-chonburi text-3xl text-black">ABOUT US</div>
          <br />
          <div className="p-1 text-black text-md text-center leading-relaxed">
            <div className="font-chonburi font-bold text-xl text-black">About CC Real Estate</div>
            <p>
              Welcome to CC Real Estate, where your dreams of finding the perfect property become a reality. Our passion for real estate and commitment to excellence drive us to provide exceptional services for both buyers and sellers.
            </p>
            <div className="font-chonburi font-bold text-xl text-black">Who We Are</div>
            <p>
              At CC Real Estate, we are more than just real estate agents; we are your trusted partners in the world of real estate. Our dedicated team is comprised of experienced professionals who possess in-depth knowledge of the local real estate market. With years of industry experience, we have the expertise to guide you through the complex process of buying, selling, or investing in properties.
            </p>
            <div className="font-chonburi font-bold text-xl text-black">Our Mission</div>
            <p>
              Our mission at CC Real Estate is to help you achieve your real estate goals while making the journey as seamless as possible. Whether you are looking for your dream home, selling a property, or exploring investment opportunities, we are committed to delivering the highest level of service, integrity, and professionalism. We believe in building lasting relationships with our clients based on trust and satisfaction.
            </p>
            <div className="font-chonburi font-bold text-xl text-black">Connect with us</div>
            <div className="ms-10 flex pt-10 ps-15 w-[70%] justify-between items-center">
              <BsFacebook size={30} />
              <BsInstagram size={30} />
              <Link href="mailto:cc.realestate.in@gmail.com"><FiMail size={30} /></Link>
              <Link href={whatsappURL}><BsWhatsapp size={30} /></Link>
            </div>
          </div>
        </div>
      </div>
    )
  );
}