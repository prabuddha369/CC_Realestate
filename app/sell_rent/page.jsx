"use client";
import Image from "next/image";
import Link from "next/link";
import { BiSolidDownArrow } from "react-icons/bi";
import { BiSolidUpArrow } from "react-icons/bi";
import { AiOutlinePoweroff } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";
import { useState, useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';
import React from 'react';
import { useRouter } from 'next/navigation'
import { Oval } from 'react-loader-spinner';
import { toast, Toaster } from "react-hot-toast";

export default function Home() {
  const { user, logOut } = UserAuth();
  const [dpUrl, setDpUrl] = useState(
    "https://i.ibb.co/n3j7DWd/Windows-10-Default-Profile-Picture-svg.png"
  );

  const router = useRouter()
  const [uploading, setUploading] = useState(false);
  const [showSignOutDropdown, setShowSignOutDropdown] = useState(false);
  const handleToggleSignOutDropdown = () => {
    setShowSignOutDropdown(!showSignOutDropdown);
  };

  const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER;
  const whatsappURL = `http://wa.me/${phoneNumber}`;

  const handleUpload = async () => {
    if (name === "" || contact === "" || email === "" || selectedCategory === "Select Category" || minprice === "" || maxprice === "" || sellRent === "") {
      toast.error("Please fill in all the fields.");
      return;
    }
    try {
      setUploading(true);
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Include any required data in the request body
        body: JSON.stringify({
          name,
          email,
          contact,
          minprice,
          maxprice,
          sellRent,
          selectedCategory,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push('/');
        toast.success("Submitted successfully!");
        setUploading(false);
      } else {
        const errorData = await response.json();
        console.log('Error sending email:', errorData);
        setUploading(false);
      }
    } catch (error) {
      console.log('An error occurred:', error);
      setUploading(false);
    }
  }


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [minprice, setMinValue] = useState("");
  const [maxprice, setMaxValue] = useState("");
  const [sellRent, setSellRent] = useState('');

  useEffect(() => {
    if (user) {
      setDpUrl(user.photoURL);
    }
  }, [user]);
  const [selectedCategory, setSelectedCategory] = useState('Select Category'); // State to track the selected category

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value); // Update the selected category when the selection changes
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
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


  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const handleKeyboardVisibility = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.clientHeight;

      setIsKeyboardOpen(windowHeight - documentHeight > 100);
    };

    window.addEventListener('resize', handleKeyboardVisibility);
    window.addEventListener('orientationchange', handleKeyboardVisibility);

    return () => {
      window.removeEventListener('resize', handleKeyboardVisibility);
      window.removeEventListener('orientationchange', handleKeyboardVisibility);
    };
  }, []);

  return (
    windowWidth >= 768 ? (
      <div className="bg-cover bg-no-repeat bg-center h-screen bg-img">
        <Toaster toastOptions={{ duration: 2000 }} />
        <style>
          {`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          display: none;
        }
      `}
        </style>
        <div className="flex">
          <div className="ps-10 pt-5">
            <Link href="/"><Image src="/logo.png" height={100} width={100} /></Link>
          </div>
          <div className="flex mt-9 ms-[10%] me-20 h-14 w-[60%] bg-white text-black rounded-full justify-between items-center text-xl">
            <Link href="../../"><div className="ps-10">Home</div></Link>
            <Link href="../properties/all"><div>Properties</div></Link>
            <Link href=""><div className="text-blue-700">Sell/Rent</div></Link>
            <Link href="../aboutus"><div className="pe-10">About us</div></Link>
          </div>
          {user ? (
            <div style={{ cursor: 'pointer' }} className='flex mt-11 h-fit me-10 text-right items-center' onClick={handleToggleSignOutDropdown}>
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
                  className="absolute right-0 mt-24 me-14 bg-white text-black rounded-xl p-2"
                >
                  <div className="flex" onClick={handleSignOut}>
                    <AiOutlinePoweroff size={20} />
                    <button className="ps-2 text-xs">
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
        <div className="mx-40 mt-[5%] h-[70.5%] w-[75%] p-5 bg-[#D9D9D9] bg-opacity-95 rounded-t-3xl">
          <div className="ps-7 font-chonburi font-bold text-4xl text-black">READY TO MARKET?</div>
          <p className="pt-5 ps-7 text-black">List your property with our experts today</p>
          <div className="flex flex row">
            <div className="flex flex-col w-[60%] mt-10 ms-7">
              <input
                className="ps-5 bg-white w-full h-[40px] rounded-full text-xl border-none outline-none text-black placeholder-[#808080]"
                placeholder="Your full name"
                name="Name"
                onChange={(e) => setName(e.target.value)}
                type="text"
              />
              <input
                className="ps-5 mt-4 bg-white w-full h-[40px] rounded-full text-xl border-none outline-none text-black placeholder-[#808080]"
                placeholder="Contact number"
                name="Contact"
                type="number"
                onChange={(e) => setContact(e.target.value)}
              />
              <input
                className="ps-5 mt-4 bg-white w-full h-[40px] rounded-full text-xl border-none outline-none text-black placeholder-[#808080]"
                placeholder="Email"
                name="Email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-5 px-5 w-full">
              <select
                name="Type"
                className={`ps-5 mt-4 bg-white w-full h-[40px] rounded-full text-xl border-none outline-none ${selectedCategory === 'Select Category' ? 'text-[#808080]' : 'text-black'
                  }`}
                onChange={handleCategoryChange}
                style={{ cursor: 'pointer' }}
              >
                <option value="Select Category" className="text-[#808080]">
                  Select property type
                </option>
                <option value="Land lot" className="text-black">Land lot</option>
                <option value="Apartment" className="text-black">Apartment</option>
                <option value="Shop" className="text-black">Shop</option>
                <option value="Office" className="text-black">Office</option>
                <option value="House" className="text-black">House</option>
                <option value="Warehouse" className="text-black">Warehouse</option>
              </select>

              <div className="flex ps-7 mt-4 bg-white w-full h-[40px] rounded-full text-xl border-none outline-none text-[#808080] justify-between items-center">
                <span className="w-1/3" style={{ cursor: 'default' }}>Price Range</span>
                <span>Rs</span>
                <input
                  className="ms-2 me-[5px] bg-[#D9D9D9] w-1/3 h-[30px] rounded-full text-sm text-black text-center"
                  placeholder="Min value"
                  name="min value"
                  onChange={(e) => setMinValue(e.target.value)}
                  type="number"
                />
                <span>Rs</span>
                <input
                  className="ms-2 me-[5px] bg-[#D9D9D9] w-1/3 h-[30px] rounded-full text-sm text-black text-center"
                  placeholder="Max value"
                  name="Max Value"
                  type="number"
                  onChange={(e) => setMaxValue(e.target.value)}
                />
              </div>
              <div className="flex ps-5 mt-4 bg-white w-full h-[40px] rounded-full text-xl border-none outline-none text-[#808080] justify-between items-center">
                <span style={{ cursor: 'default' }}>Want to sell/rent?</span>
                <div className="flex items-center mt-2 me-40">
                  <input
                    type="radio"
                    id="sell"
                    name="sell-rent"
                    value="Sell"
                    onChange={(e) => setSellRent(e.target.value)}
                    className="mr-2"
                  />
                  <label htmlFor="sell" className="mr-4 text-black" style={{ cursor: 'pointer' }}>Sell</label>
                  <input
                    type="radio"
                    id="rent"
                    name="sell-rent"
                    value="Rent"
                    onChange={(e) => setSellRent(e.target.value)}
                    className="mr-2"
                  />
                  <label htmlFor="rent" className="text-black" style={{ cursor: 'pointer' }}>Rent</label>
                </div>
              </div>
            </div>
          </div>
          {uploading ? (<div
            className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50 z-50"
          >
            <Oval
              height={80}
              width={80}
              color="#4fa94d"
              secondaryColor="#4fa94d"
              strokeWidth={2}
              strokeWidthSecondary={2}
              ariaLabel='oval-loading'
            />
          </div>) : (<div></div>)}
          <button className="ms-80 mt-4 bg-black w-fit px-14 h-[40px] rounded-full text-xl border-none outline-none placeholder-white"
            style={{ cursor: 'pointer' }} onClick={handleUpload}>
            Upload
          </button>
        </div>
      </div >
    ) : (
      <div className="bg-cover bg-no-repeat bg-center h-screen bg-img-mob">
        <Toaster toastOptions={{ duration: 2000 }} />
        <style>
          {`
          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            display: none;
          }
        `}
        </style>
        <div className="flex">
          <div className="ps-10 pt-5">
            <Link href="/"><Image src="/logo.png" height={100} width={100} /></Link>
          </div>
          <div className="flex mx-[5%] mt-9 h-14 w-[90%] bg-white text-black rounded-full justify-between items-center text-sm fixed bottom-5">
            <Link href="/"><div className='px-5 py-4'>Home</div></Link>
            <Link href="/properties/all" className='px-2 py-4'><div>Properties</div></Link>
            <Link href="" className='px-2 py-4 text-blue-700'><div>Sell/Rent</div></Link>
            <Link href="/aboutus" className='px-2 py-4 '><div className='pe-5'>About us</div></Link>
          </div>
          <Link href={whatsappURL} className='fixed z-10 bottom-14 right-2'>
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
        <div className={`mx-[5%] mt-[20%] h-[59%] w-[90%] p-7 pt-5 bg-[#D9D9D9] rounded-3xl ${isKeyboardOpen ? 'fixed' : 'absolute'}`}>
          <div className="h-[2vh] font-chonburi font-bold text-xl text-black">READY TO MARKET?</div>
          <p className="pt-5 text-black">List your property with our experts today</p>
          <div className="flex flex-col h-[80%] mt-5 items-center overflow-y-auto">
            <input
              className="ps-5 bg-white w-full h-[30px] rounded-full text-md border-none outline-none text-black placeholder-[#808080]"
              placeholder="Your full name"
              name="Name"
              onChange={(e) => setName(e.target.value)}
              type="text"
            />
            <input
              className="ps-5 mt-4 bg-white w-full h-[30px] rounded-full text-md border-none outline-none text-black placeholder-[#808080]"
              placeholder="Contact number"
              name="Contact"
              type="number"
              onChange={(e) => setContact(e.target.value)}
            />
            <input
              className="ps-5 mt-4 bg-white w-full h-[30px] rounded-full text-md border-none outline-none text-black placeholder-[#808080]"
              placeholder="Email"
              name="Email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <select
              name="Type"
              className={`ps-3 mt-4 bg-white w-full h-[30px] rounded-full text-md border-none outline-none ${selectedCategory === 'Select Category' ? 'text-[#808080]' : 'text-black'
                }`}
              onChange={handleCategoryChange}
              style={{ cursor: 'pointer' }}
            >
              <option value="Select Category" className="text-[#808080]">
                Select property type
              </option>
              <option value="Land lot" className="text-black">Land lot</option>
              <option value="Apartment" className="text-black">Apartment</option>
              <option value="Shop" className="text-black">Shop</option>
              <option value="Office" className="text-black">Office</option>
              <option value="House" className="text-black">House</option>
              <option value="Warehouse" className="text-black">Warehouse</option>
            </select>

            <div className="flex ps-4 mt-4 bg-white w-full h-[30px] rounded-full text-md border-none outline-none text-[#808080] justify-between items-center">
              <span className="w-1/3 me-2" style={{ cursor: 'default' }}>Price</span>
              <span>Rs</span>
              <input
                className="ms-2 me-[5px] bg-[#D9D9D9] w-1/3 h-[2vh] rounded-full text-[10px] text-black text-center"
                placeholder="Min value"
                name="min value"
                onChange={(e) => setMinValue(e.target.value)}
                type="number"
              />
              <span>Rs</span>
              <input
                className="ms-2 me-[5px] bg-[#D9D9D9] w-1/3 h-[2vh] rounded-full text-[10px] text-black text-center"
                placeholder="Max value"
                name="Max Value"
                type="number"
                onChange={(e) => setMaxValue(e.target.value)}
              />
            </div>
            <div className="flex ps-5 mt-4 bg-white w-full h-[30px] rounded-full text-md border-none outline-none text-[#808080] justify-between items-center">
              <span style={{ cursor: 'default' }}>Want to?</span>
              <div className="flex items-center me-10">
                <input
                  type="radio"
                  id="sell"
                  name="sell-rent"
                  value="Sell"
                  onChange={(e) => setSellRent(e.target.value)}
                  className="mr-2"
                />
                <label htmlFor="sell" className="mr-4 text-black" style={{ cursor: 'pointer' }}>Sell</label>
                <input
                  type="radio"
                  id="rent"
                  name="sell-rent"
                  value="Rent"
                  onChange={(e) => setSellRent(e.target.value)}
                  className="mr-2"
                />
                <label htmlFor="rent" className="text-black" style={{ cursor: 'pointer' }}>Rent</label>
              </div>
              {uploading ? (<div
                className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50 z-50"
              >
                <Oval
                  height={80}
                  width={80}
                  color="#4fa94d"
                  secondaryColor="#4fa94d"
                  strokeWidth={2}
                  strokeWidthSecondary={2}
                  ariaLabel='oval-loading'
                />
              </div>) : null}
            </div>
            <button className=" mt-7 bg-black w-fit px-14 h-[40px] rounded-full text-xl border-none outline-none"
              style={{ cursor: 'pointer' }} onClick={handleUpload}>
              Upload
            </button>
          </div>
        </div >
      </div>
    )
  );
}
