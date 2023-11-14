'use client';
import Image from 'next/image'
import Link from 'next/link';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { BsFillPersonFill } from "react-icons/bs";
import { BiBuildings } from "react-icons/bi";
import { IoMapSharp } from "react-icons/io5";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { VscCallOutgoing } from "react-icons/vsc";
import { BiSolidDownArrow } from "react-icons/bi";
import { BiSolidUpArrow } from "react-icons/bi";
import { BiStore } from "react-icons/bi";
import { AiOutlinePoweroff } from "react-icons/ai";
import { BsHouseDoor } from "react-icons/bs";
import { MdOutlineApartment } from "react-icons/md";
import { useState, useEffect } from 'react';
import { GetUserPhotoUrl, GetUserphNumber } from './utils/get_data';
import { UploadUserphNumber } from './utils/upload_data';
import { UserAuth } from './context/AuthContext';
import { modifyEmail } from './utils/upload_data';
import { toast, Toaster } from "react-hot-toast";


export default function Home() {
  const [ph, setPh] = useState("");
  const { user, logOut } = UserAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const divs = [
    { text: 'FIND YOUR DREAM PROPERTY' },
    { text: 'FIND YOUR DREAM PROPERTY' },
  ];
  const currentDiv = divs[currentIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % divs.length);
    }, 13000);

    return () => clearInterval(interval);
  }, [divs.length, currentDiv.text]);


  const Typewriter = ({ text, delay }) => {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      let timeout;

      if (currentIndex < text.length) {
        timeout = setTimeout(() => {
          setCurrentText((prevText) => prevText + text[currentIndex]);
          setCurrentIndex((prevIndex) => prevIndex + 1);
        }, delay);
      }

      return () => clearTimeout(timeout);
    }, [currentIndex, delay, text]);

    return <span>{currentText}</span>;
  };





  const [dpUrl, setDpUrl] = useState(
    "https://i.ibb.co/n3j7DWd/Windows-10-Default-Profile-Picture-svg.png"
  );
  const [showPhoneNumberPopup, setShowPhoneNumberPopup] = useState(false);

  const [showSignOutDropdown, setShowSignOutDropdown] = useState(false);
  const handleToggleSignOutDropdown = () => {
    setShowSignOutDropdown(!showSignOutDropdown);
  };


  const handlePhoneNumberSubmit = () => {
    const formattedPhoneNumber = '+' + ph;
    UploadUserphNumber(modifyEmail(user.email), formattedPhoneNumber);
    setShowPhoneNumberPopup(false);
    toast.success("Phone number Verified!");
  };

  useEffect(() => {
    if (user) {
      GetUserPhotoUrl(modifyEmail(user.email)).then((url) => {
        setDpUrl(url);
      });
      GetUserphNumber(modifyEmail(user.email)).then((phNumber) => {
        if (phNumber === "") {
          setShowPhoneNumberPopup(true);
        }
        setPh(phNumber);
      });
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
        <Toaster toastOptions={{ duration: 2000 }} />
        <div className='flex'>
          <div className="ps-10 pt-5">
            <Link href="/">
              <Image src="/logo.png" alt='CCRealestate' height={100} width={100} />
            </Link>
          </div>
          <div className="flex mt-9 ms-[10%] me-20 h-14 w-[60%] bg-white text-black rounded-full justify-between items-center text-xl">
            <Link href=""><div className='ps-10 hover:scale-105 text-blue-700'>Home</div></Link>
            <Link href="/properties/all" className='hover:scale-105'><div>Properties</div></Link>
            <Link href="/sell_rent" className='hover:scale-105'><div>Sell/Rent</div></Link>
            <Link href="/aboutus" className='hover:scale-105'><div className='pe-10'>About us</div></Link>
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
                <div className="absolute right-0 mt-24 me-14 bg-white text-black rounded-xl p-2">
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
        <style>{`.popup {
            display: ${showPhoneNumberPopup ? 'block' : 'none'};
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
          }

          .custom-hover-scale-125:hover {
            transform: scale(1.25);
          }

          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            display: none;
          }

          select::after {
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            pointer-events: none;
          }          
           .popup-content {
            background: white;
            width: 70%;
            max-width: 500px;
            margin: 10% auto;
            padding: 20px;
            border-radius: 10px;
            position: relative;
          }`}</style>

        {showPhoneNumberPopup && (
          <div className="popup">
            <div id="recaptcha-container"></div>
            <div className="popup-content text-center text-black">
              <div className='flex-col'>
                <h3>Please enter your phone number:</h3>
                <PhoneInput country={"in"} value={ph} onChange={setPh} />
              </div>
              <button
                onClick={handlePhoneNumberSubmit}
                className="bg-emerald-600 w-full flex gap-1 mt-5 items-center justify-center py-2.5 text-white rounded"
              >Verify</button>
            </div>
          </div>
        )}
        <div className='text-black p-[2%] ps-[10%] h-[25%] w-[35%] text-5xl font-chonburi font-bold'>
          <Typewriter text={currentDiv.text} delay={200} />
        </div>
        <div className='mt-[14%] ms-24 w-1/5 h-[6%] bg-black rounded-xl text-white p-2 ps-5'>
          What are you looking for?
        </div>
        <div className='flex w-[85%] h-[16%] bg-white text-black bg-opacity-80 mx-20 rounded-3xl justify-between items-center'>
          <Link href={`/properties/all`}>
            <div className='custom-hover-scale-125'>
              <BiBuildings size={30} className='ms-10 text-[#4E4ED1]' />
              <span className='ps-12'>all</span>
            </div>
          </Link>

          <Link href={`/properties/Land`}>
            <div className='custom-hover-scale-125'>
              <IoMapSharp size={30} className='ms-2 text-[#44CECE]' />
              land
            </div>
          </Link>

          <Link href={`/properties/Office`}>
            <div className='custom-hover-scale-125'>
              <HiOutlineOfficeBuilding size={30} className='ms-1 text-[#11AE50]' />
              office
            </div>
          </Link>

          <Link href={whatsappURL}>
            <div className='custom-hover-scale-125'>
              <VscCallOutgoing size={30} className='ms-10 text-[#A52A2A]' />
              property advice
            </div>
          </Link>


          <Link href={`/properties/Store`}>
            <div className='custom-hover-scale-125'>
              <BiStore size={30} className='text-[#800080]' />
              store
            </div>
          </Link>

          <Link href={`/properties/House`}>
            <div className='custom-hover-scale-125'>
              <BsHouseDoor size={30} className='ms-1 text-[#BC3DBC]' />
              house
            </div>
          </Link>

          <Link href={`/properties/Apartment`}>
            <div className='custom-hover-scale-125'>
              <MdOutlineApartment size={30} className='ms-5 me-16 text-[#F5A718]' />
              apartment
            </div>
          </Link>
        </div>
      </div>
    ) : (
      <div className="bg-cover bg-no-repeat bg-center h-screen bg-img-mob bg-img-mob">
        <Toaster toastOptions={{ duration: 2000 }} />
        <style>{`.popup {
          display: ${showPhoneNumberPopup ? 'block' : 'none'};
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        .custom-hover-scale-125:hover {
          transform: scale(1.25);
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          display: none;
        }

        select::after {
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
          pointer-events: none;
        }          
         .popup-content {
          background: white;
          width: 70%;
          max-width: 500px;
          margin: 10% auto;
          padding: 20px;
          border-radius: 10px;
          position: relative;
        }`}</style>
        <div className='flex'>
          <div className="ps-10 pt-5 absolute">
            <Link href="/">
              <Image src="/logo.png" alt='CCRealestate' height={100} width={100} />
            </Link>
          </div>
          <div className="flex mx-[5%] mt-9 h-14 w-[90%] bg-white text-black rounded-full justify-between items-center text-sm fixed bottom-5">
            <Link href=""><div className='px-5 py-4 text-blue-700'>Home</div></Link>
            <Link href="/properties/all" className='px-2 py-4'><div>Properties</div></Link>
            <Link href="/sell_rent" className='px-2 py-4 '><div>Sell/Rent</div></Link>
            <Link href="/aboutus" className='px-2 py-4 '><div className='pe-5'>About us</div></Link>
          </div>
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
          ) : (<Link href="/signup" className='absolute right-5 mt-8 '>
            <div className='flex text-black'>
              <BsFillPersonFill size={30} />
              <div className='ps-2 pt-1'>Sign up</div>
            </div>
          </Link>)}
        </div>
        {
          showPhoneNumberPopup && (
            <div className="popup">
              <div id="recaptcha-container"></div>
              <div className="popup-content text-center text-black">
                <div className='flex-col'>
                  <h3>Please enter your phone number:</h3>
                  <PhoneInput inputStyle={{ width: '35vh' }} country={"in"} value={ph} onChange={setPh} />
                </div>
                <button
                  onClick={handlePhoneNumberSubmit}
                  className="bg-emerald-600 w-full flex gap-1 mt-5 items-center justify-center py-2.5 text-white rounded"
                >Verify</button>
              </div>
            </div>
          )
        }
        <div className='text-white ps-[5vh] mt-[7vh] h-[25%] w-[80%] text-[30px] font-chonburi font-bold absolute top-28'>
          <Typewriter text={currentDiv.text} delay={200} />
        </div>
        <div className='mt-[20%] ms-[10%] w-[60%] h-[5%] bg-black rounded-xl text-white p-2 ps-5 absolute bottom-[50vh]'>
          What are you looking for?
        </div>
        <div className='flex flex-col w-[80%] ms-[10%] h-[30%] bg-white text-black bg-opacity-80 mx-20 rounded-3xl justify-between items-center absolute bottom-36'>
          <div className='flex flex-row mt-5 w-full text-xl justify-between'>
            <Link href={`/properties/all`} className='ms-5 px-4'>
              <BiBuildings size={50} className='text-[#4E4ED1]' />
              <span className='ms-4'>all</span>
            </Link>

            <Link href={`/properties/Land`} className='px-4'>
              <IoMapSharp size={50} className='text-[#44CECE]' />
              <span className='ps-2'>land</span>
            </Link>

            <Link href={`/properties/Office`} className='me-5 px-4'>
              <HiOutlineOfficeBuilding size={50} className='text-[#11AE50]' />
              <span className='ps-1'>office</span>
            </Link>
          </div>

          <div className='flex flex-row mb-5 w-full text-xl justify-between'>
            <Link href={`/properties/Store`} className='ms-5 px-4'>
              <BiStore size={50} className='text-[#800080]' />
              <span className='text-xl'>store</span>
            </Link>

            <Link href={`/properties/House`} className='ms-5 px-4'>
              <BsHouseDoor size={50} className='text-[#BC3DBC]' />
              house
            </Link>

            <Link href={`/properties/Apartment`} className='me-5 px-4'>
              <MdOutlineApartment size={50} className='text-[#F5A718]' />
              <span className='ms-2'>flat</span>
            </Link>
            <Link href={whatsappURL} className='fixed bottom-14 right-2'>
            <img className='w-[50px] h-[50px]' src="data:image/png;base64,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"/>
            </Link>
          </div>
        </div>
      </div >
    )
  )
}