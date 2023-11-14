'use client';
import Image from 'next/image';
import Link from 'next/link';
import { BsFillPersonFill } from "react-icons/bs";
import { BsSearch } from "react-icons/bs";
import { BiSolidDownArrow } from "react-icons/bi";
import { AiOutlinePoweroff } from "react-icons/ai";
import { BiSolidUpArrow } from "react-icons/bi";
import { TbFaceIdError } from "react-icons/tb";
import { Oval } from 'react-loader-spinner';
import { BiBed } from "react-icons/bi";
import { PiBathtubBold } from "react-icons/pi";
import { RxCross1 } from "react-icons/rx";
import { IoOptionsOutline } from "react-icons/io5";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { useState, useEffect } from 'react';
import { GetAllPropertyData, GetUserName, GetUserPhotoUrl } from '../../utils/get_data';
import { modifyEmail } from '../../utils/upload_data';
import { UserAuth } from '../../context/AuthContext';

export default function Page({ params }) {
  const paramdata = params.id;
  const { user, logOut } = UserAuth();
  const [dpUrl, setDpUrl] = useState(
    "https://i.ibb.co/n3j7DWd/Windows-10-Default-Profile-Picture-svg.png"
  );

  useEffect(() => {
    if (user) {
      GetUserPhotoUrl(modifyEmail(user.email)).then((url) => {
        setDpUrl(url);
      });
    }
  }, [user]);

  const [showFiltersPopup, setShowFiltersPopup] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [areaRange, setAreaRange] = useState([0, 10000]);
  const [property, setProperty] = useState(null);
  const [numbedroom, setNumbedroom] = useState(0);
  const [SearchWord, setSearchWord] = useState(paramdata);

  let filteredProperty = "";

  useEffect(() => {
    GetAllPropertyData()
      .then((data) => {
        setProperty([...data]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const [showSignOutDropdown, setShowSignOutDropdown] = useState(false);
  const handleToggleSignOutDropdown = () => {
    setShowSignOutDropdown(!showSignOutDropdown);
  };

  const toggleFiltersPopup = () => {
    setShowFiltersPopup(!showFiltersPopup);
  }

  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
  }

  const handleAreaRangeChange = (value) => {
    setAreaRange(value);
  }

  const resetPriceRange = () => {
    setPriceRange([0, 10000000]);
  }

  const resetAreaRange = () => {
    setAreaRange([0, 10000]);
  }

  const resetNumBedroom = () => {
    setNumbedroom(0);
  }

  const handleNumbedroomChange = (value) => {
    setNumbedroom(value);
  }

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  console.log("Property", property);
  console.log("Filtered Property", filteredProperty);

  function generateWhatsAppURL(price, area, description, propertyType, title, imageUrl) {
    const encodedPropertyType = encodeURIComponent(propertyType);
    const encodedTitle = encodeURIComponent(title);
    const encodedImageUrl = encodeURIComponent(imageUrl);
    const encodedPrice = encodeURIComponent(price);
    const encodedArea = encodeURIComponent(area);
    const encodedDescription = encodeURIComponent(description);
    const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER;

    // Construct the WhatsApp URL with the custom message template
    const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=Hi,%20I%20am%20interested%20in%20knowing%20about%20the%20${encodedDescription}%20Priced%20at%20Rs%20${encodedPrice}%20Area%20is%20${encodedArea}%20square%20foot,%20Property%20Type-%20${encodedPropertyType},%20with%20ID%20:%20${encodedTitle}%20and%20Image%20URL%20:%20${encodedImageUrl}`;

    return whatsappURL;
  }

  if (property) {
    filteredProperty = property.filter((item) => {
      let doesContainSearchWord = false;
      let isNumBedroomMatching = false;
      const isPriceInRange = parseInt(item.price) >= parseInt(priceRange[0]) && parseInt(item.price) <= parseInt(priceRange[1]);
      const isAreaInRange = parseInt(item.area) >= parseInt(areaRange[0]) && parseInt(item.area) <= parseInt(areaRange[1]);
      if (SearchWord === "all" || SearchWord === "") {
        doesContainSearchWord = true;
      }
      else {
        doesContainSearchWord = item.type.toLowerCase().includes(SearchWord.toLowerCase().trim());
      }
      if (parseInt(numbedroom) === 0) {
        isNumBedroomMatching = true;
      }
      else {
        isNumBedroomMatching = parseInt(numbedroom) === parseInt(item.bedroom);
      }
      return isPriceInRange && isAreaInRange && isNumBedroomMatching && doesContainSearchWord;
    }
    );
  }

  const handleContactNow = async (price, area, description, propertyType, imageUrl, title) => {
    const link = generateWhatsAppURL(price, area, description, propertyType, title, imageUrl);
    console.log(link);
    window.open(link, '_blank');
  }



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
      <div className="bg-cover bg-no-repeat bg-center h-screen bg-white overflow-hidden">
        <div className='flex'>
          <div className="ps-10 pt-5">
            <Link href="/"><Image src="/logo.png" height={100} width={100} /></Link>
          </div>
          <div className="flex mt-9 ms-[10%] me-20 h-14 w-[60%] bg-[#d6d6d6] text-black rounded-full justify-between items-center text-xl">
            <Link href="../"><div className='ps-10'>Home</div></Link>
            <Link href=""><div className='text-blue-700'>Properties</div></Link>
            <Link href="/sell_rent"><div>Sell/Rent</div></Link>
            <Link href="/aboutus"><div className='pe-10'>About us</div></Link>
          </div>
          {user ? (
            <div style={{ cursor: 'pointer' }} className='flex mt-11 h-fit me-10 text-right items-center' onClick={handleToggleSignOutDropdown}>
              <div>
                <Image
                  src={dpUrl}
                  alt={"photo"}
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
        <style>
          {`
          .custom-border {
            border: 1px solid black;
          }
          .bubbleborder{
            border: 1px solid blue;
          }
          .popup {
            display: ${showFiltersPopup ? 'block' : 'none'};
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
          }
          .custom-hover-scale-102:hover {
            transform: scale(1.02);
          }
          .popup-content {
            background: white;
            width: 70%;
            max-width: 500px;
            margin: 10% auto;
            padding: 20px;
            border-radius: 10px;
            position: relative;
          }
          .close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
          }
        `}
        </style>
        <div className='justify-center flex ms-10 mt-5 mb-2'>
          <div className="flex ps-5 bg-white w-[75%] h-[40px] custom-border rounded-full text-xl border-none outline-none text-black items-center">
            <BsSearch size={20} />
            <input
              className='ms-5 w-[93%] border-none outline-none text-black placeholder-[#808080]'
              placeholder="What type of property you are looking for? eg: Land, House, office, etc.."
              type="text"
              value={SearchWord === "all" ? "" : SearchWord}
              onChange={(e) => setSearchWord(e.target.value)}
            />
          </div>
          <div className="mx-5 px-8 flex bg-black w-fit h-[40px] custom-border rounded-full text-xl border-none justify-center items-center outline-none text-white" style={{ cursor: 'pointer' }} onClick={toggleFiltersPopup}>
            <IoOptionsOutline className='me-2' size={20} />
            Filters
          </div>
          {showFiltersPopup && (
            <div className="popup">
              <div className="popup-content text-black">
                <div className="close-button" onClick={toggleFiltersPopup}>
                  X
                </div>
                <div>
                  <div>
                    Price Range
                    <Slider
                      min={0}
                      max={10000000}
                      step={10000}
                      range
                      value={priceRange}
                      onChange={handlePriceRangeChange}
                    />
                    <div className="flex justify-center items-center">
                      <span>Rs</span>
                      <input
                        className='ps-2 me-20 w-[100px]'
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceRangeChange([+e.target.value, priceRange[1]])}
                        placeholder="Min Price"
                      />
                      <span>Rs</span>
                      <input
                        className='ps-2 w-[100px]'
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceRangeChange([priceRange[0], +e.target.value])}
                        placeholder="Max Price"
                      />
                    </div>
                  </div>
                  <div>
                    Area Range
                    <Slider
                      min={0}
                      max={10000}
                      step={1}
                      range
                      value={areaRange}
                      onChange={handleAreaRangeChange}
                    />
                    <div className="flex justify-center items-center">
                      <input
                        className='w-[70px]'
                        type="number"
                        value={areaRange[0]}
                        onChange={(e) => handleAreaRangeChange([+e.target.value, areaRange[1]])}
                      />
                      <span className='me-28'>sq meter</span>
                      <input
                        className='w-[70px]'
                        type="number"
                        value={areaRange[1]}
                        onChange={(e) => handleAreaRangeChange([areaRange[0], +e.target.value])}
                      />
                      <span>sq meter</span>
                    </div>
                  </div>
                  <div className='mt-4'>
                    <span>No. of Bedrooms</span>
                    <input
                      className='ms-10 w-[70px]'
                      type="number"
                      value={numbedroom}
                      onChange={(e) => handleNumbedroomChange(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className='flex justify-left ms-[9%]'>
          {priceRange[0] !== 0 || priceRange[1] !== 10000000 ? (
            <div className="flex me-4 justify-center items-center w-fit px-4 h-fit text-[10px] rounded-full bubbleborder text-blue-700">
              <span>Rs {priceRange[0]} to Rs {priceRange[1]}</span>
              <RxCross1 className='ms-16 text-black' size={15} style={{ cursor: 'pointer' }} onClick={resetPriceRange} />
            </div>
          ) : null}
          {areaRange[0] !== 0 || areaRange[1] !== 10000 ? (
            <div className="flex px-4 justify-center items-center w-fit h-fit text-[10px] rounded-full bubbleborder text-blue-700">
              <span>{areaRange[0]} sq meter to {areaRange[1]} sq meter</span>
              <RxCross1 className='ms-16 text-black' size={15} style={{ cursor: 'pointer' }} onClick={resetAreaRange} />
            </div>
          ) : null}
          {parseInt(numbedroom) !== 0 ? (
            <div className="flex px-4 justify-center items-center w-fit h-fit text-[10px] rounded-full bubbleborder text-blue-700">
              <span>Bedrooms: {numbedroom}</span>
              <RxCross1 className='ms-16 text-black' size={15} style={{ cursor: 'pointer' }} onClick={resetNumBedroom} />
            </div>
          ) : null}
        </div>
        <div className="h-[60vh] w-full overflow-y-auto custom-scrollbar mt-2">
          <style jsx>
            {`
    /* Style for custom scrollbar */
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: #1b1b1c transparent;
    }

    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: #1b1b1c;
      border-radius: 5px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
  `}
          </style>
          {filteredProperty && filteredProperty.length > 0 ? filteredProperty.slice(0, 100).map((item, index) => {
            return (
              <div
                key={index}
                className="flex flex-row w-[85%] items-center m-auto px-5 py-1 custom-hover-scale-102 transform transition duration-150"
              >
                <Carousel>
                  <div>
                    <Image
                      className="rounded-xl"
                      src={item.url1}
                      alt="Property thumbnail"
                      width={200}
                      height={200}
                    />
                  </div>
                  <div>
                    <Image
                      className="rounded-xl"
                      src={item.url2}
                      alt="Property thumbnail"
                      width={200}
                      height={200}
                    />
                  </div>
                  <div>
                    <Image
                      className="rounded-xl"
                      src={item.url3}
                      alt="Property thumbnail"
                      width={200}
                      height={200}
                    />
                  </div>
                  <div>
                    <Image
                      className="rounded-xl"
                      src={item.url4}
                      alt="Property thumbnail"
                      width={200}
                      height={200}
                    />
                  </div>
                </Carousel>

                <div className="flex flex-row ms-20 w-full gap-8 items-center m-auto py-2 transform transition duration-150">
                  <div className="flex justify-between place-items-center w-full bg-white h-auto rounded-xl">
                    <div className="flex flex-col">
                      <span className="ms-5 text-2xl text-black font-bold">
                        Rs {item.price}
                      </span>
                      <div className="mt-2 ms-5 text-black text-xl max-h-20">
                        {item.description}
                      </div>
                      <div className='flex'>
                        <div className='mt-2 ms-5 text-black text-xm'>
                          {item.area} sq. foot
                        </div>
                        <div className='mt-2 ms-5 text-black text-xm flex gap-1'>
                          <BiBed size={20} />{item.bedroom} Bedroom
                        </div>
                        <div className='mt-2 ms-5 text-black text-xm flex gap-1'>
                          <PiBathtubBold size={20} />{item.bathroom} Bathroom
                        </div>
                      </div>
                      <input type='button' style={{ cursor: 'pointer' }}
                        onClick={() => handleContactNow(item.type, item.url, item.title)}
                        value="Contact Now" className='bg-black hover:scale-105 text-white mt-3 text-xl p-2' />
                    </div>
                  </div>
                </div>
                {item.stars === 5 ? <div className='flex w-[50%]'>
                  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEJ0lEQVR4nO2ZvW8bdRzGf1Q09r357MT3YikTZSgIwdAWCZA6MYBQ/oIKykCHDlUZujcUlQ2pVMAYJFQQUgckhKCxHb/cxU7sOunZvoiKdkCZUFGGVlS0gd/vQXcXv9upae4SG/mRnsny3ef5+vHd92xCJppoosAEW3sVdf0EGUfB0lTY2kPXlqaScRPq2jxsHag71ubJOAm/Ph+Crf+OuubAAzX1HoqzHBkXwU6cacHvuKp+QMZBAHkGNXWjCV5THXjAUm87r5FRF6r6221Tb8ADluL4LTLqQk1L9YW/pQDr8UUyyoKlvQRLZX3hvQDAuvIKGVXBUr/qqkwXfByozCyQkb1xWcpfPVNvh19zAkw/QiWeIKMmWMrH/SvTBr8243wCji+RURKKsxys+B994RvgLXjg5vQWLE04uOu8reioxY/B0uZgKWdhKdcGVqYd3IP3XJ6+hlLsLMrROazKx1BSdF/uE6grR7Chn4SdOIW6fgE1/Qpq6nVUtQKq6iaq6vbuV5kB8A1wDx4ox4CSZ7YadU1Xotu0KG/SFblAi5HrtBi5goJ0AcuRUyiIJ2HKz+0Ov5H4yF3AWktY9zrQfWMatjKd4H3g2UrDMlhxx4WI5+WGJcAQLw4OYOunUddZE757Heg39eEr0wHeCy+3wHvgJTBTAjUkBlN67wkV0t9FXdvumXoAlWH94Bvg3fCm9A8M8cxw34Oa+iaq2oNRqAxzJy8+RF56Zyj4Zoh1/QSqyr2DrAzz4LdgiG/8J/hWnZQjsOJ3DqIyzIHPi78hKx59KvhmCOf6vB6/5U9l5KEqwzx4G1ludk/wzRC2ImItntyPyjAXXsghFZN9ge94zq3MfBdkZZghOvDfo0i44NaIysynQVSGOfCG+DlADgUC3xGkHLvqZ2WYO3nxauDgzQCl2Cd+VYbtmOaFy/sXoBxb8qMyzHHeM83x6f2BBzmEUvT+XivTghfAcgJoln+Ai/vR/9XpF/dcmXwnPHOc5YGc+ELwAVbk9/2oTBM858G7ATL86cAD0FX5Sz8q44ELTXiW4UGXwl8EH6AYrfhVGbYD7pkDTYdvBgqPLAnTovx44NQ7dhlhC4ZwDlnhHM0JW/0qwxrwS5xrusQ9ds4RXICC9PoT19+8RGle/BoFofmnBkw5RrP8ZzQj/N0JzzXhWdpxGEiFXwsuQFH+cNf11xAzMISXB74/Kx6lGe6nXviw51QYSE6dDywAXZa+7QtuSpsw+d2fVduDpLk5mubudsM7pouhb4ILUJDudj6nin/SvDT/NL1FhRxGeuo8TYfve/AhsGQINDl1JxB4t8dmhDnw1JAoNcUF5Pk9/8aJn/kETU0t0GSIugFuhBh+JDF/qNtPtKgJ1BBvU1PKYTly3PfjJ589Tm9M5eji4V/wA+H9Pv5EE/1f9S9M4cKBWKiMUAAAAABJRU5ErkJggg==" />
                  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEJ0lEQVR4nO2ZvW8bdRzGf1Q09r357MT3YikTZSgIwdAWCZA6MYBQ/oIKykCHDlUZujcUlQ2pVMAYJFQQUgckhKCxHb/cxU7sOunZvoiKdkCZUFGGVlS0gd/vQXcXv9upae4SG/mRnsny3ef5+vHd92xCJppoosAEW3sVdf0EGUfB0lTY2kPXlqaScRPq2jxsHag71ubJOAm/Ph+Crf+OuubAAzX1HoqzHBkXwU6cacHvuKp+QMZBAHkGNXWjCV5THXjAUm87r5FRF6r6221Tb8ADluL4LTLqQk1L9YW/pQDr8UUyyoKlvQRLZX3hvQDAuvIKGVXBUr/qqkwXfByozCyQkb1xWcpfPVNvh19zAkw/QiWeIKMmWMrH/SvTBr8243wCji+RURKKsxys+B994RvgLXjg5vQWLE04uOu8reioxY/B0uZgKWdhKdcGVqYd3IP3XJ6+hlLsLMrROazKx1BSdF/uE6grR7Chn4SdOIW6fgE1/Qpq6nVUtQKq6iaq6vbuV5kB8A1wDx4ox4CSZ7YadU1Xotu0KG/SFblAi5HrtBi5goJ0AcuRUyiIJ2HKz+0Ov5H4yF3AWktY9zrQfWMatjKd4H3g2UrDMlhxx4WI5+WGJcAQLw4OYOunUddZE757Heg39eEr0wHeCy+3wHvgJTBTAjUkBlN67wkV0t9FXdvumXoAlWH94Bvg3fCm9A8M8cxw34Oa+iaq2oNRqAxzJy8+RF56Zyj4Zoh1/QSqyr2DrAzz4LdgiG/8J/hWnZQjsOJ3DqIyzIHPi78hKx59KvhmCOf6vB6/5U9l5KEqwzx4G1ludk/wzRC2ImItntyPyjAXXsghFZN9ge94zq3MfBdkZZghOvDfo0i44NaIysynQVSGOfCG+DlADgUC3xGkHLvqZ2WYO3nxauDgzQCl2Cd+VYbtmOaFy/sXoBxb8qMyzHHeM83x6f2BBzmEUvT+XivTghfAcgJoln+Ai/vR/9XpF/dcmXwnPHOc5YGc+ELwAVbk9/2oTBM858G7ATL86cAD0FX5Sz8q44ELTXiW4UGXwl8EH6AYrfhVGbYD7pkDTYdvBgqPLAnTovx44NQ7dhlhC4ZwDlnhHM0JW/0qwxrwS5xrusQ9ds4RXICC9PoT19+8RGle/BoFofmnBkw5RrP8ZzQj/N0JzzXhWdpxGEiFXwsuQFH+cNf11xAzMISXB74/Kx6lGe6nXviw51QYSE6dDywAXZa+7QtuSpsw+d2fVduDpLk5mubudsM7pouhb4ILUJDudj6nin/SvDT/NL1FhRxGeuo8TYfve/AhsGQINDl1JxB4t8dmhDnw1JAoNcUF5Pk9/8aJn/kETU0t0GSIugFuhBh+JDF/qNtPtKgJ1BBvU1PKYTly3PfjJ589Tm9M5eji4V/wA+H9Pv5EE/1f9S9M4cKBWKiMUAAAAABJRU5ErkJggg==" />
                  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEJ0lEQVR4nO2ZvW8bdRzGf1Q09r357MT3YikTZSgIwdAWCZA6MYBQ/oIKykCHDlUZujcUlQ2pVMAYJFQQUgckhKCxHb/cxU7sOunZvoiKdkCZUFGGVlS0gd/vQXcXv9upae4SG/mRnsny3ef5+vHd92xCJppoosAEW3sVdf0EGUfB0lTY2kPXlqaScRPq2jxsHag71ubJOAm/Ph+Crf+OuubAAzX1HoqzHBkXwU6cacHvuKp+QMZBAHkGNXWjCV5THXjAUm87r5FRF6r6221Tb8ADluL4LTLqQk1L9YW/pQDr8UUyyoKlvQRLZX3hvQDAuvIKGVXBUr/qqkwXfByozCyQkb1xWcpfPVNvh19zAkw/QiWeIKMmWMrH/SvTBr8243wCji+RURKKsxys+B994RvgLXjg5vQWLE04uOu8reioxY/B0uZgKWdhKdcGVqYd3IP3XJ6+hlLsLMrROazKx1BSdF/uE6grR7Chn4SdOIW6fgE1/Qpq6nVUtQKq6iaq6vbuV5kB8A1wDx4ox4CSZ7YadU1Xotu0KG/SFblAi5HrtBi5goJ0AcuRUyiIJ2HKz+0Ov5H4yF3AWktY9zrQfWMatjKd4H3g2UrDMlhxx4WI5+WGJcAQLw4OYOunUddZE757Heg39eEr0wHeCy+3wHvgJTBTAjUkBlN67wkV0t9FXdvumXoAlWH94Bvg3fCm9A8M8cxw34Oa+iaq2oNRqAxzJy8+RF56Zyj4Zoh1/QSqyr2DrAzz4LdgiG/8J/hWnZQjsOJ3DqIyzIHPi78hKx59KvhmCOf6vB6/5U9l5KEqwzx4G1ludk/wzRC2ImItntyPyjAXXsghFZN9ge94zq3MfBdkZZghOvDfo0i44NaIysynQVSGOfCG+DlADgUC3xGkHLvqZ2WYO3nxauDgzQCl2Cd+VYbtmOaFy/sXoBxb8qMyzHHeM83x6f2BBzmEUvT+XivTghfAcgJoln+Ai/vR/9XpF/dcmXwnPHOc5YGc+ELwAVbk9/2oTBM858G7ATL86cAD0FX5Sz8q44ELTXiW4UGXwl8EH6AYrfhVGbYD7pkDTYdvBgqPLAnTovx44NQ7dhlhC4ZwDlnhHM0JW/0qwxrwS5xrusQ9ds4RXICC9PoT19+8RGle/BoFofmnBkw5RrP8ZzQj/N0JzzXhWdpxGEiFXwsuQFH+cNf11xAzMISXB74/Kx6lGe6nXviw51QYSE6dDywAXZa+7QtuSpsw+d2fVduDpLk5mubudsM7pouhb4ILUJDudj6nin/SvDT/NL1FhRxGeuo8TYfve/AhsGQINDl1JxB4t8dmhDnw1JAoNcUF5Pk9/8aJn/kETU0t0GSIugFuhBh+JDF/qNtPtKgJ1BBvU1PKYTly3PfjJ589Tm9M5eji4V/wA+H9Pv5EE/1f9S9M4cKBWKiMUAAAAABJRU5ErkJggg==" />
                  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEJ0lEQVR4nO2ZvW8bdRzGf1Q09r357MT3YikTZSgIwdAWCZA6MYBQ/oIKykCHDlUZujcUlQ2pVMAYJFQQUgckhKCxHb/cxU7sOunZvoiKdkCZUFGGVlS0gd/vQXcXv9upae4SG/mRnsny3ef5+vHd92xCJppoosAEW3sVdf0EGUfB0lTY2kPXlqaScRPq2jxsHag71ubJOAm/Ph+Crf+OuubAAzX1HoqzHBkXwU6cacHvuKp+QMZBAHkGNXWjCV5THXjAUm87r5FRF6r6221Tb8ADluL4LTLqQk1L9YW/pQDr8UUyyoKlvQRLZX3hvQDAuvIKGVXBUr/qqkwXfByozCyQkb1xWcpfPVNvh19zAkw/QiWeIKMmWMrH/SvTBr8243wCji+RURKKsxys+B994RvgLXjg5vQWLE04uOu8reioxY/B0uZgKWdhKdcGVqYd3IP3XJ6+hlLsLMrROazKx1BSdF/uE6grR7Chn4SdOIW6fgE1/Qpq6nVUtQKq6iaq6vbuV5kB8A1wDx4ox4CSZ7YadU1Xotu0KG/SFblAi5HrtBi5goJ0AcuRUyiIJ2HKz+0Ov5H4yF3AWktY9zrQfWMatjKd4H3g2UrDMlhxx4WI5+WGJcAQLw4OYOunUddZE757Heg39eEr0wHeCy+3wHvgJTBTAjUkBlN67wkV0t9FXdvumXoAlWH94Bvg3fCm9A8M8cxw34Oa+iaq2oNRqAxzJy8+RF56Zyj4Zoh1/QSqyr2DrAzz4LdgiG/8J/hWnZQjsOJ3DqIyzIHPi78hKx59KvhmCOf6vB6/5U9l5KEqwzx4G1ludk/wzRC2ImItntyPyjAXXsghFZN9ge94zq3MfBdkZZghOvDfo0i44NaIysynQVSGOfCG+DlADgUC3xGkHLvqZ2WYO3nxauDgzQCl2Cd+VYbtmOaFy/sXoBxb8qMyzHHeM83x6f2BBzmEUvT+XivTghfAcgJoln+Ai/vR/9XpF/dcmXwnPHOc5YGc+ELwAVbk9/2oTBM858G7ATL86cAD0FX5Sz8q44ELTXiW4UGXwl8EH6AYrfhVGbYD7pkDTYdvBgqPLAnTovx44NQ7dhlhC4ZwDlnhHM0JW/0qwxrwS5xrusQ9ds4RXICC9PoT19+8RGle/BoFofmnBkw5RrP8ZzQj/N0JzzXhWdpxGEiFXwsuQFH+cNf11xAzMISXB74/Kx6lGe6nXviw51QYSE6dDywAXZa+7QtuSpsw+d2fVduDpLk5mubudsM7pouhb4ILUJDudj6nin/SvDT/NL1FhRxGeuo8TYfve/AhsGQINDl1JxB4t8dmhDnw1JAoNcUF5Pk9/8aJn/kETU0t0GSIugFuhBh+JDF/qNtPtKgJ1BBvU1PKYTly3PfjJ589Tm9M5eji4V/wA+H9Pv5EE/1f9S9M4cKBWKiMUAAAAABJRU5ErkJggg==" />
                  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEJ0lEQVR4nO2ZvW8bdRzGf1Q09r357MT3YikTZSgIwdAWCZA6MYBQ/oIKykCHDlUZujcUlQ2pVMAYJFQQUgckhKCxHb/cxU7sOunZvoiKdkCZUFGGVlS0gd/vQXcXv9upae4SG/mRnsny3ef5+vHd92xCJppoosAEW3sVdf0EGUfB0lTY2kPXlqaScRPq2jxsHag71ubJOAm/Ph+Crf+OuubAAzX1HoqzHBkXwU6cacHvuKp+QMZBAHkGNXWjCV5THXjAUm87r5FRF6r6221Tb8ADluL4LTLqQk1L9YW/pQDr8UUyyoKlvQRLZX3hvQDAuvIKGVXBUr/qqkwXfByozCyQkb1xWcpfPVNvh19zAkw/QiWeIKMmWMrH/SvTBr8243wCji+RURKKsxys+B994RvgLXjg5vQWLE04uOu8reioxY/B0uZgKWdhKdcGVqYd3IP3XJ6+hlLsLMrROazKx1BSdF/uE6grR7Chn4SdOIW6fgE1/Qpq6nVUtQKq6iaq6vbuV5kB8A1wDx4ox4CSZ7YadU1Xotu0KG/SFblAi5HrtBi5goJ0AcuRUyiIJ2HKz+0Ov5H4yF3AWktY9zrQfWMatjKd4H3g2UrDMlhxx4WI5+WGJcAQLw4OYOunUddZE757Heg39eEr0wHeCy+3wHvgJTBTAjUkBlN67wkV0t9FXdvumXoAlWH94Bvg3fCm9A8M8cxw34Oa+iaq2oNRqAxzJy8+RF56Zyj4Zoh1/QSqyr2DrAzz4LdgiG/8J/hWnZQjsOJ3DqIyzIHPi78hKx59KvhmCOf6vB6/5U9l5KEqwzx4G1ludk/wzRC2ImItntyPyjAXXsghFZN9ge94zq3MfBdkZZghOvDfo0i44NaIysynQVSGOfCG+DlADgUC3xGkHLvqZ2WYO3nxauDgzQCl2Cd+VYbtmOaFy/sXoBxb8qMyzHHeM83x6f2BBzmEUvT+XivTghfAcgJoln+Ai/vR/9XpF/dcmXwnPHOc5YGc+ELwAVbk9/2oTBM858G7ATL86cAD0FX5Sz8q44ELTXiW4UGXwl8EH6AYrfhVGbYD7pkDTYdvBgqPLAnTovx44NQ7dhlhC4ZwDlnhHM0JW/0qwxrwS5xrusQ9ds4RXICC9PoT19+8RGle/BoFofmnBkw5RrP8ZzQj/N0JzzXhWdpxGEiFXwsuQFH+cNf11xAzMISXB74/Kx6lGe6nXviw51QYSE6dDywAXZa+7QtuSpsw+d2fVduDpLk5mubudsM7pouhb4ILUJDudj6nin/SvDT/NL1FhRxGeuo8TYfve/AhsGQINDl1JxB4t8dmhDnw1JAoNcUF5Pk9/8aJn/kETU0t0GSIugFuhBh+JDF/qNtPtKgJ1BBvU1PKYTly3PfjJ589Tm9M5eji4V/wA+H9Pv5EE/1f9S9M4cKBWKiMUAAAAABJRU5ErkJggg==" />
                </div>
                  :
                  <div className='flex w-[50%]'>
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEJ0lEQVR4nO2ZvW8bdRzGf1Q09r357MT3YikTZSgIwdAWCZA6MYBQ/oIKykCHDlUZujcUlQ2pVMAYJFQQUgckhKCxHb/cxU7sOunZvoiKdkCZUFGGVlS0gd/vQXcXv9upae4SG/mRnsny3ef5+vHd92xCJppoosAEW3sVdf0EGUfB0lTY2kPXlqaScRPq2jxsHag71ubJOAm/Ph+Crf+OuubAAzX1HoqzHBkXwU6cacHvuKp+QMZBAHkGNXWjCV5THXjAUm87r5FRF6r6221Tb8ADluL4LTLqQk1L9YW/pQDr8UUyyoKlvQRLZX3hvQDAuvIKGVXBUr/qqkwXfByozCyQkb1xWcpfPVNvh19zAkw/QiWeIKMmWMrH/SvTBr8243wCji+RURKKsxys+B994RvgLXjg5vQWLE04uOu8reioxY/B0uZgKWdhKdcGVqYd3IP3XJ6+hlLsLMrROazKx1BSdF/uE6grR7Chn4SdOIW6fgE1/Qpq6nVUtQKq6iaq6vbuV5kB8A1wDx4ox4CSZ7YadU1Xotu0KG/SFblAi5HrtBi5goJ0AcuRUyiIJ2HKz+0Ov5H4yF3AWktY9zrQfWMatjKd4H3g2UrDMlhxx4WI5+WGJcAQLw4OYOunUddZE757Heg39eEr0wHeCy+3wHvgJTBTAjUkBlN67wkV0t9FXdvumXoAlWH94Bvg3fCm9A8M8cxw34Oa+iaq2oNRqAxzJy8+RF56Zyj4Zoh1/QSqyr2DrAzz4LdgiG/8J/hWnZQjsOJ3DqIyzIHPi78hKx59KvhmCOf6vB6/5U9l5KEqwzx4G1ludk/wzRC2ImItntyPyjAXXsghFZN9ge94zq3MfBdkZZghOvDfo0i44NaIysynQVSGOfCG+DlADgUC3xGkHLvqZ2WYO3nxauDgzQCl2Cd+VYbtmOaFy/sXoBxb8qMyzHHeM83x6f2BBzmEUvT+XivTghfAcgJoln+Ai/vR/9XpF/dcmXwnPHOc5YGc+ELwAVbk9/2oTBM858G7ATL86cAD0FX5Sz8q44ELTXiW4UGXwl8EH6AYrfhVGbYD7pkDTYdvBgqPLAnTovx44NQ7dhlhC4ZwDlnhHM0JW/0qwxrwS5xrusQ9ds4RXICC9PoT19+8RGle/BoFofmnBkw5RrP8ZzQj/N0JzzXhWdpxGEiFXwsuQFH+cNf11xAzMISXB74/Kx6lGe6nXviw51QYSE6dDywAXZa+7QtuSpsw+d2fVduDpLk5mubudsM7pouhb4ILUJDudj6nin/SvDT/NL1FhRxGeuo8TYfve/AhsGQINDl1JxB4t8dmhDnw1JAoNcUF5Pk9/8aJn/kETU0t0GSIugFuhBh+JDF/qNtPtKgJ1BBvU1PKYTly3PfjJ589Tm9M5eji4V/wA+H9Pv5EE/1f9S9M4cKBWKiMUAAAAABJRU5ErkJggg==" />
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEJ0lEQVR4nO2ZvW8bdRzGf1Q09r357MT3YikTZSgIwdAWCZA6MYBQ/oIKykCHDlUZujcUlQ2pVMAYJFQQUgckhKCxHb/cxU7sOunZvoiKdkCZUFGGVlS0gd/vQXcXv9upae4SG/mRnsny3ef5+vHd92xCJppoosAEW3sVdf0EGUfB0lTY2kPXlqaScRPq2jxsHag71ubJOAm/Ph+Crf+OuubAAzX1HoqzHBkXwU6cacHvuKp+QMZBAHkGNXWjCV5THXjAUm87r5FRF6r6221Tb8ADluL4LTLqQk1L9YW/pQDr8UUyyoKlvQRLZX3hvQDAuvIKGVXBUr/qqkwXfByozCyQkb1xWcpfPVNvh19zAkw/QiWeIKMmWMrH/SvTBr8243wCji+RURKKsxys+B994RvgLXjg5vQWLE04uOu8reioxY/B0uZgKWdhKdcGVqYd3IP3XJ6+hlLsLMrROazKx1BSdF/uE6grR7Chn4SdOIW6fgE1/Qpq6nVUtQKq6iaq6vbuV5kB8A1wDx4ox4CSZ7YadU1Xotu0KG/SFblAi5HrtBi5goJ0AcuRUyiIJ2HKz+0Ov5H4yF3AWktY9zrQfWMatjKd4H3g2UrDMlhxx4WI5+WGJcAQLw4OYOunUddZE757Heg39eEr0wHeCy+3wHvgJTBTAjUkBlN67wkV0t9FXdvumXoAlWH94Bvg3fCm9A8M8cxw34Oa+iaq2oNRqAxzJy8+RF56Zyj4Zoh1/QSqyr2DrAzz4LdgiG/8J/hWnZQjsOJ3DqIyzIHPi78hKx59KvhmCOf6vB6/5U9l5KEqwzx4G1ludk/wzRC2ImItntyPyjAXXsghFZN9ge94zq3MfBdkZZghOvDfo0i44NaIysynQVSGOfCG+DlADgUC3xGkHLvqZ2WYO3nxauDgzQCl2Cd+VYbtmOaFy/sXoBxb8qMyzHHeM83x6f2BBzmEUvT+XivTghfAcgJoln+Ai/vR/9XpF/dcmXwnPHOc5YGc+ELwAVbk9/2oTBM858G7ATL86cAD0FX5Sz8q44ELTXiW4UGXwl8EH6AYrfhVGbYD7pkDTYdvBgqPLAnTovx44NQ7dhlhC4ZwDlnhHM0JW/0qwxrwS5xrusQ9ds4RXICC9PoT19+8RGle/BoFofmnBkw5RrP8ZzQj/N0JzzXhWdpxGEiFXwsuQFH+cNf11xAzMISXB74/Kx6lGe6nXviw51QYSE6dDywAXZa+7QtuSpsw+d2fVduDpLk5mubudsM7pouhb4ILUJDudj6nin/SvDT/NL1FhRxGeuo8TYfve/AhsGQINDl1JxB4t8dmhDnw1JAoNcUF5Pk9/8aJn/kETU0t0GSIugFuhBh+JDF/qNtPtKgJ1BBvU1PKYTly3PfjJ589Tm9M5eji4V/wA+H9Pv5EE/1f9S9M4cKBWKiMUAAAAABJRU5ErkJggg==" />
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEJ0lEQVR4nO2ZvW8bdRzGf1Q09r357MT3YikTZSgIwdAWCZA6MYBQ/oIKykCHDlUZujcUlQ2pVMAYJFQQUgckhKCxHb/cxU7sOunZvoiKdkCZUFGGVlS0gd/vQXcXv9upae4SG/mRnsny3ef5+vHd92xCJppoosAEW3sVdf0EGUfB0lTY2kPXlqaScRPq2jxsHag71ubJOAm/Ph+Crf+OuubAAzX1HoqzHBkXwU6cacHvuKp+QMZBAHkGNXWjCV5THXjAUm87r5FRF6r6221Tb8ADluL4LTLqQk1L9YW/pQDr8UUyyoKlvQRLZX3hvQDAuvIKGVXBUr/qqkwXfByozCyQkb1xWcpfPVNvh19zAkw/QiWeIKMmWMrH/SvTBr8243wCji+RURKKsxys+B994RvgLXjg5vQWLE04uOu8reioxY/B0uZgKWdhKdcGVqYd3IP3XJ6+hlLsLMrROazKx1BSdF/uE6grR7Chn4SdOIW6fgE1/Qpq6nVUtQKq6iaq6vbuV5kB8A1wDx4ox4CSZ7YadU1Xotu0KG/SFblAi5HrtBi5goJ0AcuRUyiIJ2HKz+0Ov5H4yF3AWktY9zrQfWMatjKd4H3g2UrDMlhxx4WI5+WGJcAQLw4OYOunUddZE757Heg39eEr0wHeCy+3wHvgJTBTAjUkBlN67wkV0t9FXdvumXoAlWH94Bvg3fCm9A8M8cxw34Oa+iaq2oNRqAxzJy8+RF56Zyj4Zoh1/QSqyr2DrAzz4LdgiG/8J/hWnZQjsOJ3DqIyzIHPi78hKx59KvhmCOf6vB6/5U9l5KEqwzx4G1ludk/wzRC2ImItntyPyjAXXsghFZN9ge94zq3MfBdkZZghOvDfo0i44NaIysynQVSGOfCG+DlADgUC3xGkHLvqZ2WYO3nxauDgzQCl2Cd+VYbtmOaFy/sXoBxb8qMyzHHeM83x6f2BBzmEUvT+XivTghfAcgJoln+Ai/vR/9XpF/dcmXwnPHOc5YGc+ELwAVbk9/2oTBM858G7ATL86cAD0FX5Sz8q44ELTXiW4UGXwl8EH6AYrfhVGbYD7pkDTYdvBgqPLAnTovx44NQ7dhlhC4ZwDlnhHM0JW/0qwxrwS5xrusQ9ds4RXICC9PoT19+8RGle/BoFofmnBkw5RrP8ZzQj/N0JzzXhWdpxGEiFXwsuQFH+cNf11xAzMISXB74/Kx6lGe6nXviw51QYSE6dDywAXZa+7QtuSpsw+d2fVduDpLk5mubudsM7pouhb4ILUJDudj6nin/SvDT/NL1FhRxGeuo8TYfve/AhsGQINDl1JxB4t8dmhDnw1JAoNcUF5Pk9/8aJn/kETU0t0GSIugFuhBh+JDF/qNtPtKgJ1BBvU1PKYTly3PfjJ589Tm9M5eji4V/wA+H9Pv5EE/1f9S9M4cKBWKiMUAAAAABJRU5ErkJggg==" />
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEJ0lEQVR4nO2ZvW8bdRzGf1Q09r357MT3YikTZSgIwdAWCZA6MYBQ/oIKykCHDlUZujcUlQ2pVMAYJFQQUgckhKCxHb/cxU7sOunZvoiKdkCZUFGGVlS0gd/vQXcXv9upae4SG/mRnsny3ef5+vHd92xCJppoosAEW3sVdf0EGUfB0lTY2kPXlqaScRPq2jxsHag71ubJOAm/Ph+Crf+OuubAAzX1HoqzHBkXwU6cacHvuKp+QMZBAHkGNXWjCV5THXjAUm87r5FRF6r6221Tb8ADluL4LTLqQk1L9YW/pQDr8UUyyoKlvQRLZX3hvQDAuvIKGVXBUr/qqkwXfByozCyQkb1xWcpfPVNvh19zAkw/QiWeIKMmWMrH/SvTBr8243wCji+RURKKsxys+B994RvgLXjg5vQWLE04uOu8reioxY/B0uZgKWdhKdcGVqYd3IP3XJ6+hlLsLMrROazKx1BSdF/uE6grR7Chn4SdOIW6fgE1/Qpq6nVUtQKq6iaq6vbuV5kB8A1wDx4ox4CSZ7YadU1Xotu0KG/SFblAi5HrtBi5goJ0AcuRUyiIJ2HKz+0Ov5H4yF3AWktY9zrQfWMatjKd4H3g2UrDMlhxx4WI5+WGJcAQLw4OYOunUddZE757Heg39eEr0wHeCy+3wHvgJTBTAjUkBlN67wkV0t9FXdvumXoAlWH94Bvg3fCm9A8M8cxw34Oa+iaq2oNRqAxzJy8+RF56Zyj4Zoh1/QSqyr2DrAzz4LdgiG/8J/hWnZQjsOJ3DqIyzIHPi78hKx59KvhmCOf6vB6/5U9l5KEqwzx4G1ludk/wzRC2ImItntyPyjAXXsghFZN9ge94zq3MfBdkZZghOvDfo0i44NaIysynQVSGOfCG+DlADgUC3xGkHLvqZ2WYO3nxauDgzQCl2Cd+VYbtmOaFy/sXoBxb8qMyzHHeM83x6f2BBzmEUvT+XivTghfAcgJoln+Ai/vR/9XpF/dcmXwnPHOc5YGc+ELwAVbk9/2oTBM858G7ATL86cAD0FX5Sz8q44ELTXiW4UGXwl8EH6AYrfhVGbYD7pkDTYdvBgqPLAnTovx44NQ7dhlhC4ZwDlnhHM0JW/0qwxrwS5xrusQ9ds4RXICC9PoT19+8RGle/BoFofmnBkw5RrP8ZzQj/N0JzzXhWdpxGEiFXwsuQFH+cNf11xAzMISXB74/Kx6lGe6nXviw51QYSE6dDywAXZa+7QtuSpsw+d2fVduDpLk5mubudsM7pouhb4ILUJDudj6nin/SvDT/NL1FhRxGeuo8TYfve/AhsGQINDl1JxB4t8dmhDnw1JAoNcUF5Pk9/8aJn/kETU0t0GSIugFuhBh+JDF/qNtPtKgJ1BBvU1PKYTly3PfjJ589Tm9M5eji4V/wA+H9Pv5EE/1f9S9M4cKBWKiMUAAAAABJRU5ErkJggg==" />
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADxElEQVR4nO1Z3UtUQRQf+zLCIhKih0AKvXPuVmotUmZpUVAPgtCbUI/1H2RvUUjoS5CQD+FDUFL5kRQZlhUWld4zu+GLWPhgPfVgWpYVfXpi5uqy997ZdT+8tgt7YF72zvzO7zdz58xv7jKWi1zkwrcgATWysWwNEvCEBH/MsjEIoZIEkGqWuZ9lW5DgDyMCBDxg2RQUNndHkbdbyKhi2RKE/L5HgOC9LBuCwrCLEGa9AmQzKlimByHc1ZMHIoQ7LJODMFAee/aVgFmyIMgyNQj5bSdh/pQEf+YS0c0yMQjNbYTw10nWPETCPOxZhSGjlGVakIAOV9UZjDxDeO5amVssk4KGSkzv7PMjkedoHHWtguy7/f+QRSgkC/aQME+QgEZCfpMEjLsIomYcujb1+NzYRoUlMREKF4fkcNl6WbPJgnoScJYEtNsE+FTMCuMUUKsRUJvQWMGn5sS2q9yKg1EhOSUyuxcIYSKxRDEJDBOxPA82sTz1LB1shAnJMbaAcHANIe9PPQF/TyGjLiZ+yKhTfVLH75cc46/CQNFq6VtigPwhAW+lxyeEK2SZDSTgGFklZTQSKFhwiedzjAQK1Bghx5oNCktiKmyVQ7eyvZJboglWeQ4lG+Sjn36G7JP8gybvPRorzk8OrJMtJ4TrmmX8JO2yLyZQ8EnN7HdQOLgyNVApQsBVzWaalmVv0chbENRWOOQ3aKBmRXrgsnogv6wB/0ohfiBt8iGjigR81rw2bURsWbr40SJaNSJmCM3qlHHRrFYYXtxWXSlOX4TgFzXJvpHFDyaNFzb2kYAvS0LekVjwJs1G60seB/o0r02TP6zdyeXmciZuThpD8Gb3hvWHrS45QpcjuQX1SWPYPouiKluXP2x1yRHeOJKH+Y6kMYaMUpeA1/6w1VqN6OOe/451ShKCIZv22VhxvhobbVMStQppH/fOzTfq6WMVb1Z1XBFUrU3+5uknYNS5CoFy/wXYFxntu0uDgQ1zm/O7pjz+VKbt5daNkf4I3c5+xvElEOCpHudsGw5nlE9a2BLPKIwXfC0hP7/kZdRrtXlPSh5fjeE9bsvsvwDk7xIjKZ0lPz3XJhMU9c5f8lbxurhf3uZNnnxFou6w6gKjXjGYjj8WZmUO/wQIvjcOcXuTYmBT3C8asTa5iIio9FEAnNIQ/0XIr5FlbEkYR5VZaCGEHxoBJ/0U0OL6ONVJQ2ZJynivzCL7Phx1MCJcWlzWnj/t1Kw/ImHuXDRcKxBQk6H2l49/CioX6sN92PHX1FK60lzkgmV//AM7f1WAktwY2AAAAABJRU5ErkJggg==" />
                  </div>}
              </div>
            );
          }) : <div className="flex justify-center items-center h-[80%]">
            {property ? <span className='text-black text-large text-[#636363] gap-4 flex items-center'><TbFaceIdError size={40} /> No Porperty Found</span> : <Oval
              height={80}
              width={80}
              color="#4fa94d"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel='oval-loading'
              secondaryColor="#4fa94d"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />}
          </div>}
        </div>
      </div >
    ) : (
      <div className="bg-cover bg-no-repeat bg-center h-screen bg-white overflow-hidden">
        <div className='flex'>
          <div className="flex mx-[5%] mt-9 h-14 w-[90%] bg-[#d6d6d6] text-black rounded-full justify-between items-center text-sm fixed bottom-5">
            <Link href="/"><div className='px-5 py-4'>Home</div></Link>
            <Link href="" className='px-2 py-4 text-blue-700'><div>Properties</div></Link>
            <Link href="/sell_rent" className='px-2 py-4 '><div>Sell/Rent</div></Link>
            <Link href="/aboutus" className='px-2 py-4 '><div className='pe-5'>About us</div></Link>
          </div>
        </div>
        <style>
          {`
          .custom-border {
            border: 1px solid black;
          }
          .bubbleborder{
            border: 1px solid blue;
          }
          .popup {
            display: ${showFiltersPopup ? 'block' : 'none'};
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
          }
          .popup-content {
            background: white;
            width: 70%;
            max-width: 500px;
            margin: 10% auto;
            padding: 20px;
            border-radius: 10px;
            position: relative;
          }
          .close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
          }
        `}
        </style>
        <div className='flex text-black justify-left items-center'>
          <Image className='ms-5 mt-2' width={50} height={50} src="/logo.png" />
          <span className='ms-2 mt-4 text-lg font-chonburi font-bold'>CC RealEstate</span>
          {user ? (
            <div style={{ cursor: 'pointer' }} className='flex h-fit mt-3 me-5 text-right items-center absolute right-0' onClick={handleToggleSignOutDropdown}>
              <div>
                <Image
                  src={dpUrl}
                  alt={"photo"}
                  width={30}
                  height={30}
                  className="rounded-full" />
              </div>
              <div>{showSignOutDropdown ? <BiSolidUpArrow className='ms-2 text-black' size={12} /> : <BiSolidDownArrow className='ms-2 text-black' size={12} />}</div>
              {showSignOutDropdown && (
                <div
                  className="absolute right-0 w-[10vh] mt-20 bg-[#d6d6d6] text-black rounded-xl p-2"
                >
                  <div className="flex" onClick={handleSignOut}>
                    <AiOutlinePoweroff size={10} />
                    <button className="ps-2 text-[8px]">
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (<Link href="/signup" className='w-20 me-2 mt-3 absolute right-0'>
            <div className='flex text-black'>
              <BsFillPersonFill size={20} />
              <div className='ps-2 text-[10px] pt-1'>Sign up</div>
            </div>
          </Link>)}
        </div>
        <div className='justify-between items-center flex ms-5 mt-4 mb-2'>
          <div className="flex ps-5 bg-white w-full me-5 h-[40px] custom-border rounded-full text-xl border-none outline-none text-black items-center">
            <BsSearch size={20} />
            <input
              className='ms-5 w-[80%] border-none text-[14px] outline-none text-black placeholder-[#808080]'
              placeholder="Search property type..."
              type="text"
              value={SearchWord === "all" ? "" : SearchWord}
              onChange={(e) => setSearchWord(e.target.value)}
            />
            <IoOptionsOutline size={20} className='ms-2 me-4' style={{ cursor: 'pointer' }} onClick={toggleFiltersPopup} />
          </div>
          {showFiltersPopup && (
            <div className="popup">
              <div className="popup-content text-black">
                <div className="close-button" onClick={toggleFiltersPopup}>
                  X
                </div>
                <div>
                  <div>
                    Price Range
                    <Slider
                      min={0}
                      max={10000000}
                      step={10000}
                      range
                      value={priceRange}
                      onChange={handlePriceRangeChange}
                    />
                    <div className="flex overflow-hidden w-full justify-between items-center">
                      <span className='ms-2'>Rs</span>
                      <input
                        className='ps-2 me-2 w-[15vh]'
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceRangeChange([+e.target.value, priceRange[1]])}
                        placeholder="Min Price"
                      />
                      <span>Rs</span>
                      <input
                        className='ps-2 w-[20vh]'
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceRangeChange([priceRange[0], +e.target.value])}
                        placeholder="Max Price"
                      />
                    </div>
                  </div>
                  <div className='mt-5'>
                    Area Range in sq.foot
                    <Slider
                      min={0}
                      max={10000}
                      step={1}
                      range
                      value={areaRange}
                      onChange={handleAreaRangeChange}
                    />
                    <div className="flex overflow-hidden w-full justify-between items-center">
                      <input
                        className='w-[10vh]'
                        type="number"
                        value={areaRange[0]}
                        onChange={(e) => handleAreaRangeChange([+e.target.value, areaRange[1]])}
                      />
                      <input
                        className='w-[10vh]'
                        type="number"
                        value={areaRange[1]}
                        onChange={(e) => handleAreaRangeChange([areaRange[0], +e.target.value])}
                      />
                    </div>
                  </div>
                  <div className='mt-4'>
                    <span>No. of Bedrooms</span>
                    <input
                      className='ms-10 w-[70px]'
                      type="number"
                      value={numbedroom}
                      onChange={(e) => handleNumbedroomChange(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className='flex justify-left ms-[9%]'>
          {priceRange[0] !== 0 || priceRange[1] !== 10000000 ? (
            <div className="flex me-1 justify-center items-center w-fit px-2 h-fit text-[10px] rounded-full bubbleborder text-blue-700">
              <span>Rs {priceRange[0]} to Rs {priceRange[1]}</span>
              <RxCross1 className='ms-2 text-black' size={20} style={{ cursor: 'pointer' }} onClick={resetPriceRange} />
            </div>
          ) : null}
          {areaRange[0] !== 0 || areaRange[1] !== 10000 ? (
            <div className="flex px-2 me-1 justify-center items-center w-fit h-fit text-[10px] rounded-full bubbleborder text-blue-700">
              <span>{areaRange[0]} sq.foot to {areaRange[1]} sq.foot</span>
              <RxCross1 className='ms-2 text-black' size={20} style={{ cursor: 'pointer' }} onClick={resetAreaRange} />
            </div>
          ) : null}
          {parseInt(numbedroom) !== 0 ? (
            <div className="flex px-2 justify-center me-10 items-center w-fit h-fit text-[10px] rounded-full bubbleborder text-blue-700">
              <span>Bedrooms: {numbedroom}</span>
              <RxCross1 className='ms-2 text-black' size={20} style={{ cursor: 'pointer' }} onClick={resetNumBedroom} />
            </div>
          ) : null}
        </div>
        <div className="h-[63%] w-full overflow-y-auto custom-scrollbar mt-3">
          <style jsx>
            {`
    /* Style for custom scrollbar */
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: #1b1b1c transparent;
    }

    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: #1b1b1c;
      border-radius: 5px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
  `}
          </style>
          {filteredProperty && filteredProperty.length > 0 ? filteredProperty.slice(0, 100).map((item, index) => {
            return (
              <div
                key={index}
                className="flex flex-col w-full items-center m-auto mb-10 px-5 py-1 transform transition duration-150">
                <div className='flex flex-row'>
                  <Carousel className='w-[60%] h-[20vh]'>
                    <div className="image-container">
                      <Image
                        className="rounded-xl"
                        src={item.url1}
                        alt="Property thumbnail"
                        width={200}
                        height={200}
                      />
                    </div>
                    <div className="image-container">
                      <Image
                        className="rounded-xl"
                        src={item.url2}
                        alt="Property thumbnail"
                        width={200}
                        height={200}
                      />
                    </div>
                    <div className="image-container">
                      <Image
                        className="rounded-xl"
                        src={item.url3}
                        alt="Property thumbnail"
                        width={200}
                        height={200}
                      />
                    </div>
                    <div className="image-container">
                      <Image
                        className="rounded-xl"
                        src={item.url4}
                        alt="Property thumbnail"
                        width={200}
                        height={200}
                      />
                    </div>
                  </Carousel>
                  <style>
                    {`
  .image-container {
    height: 150px; 
    overflow: hidden;
  }

  .image-container img {
    object-fit: cover;
    width: 100%; 
    height: 100%; 
  }
`}</style>

                  <div className="flex flex-row ms-2 py-2 transform transition duration-150">
                    <div className="flex bg-white h-auto rounded-xl">
                      <div className="flex flex-col">
                        <span className="ms-2 text-lg text-black font-bold">
                          Rs {item.price}
                        </span>
                        <div className="mt-2 ms-2 text-black text-md max-h-20" style={{ maxWidth: '100px', wordWrap: 'break-word' }}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex w-[80%] justify-between gap-4 items-center'>
                  <div className='flex flex-col justify-center items-center ms-1 text-black text-xs flex gap-1'>
                    <span className='font-bold text-[2vh]'>{item.area}</span>
                    <span>sq.foot</span>
                  </div>
                  <div className='flex flex-col justify-center items-center ms-1 text-black text-xs flex gap-1'>
                    <BiBed size={20} />
                    <span className='flex flex-row gap-1'>{item.bedroom}<span>Bedroom</span></span>
                  </div>
                  <div className='flex flex-col justify-center items-center ms-1 text-black text-xs flex gap-1'>
                    <PiBathtubBold size={20} />
                    <span className='flex flex-row gap-1'>{item.bathroom} <span>Bathroom</span></span>
                  </div>
                </div>
                {item.stars === 5 ?
                  <div className='flex justify-center gap-4'>
                    <img className='h-10 w-10' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEJ0lEQVR4nO2ZvW8bdRzGf1Q09r357MT3YikTZSgIwdAWCZA6MYBQ/oIKykCHDlUZujcUlQ2pVMAYJFQQUgckhKCxHb/cxU7sOunZvoiKdkCZUFGGVlS0gd/vQXcXv9upae4SG/mRnsny3ef5+vHd92xCJppoosAEW3sVdf0EGUfB0lTY2kPXlqaScRPq2jxsHag71ubJOAm/Ph+Crf+OuubAAzX1HoqzHBkXwU6cacHvuKp+QMZBAHkGNXWjCV5THXjAUm87r5FRF6r6221Tb8ADluL4LTLqQk1L9YW/pQDr8UUyyoKlvQRLZX3hvQDAuvIKGVXBUr/qqkwXfByozCyQkb1xWcpfPVNvh19zAkw/QiWeIKMmWMrH/SvTBr8243wCji+RURKKsxys+B994RvgLXjg5vQWLE04uOu8reioxY/B0uZgKWdhKdcGVqYd3IP3XJ6+hlLsLMrROazKx1BSdF/uE6grR7Chn4SdOIW6fgE1/Qpq6nVUtQKq6iaq6vbuV5kB8A1wDx4ox4CSZ7YadU1Xotu0KG/SFblAi5HrtBi5goJ0AcuRUyiIJ2HKz+0Ov5H4yF3AWktY9zrQfWMatjKd4H3g2UrDMlhxx4WI5+WGJcAQLw4OYOunUddZE757Heg39eEr0wHeCy+3wHvgJTBTAjUkBlN67wkV0t9FXdvumXoAlWH94Bvg3fCm9A8M8cxw34Oa+iaq2oNRqAxzJy8+RF56Zyj4Zoh1/QSqyr2DrAzz4LdgiG/8J/hWnZQjsOJ3DqIyzIHPi78hKx59KvhmCOf6vB6/5U9l5KEqwzx4G1ludk/wzRC2ImItntyPyjAXXsghFZN9ge94zq3MfBdkZZghOvDfo0i44NaIysynQVSGOfCG+DlADgUC3xGkHLvqZ2WYO3nxauDgzQCl2Cd+VYbtmOaFy/sXoBxb8qMyzHHeM83x6f2BBzmEUvT+XivTghfAcgJoln+Ai/vR/9XpF/dcmXwnPHOc5YGc+ELwAVbk9/2oTBM858G7ATL86cAD0FX5Sz8q44ELTXiW4UGXwl8EH6AYrfhVGbYD7pkDTYdvBgqPLAnTovx44NQ7dhlhC4ZwDlnhHM0JW/0qwxrwS5xrusQ9ds4RXICC9PoT19+8RGle/BoFofmnBkw5RrP8ZzQj/N0JzzXhWdpxGEiFXwsuQFH+cNf11xAzMISXB74/Kx6lGe6nXviw51QYSE6dDywAXZa+7QtuSpsw+d2fVduDpLk5mubudsM7pouhb4ILUJDudj6nin/SvDT/NL1FhRxGeuo8TYfve/AhsGQINDl1JxB4t8dmhDnw1JAoNcUF5Pk9/8aJn/kETU0t0GSIugFuhBh+JDF/qNtPtKgJ1BBvU1PKYTly3PfjJ589Tm9M5eji4V/wA+H9Pv5EE/1f9S9M4cKBWKiMUAAAAABJRU5ErkJggg==" />
                    <img className='h-10 w-10' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEJ0lEQVR4nO2ZvW8bdRzGf1Q09r357MT3YikTZSgIwdAWCZA6MYBQ/oIKykCHDlUZujcUlQ2pVMAYJFQQUgckhKCxHb/cxU7sOunZvoiKdkCZUFGGVlS0gd/vQXcXv9upae4SG/mRnsny3ef5+vHd92xCJppoosAEW3sVdf0EGUfB0lTY2kPXlqaScRPq2jxsHag71ubJOAm/Ph+Crf+OuubAAzX1HoqzHBkXwU6cacHvuKp+QMZBAHkGNXWjCV5THXjAUm87r5FRF6r6221Tb8ADluL4LTLqQk1L9YW/pQDr8UUyyoKlvQRLZX3hvQDAuvIKGVXBUr/qqkwXfByozCyQkb1xWcpfPVNvh19zAkw/QiWeIKMmWMrH/SvTBr8243wCji+RURKKsxys+B994RvgLXjg5vQWLE04uOu8reioxY/B0uZgKWdhKdcGVqYd3IP3XJ6+hlLsLMrROazKx1BSdF/uE6grR7Chn4SdOIW6fgE1/Qpq6nVUtQKq6iaq6vbuV5kB8A1wDx4ox4CSZ7YadU1Xotu0KG/SFblAi5HrtBi5goJ0AcuRUyiIJ2HKz+0Ov5H4yF3AWktY9zrQfWMatjKd4H3g2UrDMlhxx4WI5+WGJcAQLw4OYOunUddZE757Heg39eEr0wHeCy+3wHvgJTBTAjUkBlN67wkV0t9FXdvumXoAlWH94Bvg3fCm9A8M8cxw34Oa+iaq2oNRqAxzJy8+RF56Zyj4Zoh1/QSqyr2DrAzz4LdgiG/8J/hWnZQjsOJ3DqIyzIHPi78hKx59KvhmCOf6vB6/5U9l5KEqwzx4G1ludk/wzRC2ImItntyPyjAXXsghFZN9ge94zq3MfBdkZZghOvDfo0i44NaIysynQVSGOfCG+DlADgUC3xGkHLvqZ2WYO3nxauDgzQCl2Cd+VYbtmOaFy/sXoBxb8qMyzHHeM83x6f2BBzmEUvT+XivTghfAcgJoln+Ai/vR/9XpF/dcmXwnPHOc5YGc+ELwAVbk9/2oTBM858G7ATL86cAD0FX5Sz8q44ELTXiW4UGXwl8EH6AYrfhVGbYD7pkDTYdvBgqPLAnTovx44NQ7dhlhC4ZwDlnhHM0JW/0qwxrwS5xrusQ9ds4RXICC9PoT19+8RGle/BoFofmnBkw5RrP8ZzQj/N0JzzXhWdpxGEiFXwsuQFH+cNf11xAzMISXB74/Kx6lGe6nXviw51QYSE6dDywAXZa+7QtuSpsw+d2fVduDpLk5mubudsM7pouhb4ILUJDudj6nin/SvDT/NL1FhRxGeuo8TYfve/AhsGQINDl1JxB4t8dmhDnw1JAoNcUF5Pk9/8aJn/kETU0t0GSIugFuhBh+JDF/qNtPtKgJ1BBvU1PKYTly3PfjJ589Tm9M5eji4V/wA+H9Pv5EE/1f9S9M4cKBWKiMUAAAAABJRU5ErkJggg==" />
                    <img className='h-10 w-10' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEJ0lEQVR4nO2ZvW8bdRzGf1Q09r357MT3YikTZSgIwdAWCZA6MYBQ/oIKykCHDlUZujcUlQ2pVMAYJFQQUgckhKCxHb/cxU7sOunZvoiKdkCZUFGGVlS0gd/vQXcXv9upae4SG/mRnsny3ef5+vHd92xCJppoosAEW3sVdf0EGUfB0lTY2kPXlqaScRPq2jxsHag71ubJOAm/Ph+Crf+OuubAAzX1HoqzHBkXwU6cacHvuKp+QMZBAHkGNXWjCV5THXjAUm87r5FRF6r6221Tb8ADluL4LTLqQk1L9YW/pQDr8UUyyoKlvQRLZX3hvQDAuvIKGVXBUr/qqkwXfByozCyQkb1xWcpfPVNvh19zAkw/QiWeIKMmWMrH/SvTBr8243wCji+RURKKsxys+B994RvgLXjg5vQWLE04uOu8reioxY/B0uZgKWdhKdcGVqYd3IP3XJ6+hlLsLMrROazKx1BSdF/uE6grR7Chn4SdOIW6fgE1/Qpq6nVUtQKq6iaq6vbuV5kB8A1wDx4ox4CSZ7YadU1Xotu0KG/SFblAi5HrtBi5goJ0AcuRUyiIJ2HKz+0Ov5H4yF3AWktY9zrQfWMatjKd4H3g2UrDMlhxx4WI5+WGJcAQLw4OYOunUddZE757Heg39eEr0wHeCy+3wHvgJTBTAjUkBlN67wkV0t9FXdvumXoAlWH94Bvg3fCm9A8M8cxw34Oa+iaq2oNRqAxzJy8+RF56Zyj4Zoh1/QSqyr2DrAzz4LdgiG/8J/hWnZQjsOJ3DqIyzIHPi78hKx59KvhmCOf6vB6/5U9l5KEqwzx4G1ludk/wzRC2ImItntyPyjAXXsghFZN9ge94zq3MfBdkZZghOvDfo0i44NaIysynQVSGOfCG+DlADgUC3xGkHLvqZ2WYO3nxauDgzQCl2Cd+VYbtmOaFy/sXoBxb8qMyzHHeM83x6f2BBzmEUvT+XivTghfAcgJoln+Ai/vR/9XpF/dcmXwnPHOc5YGc+ELwAVbk9/2oTBM858G7ATL86cAD0FX5Sz8q44ELTXiW4UGXwl8EH6AYrfhVGbYD7pkDTYdvBgqPLAnTovx44NQ7dhlhC4ZwDlnhHM0JW/0qwxrwS5xrusQ9ds4RXICC9PoT19+8RGle/BoFofmnBkw5RrP8ZzQj/N0JzzXhWdpxGEiFXwsuQFH+cNf11xAzMISXB74/Kx6lGe6nXviw51QYSE6dDywAXZa+7QtuSpsw+d2fVduDpLk5mubudsM7pouhb4ILUJDudj6nin/SvDT/NL1FhRxGeuo8TYfve/AhsGQINDl1JxB4t8dmhDnw1JAoNcUF5Pk9/8aJn/kETU0t0GSIugFuhBh+JDF/qNtPtKgJ1BBvU1PKYTly3PfjJ589Tm9M5eji4V/wA+H9Pv5EE/1f9S9M4cKBWKiMUAAAAABJRU5ErkJggg==" />
                    <img className='h-10 w-10' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEJ0lEQVR4nO2ZvW8bdRzGf1Q09r357MT3YikTZSgIwdAWCZA6MYBQ/oIKykCHDlUZujcUlQ2pVMAYJFQQUgckhKCxHb/cxU7sOunZvoiKdkCZUFGGVlS0gd/vQXcXv9upae4SG/mRnsny3ef5+vHd92xCJppoosAEW3sVdf0EGUfB0lTY2kPXlqaScRPq2jxsHag71ubJOAm/Ph+Crf+OuubAAzX1HoqzHBkXwU6cacHvuKp+QMZBAHkGNXWjCV5THXjAUm87r5FRF6r6221Tb8ADluL4LTLqQk1L9YW/pQDr8UUyyoKlvQRLZX3hvQDAuvIKGVXBUr/qqkwXfByozCyQkb1xWcpfPVNvh19zAkw/QiWeIKMmWMrH/SvTBr8243wCji+RURKKsxys+B994RvgLXjg5vQWLE04uOu8reioxY/B0uZgKWdhKdcGVqYd3IP3XJ6+hlLsLMrROazKx1BSdF/uE6grR7Chn4SdOIW6fgE1/Qpq6nVUtQKq6iaq6vbuV5kB8A1wDx4ox4CSZ7YadU1Xotu0KG/SFblAi5HrtBi5goJ0AcuRUyiIJ2HKz+0Ov5H4yF3AWktY9zrQfWMatjKd4H3g2UrDMlhxx4WI5+WGJcAQLw4OYOunUddZE757Heg39eEr0wHeCy+3wHvgJTBTAjUkBlN67wkV0t9FXdvumXoAlWH94Bvg3fCm9A8M8cxw34Oa+iaq2oNRqAxzJy8+RF56Zyj4Zoh1/QSqyr2DrAzz4LdgiG/8J/hWnZQjsOJ3DqIyzIHPi78hKx59KvhmCOf6vB6/5U9l5KEqwzx4G1ludk/wzRC2ImItntyPyjAXXsghFZN9ge94zq3MfBdkZZghOvDfo0i44NaIysynQVSGOfCG+DlADgUC3xGkHLvqZ2WYO3nxauDgzQCl2Cd+VYbtmOaFy/sXoBxb8qMyzHHeM83x6f2BBzmEUvT+XivTghfAcgJoln+Ai/vR/9XpF/dcmXwnPHOc5YGc+ELwAVbk9/2oTBM858G7ATL86cAD0FX5Sz8q44ELTXiW4UGXwl8EH6AYrfhVGbYD7pkDTYdvBgqPLAnTovx44NQ7dhlhC4ZwDlnhHM0JW/0qwxrwS5xrusQ9ds4RXICC9PoT19+8RGle/BoFofmnBkw5RrP8ZzQj/N0JzzXhWdpxGEiFXwsuQFH+cNf11xAzMISXB74/Kx6lGe6nXviw51QYSE6dDywAXZa+7QtuSpsw+d2fVduDpLk5mubudsM7pouhb4ILUJDudj6nin/SvDT/NL1FhRxGeuo8TYfve/AhsGQINDl1JxB4t8dmhDnw1JAoNcUF5Pk9/8aJn/kETU0t0GSIugFuhBh+JDF/qNtPtKgJ1BBvU1PKYTly3PfjJ589Tm9M5eji4V/wA+H9Pv5EE/1f9S9M4cKBWKiMUAAAAABJRU5ErkJggg==" />
                    <img className='h-10 w-10' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEJ0lEQVR4nO2ZvW8bdRzGf1Q09r357MT3YikTZSgIwdAWCZA6MYBQ/oIKykCHDlUZujcUlQ2pVMAYJFQQUgckhKCxHb/cxU7sOunZvoiKdkCZUFGGVlS0gd/vQXcXv9upae4SG/mRnsny3ef5+vHd92xCJppoosAEW3sVdf0EGUfB0lTY2kPXlqaScRPq2jxsHag71ubJOAm/Ph+Crf+OuubAAzX1HoqzHBkXwU6cacHvuKp+QMZBAHkGNXWjCV5THXjAUm87r5FRF6r6221Tb8ADluL4LTLqQk1L9YW/pQDr8UUyyoKlvQRLZX3hvQDAuvIKGVXBUr/qqkwXfByozCyQkb1xWcpfPVNvh19zAkw/QiWeIKMmWMrH/SvTBr8243wCji+RURKKsxys+B994RvgLXjg5vQWLE04uOu8reioxY/B0uZgKWdhKdcGVqYd3IP3XJ6+hlLsLMrROazKx1BSdF/uE6grR7Chn4SdOIW6fgE1/Qpq6nVUtQKq6iaq6vbuV5kB8A1wDx4ox4CSZ7YadU1Xotu0KG/SFblAi5HrtBi5goJ0AcuRUyiIJ2HKz+0Ov5H4yF3AWktY9zrQfWMatjKd4H3g2UrDMlhxx4WI5+WGJcAQLw4OYOunUddZE757Heg39eEr0wHeCy+3wHvgJTBTAjUkBlN67wkV0t9FXdvumXoAlWH94Bvg3fCm9A8M8cxw34Oa+iaq2oNRqAxzJy8+RF56Zyj4Zoh1/QSqyr2DrAzz4LdgiG/8J/hWnZQjsOJ3DqIyzIHPi78hKx59KvhmCOf6vB6/5U9l5KEqwzx4G1ludk/wzRC2ImItntyPyjAXXsghFZN9ge94zq3MfBdkZZghOvDfo0i44NaIysynQVSGOfCG+DlADgUC3xGkHLvqZ2WYO3nxauDgzQCl2Cd+VYbtmOaFy/sXoBxb8qMyzHHeM83x6f2BBzmEUvT+XivTghfAcgJoln+Ai/vR/9XpF/dcmXwnPHOc5YGc+ELwAVbk9/2oTBM858G7ATL86cAD0FX5Sz8q44ELTXiW4UGXwl8EH6AYrfhVGbYD7pkDTYdvBgqPLAnTovx44NQ7dhlhC4ZwDlnhHM0JW/0qwxrwS5xrusQ9ds4RXICC9PoT19+8RGle/BoFofmnBkw5RrP8ZzQj/N0JzzXhWdpxGEiFXwsuQFH+cNf11xAzMISXB74/Kx6lGe6nXviw51QYSE6dDywAXZa+7QtuSpsw+d2fVduDpLk5mubudsM7pouhb4ILUJDudj6nin/SvDT/NL1FhRxGeuo8TYfve/AhsGQINDl1JxB4t8dmhDnw1JAoNcUF5Pk9/8aJn/kETU0t0GSIugFuhBh+JDF/qNtPtKgJ1BBvU1PKYTly3PfjJ589Tm9M5eji4V/wA+H9Pv5EE/1f9S9M4cKBWKiMUAAAAABJRU5ErkJggg==" />
                  </div>
                  :
                  <div className='flex justify-center gap-6'>
                    <img className='h-10 w-10' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEJ0lEQVR4nO2ZvW8bdRzGf1Q09r357MT3YikTZSgIwdAWCZA6MYBQ/oIKykCHDlUZujcUlQ2pVMAYJFQQUgckhKCxHb/cxU7sOunZvoiKdkCZUFGGVlS0gd/vQXcXv9upae4SG/mRnsny3ef5+vHd92xCJppoosAEW3sVdf0EGUfB0lTY2kPXlqaScRPq2jxsHag71ubJOAm/Ph+Crf+OuubAAzX1HoqzHBkXwU6cacHvuKp+QMZBAHkGNXWjCV5THXjAUm87r5FRF6r6221Tb8ADluL4LTLqQk1L9YW/pQDr8UUyyoKlvQRLZX3hvQDAuvIKGVXBUr/qqkwXfByozCyQkb1xWcpfPVNvh19zAkw/QiWeIKMmWMrH/SvTBr8243wCji+RURKKsxys+B994RvgLXjg5vQWLE04uOu8reioxY/B0uZgKWdhKdcGVqYd3IP3XJ6+hlLsLMrROazKx1BSdF/uE6grR7Chn4SdOIW6fgE1/Qpq6nVUtQKq6iaq6vbuV5kB8A1wDx4ox4CSZ7YadU1Xotu0KG/SFblAi5HrtBi5goJ0AcuRUyiIJ2HKz+0Ov5H4yF3AWktY9zrQfWMatjKd4H3g2UrDMlhxx4WI5+WGJcAQLw4OYOunUddZE757Heg39eEr0wHeCy+3wHvgJTBTAjUkBlN67wkV0t9FXdvumXoAlWH94Bvg3fCm9A8M8cxw34Oa+iaq2oNRqAxzJy8+RF56Zyj4Zoh1/QSqyr2DrAzz4LdgiG/8J/hWnZQjsOJ3DqIyzIHPi78hKx59KvhmCOf6vB6/5U9l5KEqwzx4G1ludk/wzRC2ImItntyPyjAXXsghFZN9ge94zq3MfBdkZZghOvDfo0i44NaIysynQVSGOfCG+DlADgUC3xGkHLvqZ2WYO3nxauDgzQCl2Cd+VYbtmOaFy/sXoBxb8qMyzHHeM83x6f2BBzmEUvT+XivTghfAcgJoln+Ai/vR/9XpF/dcmXwnPHOc5YGc+ELwAVbk9/2oTBM858G7ATL86cAD0FX5Sz8q44ELTXiW4UGXwl8EH6AYrfhVGbYD7pkDTYdvBgqPLAnTovx44NQ7dhlhC4ZwDlnhHM0JW/0qwxrwS5xrusQ9ds4RXICC9PoT19+8RGle/BoFofmnBkw5RrP8ZzQj/N0JzzXhWdpxGEiFXwsuQFH+cNf11xAzMISXB74/Kx6lGe6nXviw51QYSE6dDywAXZa+7QtuSpsw+d2fVduDpLk5mubudsM7pouhb4ILUJDudj6nin/SvDT/NL1FhRxGeuo8TYfve/AhsGQINDl1JxB4t8dmhDnw1JAoNcUF5Pk9/8aJn/kETU0t0GSIugFuhBh+JDF/qNtPtKgJ1BBvU1PKYTly3PfjJ589Tm9M5eji4V/wA+H9Pv5EE/1f9S9M4cKBWKiMUAAAAABJRU5ErkJggg==" />
                    <img className='h-10 w-10' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEJ0lEQVR4nO2ZvW8bdRzGf1Q09r357MT3YikTZSgIwdAWCZA6MYBQ/oIKykCHDlUZujcUlQ2pVMAYJFQQUgckhKCxHb/cxU7sOunZvoiKdkCZUFGGVlS0gd/vQXcXv9upae4SG/mRnsny3ef5+vHd92xCJppoosAEW3sVdf0EGUfB0lTY2kPXlqaScRPq2jxsHag71ubJOAm/Ph+Crf+OuubAAzX1HoqzHBkXwU6cacHvuKp+QMZBAHkGNXWjCV5THXjAUm87r5FRF6r6221Tb8ADluL4LTLqQk1L9YW/pQDr8UUyyoKlvQRLZX3hvQDAuvIKGVXBUr/qqkwXfByozCyQkb1xWcpfPVNvh19zAkw/QiWeIKMmWMrH/SvTBr8243wCji+RURKKsxys+B994RvgLXjg5vQWLE04uOu8reioxY/B0uZgKWdhKdcGVqYd3IP3XJ6+hlLsLMrROazKx1BSdF/uE6grR7Chn4SdOIW6fgE1/Qpq6nVUtQKq6iaq6vbuV5kB8A1wDx4ox4CSZ7YadU1Xotu0KG/SFblAi5HrtBi5goJ0AcuRUyiIJ2HKz+0Ov5H4yF3AWktY9zrQfWMatjKd4H3g2UrDMlhxx4WI5+WGJcAQLw4OYOunUddZE757Heg39eEr0wHeCy+3wHvgJTBTAjUkBlN67wkV0t9FXdvumXoAlWH94Bvg3fCm9A8M8cxw34Oa+iaq2oNRqAxzJy8+RF56Zyj4Zoh1/QSqyr2DrAzz4LdgiG/8J/hWnZQjsOJ3DqIyzIHPi78hKx59KvhmCOf6vB6/5U9l5KEqwzx4G1ludk/wzRC2ImItntyPyjAXXsghFZN9ge94zq3MfBdkZZghOvDfo0i44NaIysynQVSGOfCG+DlADgUC3xGkHLvqZ2WYO3nxauDgzQCl2Cd+VYbtmOaFy/sXoBxb8qMyzHHeM83x6f2BBzmEUvT+XivTghfAcgJoln+Ai/vR/9XpF/dcmXwnPHOc5YGc+ELwAVbk9/2oTBM858G7ATL86cAD0FX5Sz8q44ELTXiW4UGXwl8EH6AYrfhVGbYD7pkDTYdvBgqPLAnTovx44NQ7dhlhC4ZwDlnhHM0JW/0qwxrwS5xrusQ9ds4RXICC9PoT19+8RGle/BoFofmnBkw5RrP8ZzQj/N0JzzXhWdpxGEiFXwsuQFH+cNf11xAzMISXB74/Kx6lGe6nXviw51QYSE6dDywAXZa+7QtuSpsw+d2fVduDpLk5mubudsM7pouhb4ILUJDudj6nin/SvDT/NL1FhRxGeuo8TYfve/AhsGQINDl1JxB4t8dmhDnw1JAoNcUF5Pk9/8aJn/kETU0t0GSIugFuhBh+JDF/qNtPtKgJ1BBvU1PKYTly3PfjJ589Tm9M5eji4V/wA+H9Pv5EE/1f9S9M4cKBWKiMUAAAAABJRU5ErkJggg==" />
                    <img className='h-10 w-10' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEJ0lEQVR4nO2ZvW8bdRzGf1Q09r357MT3YikTZSgIwdAWCZA6MYBQ/oIKykCHDlUZujcUlQ2pVMAYJFQQUgckhKCxHb/cxU7sOunZvoiKdkCZUFGGVlS0gd/vQXcXv9upae4SG/mRnsny3ef5+vHd92xCJppoosAEW3sVdf0EGUfB0lTY2kPXlqaScRPq2jxsHag71ubJOAm/Ph+Crf+OuubAAzX1HoqzHBkXwU6cacHvuKp+QMZBAHkGNXWjCV5THXjAUm87r5FRF6r6221Tb8ADluL4LTLqQk1L9YW/pQDr8UUyyoKlvQRLZX3hvQDAuvIKGVXBUr/qqkwXfByozCyQkb1xWcpfPVNvh19zAkw/QiWeIKMmWMrH/SvTBr8243wCji+RURKKsxys+B994RvgLXjg5vQWLE04uOu8reioxY/B0uZgKWdhKdcGVqYd3IP3XJ6+hlLsLMrROazKx1BSdF/uE6grR7Chn4SdOIW6fgE1/Qpq6nVUtQKq6iaq6vbuV5kB8A1wDx4ox4CSZ7YadU1Xotu0KG/SFblAi5HrtBi5goJ0AcuRUyiIJ2HKz+0Ov5H4yF3AWktY9zrQfWMatjKd4H3g2UrDMlhxx4WI5+WGJcAQLw4OYOunUddZE757Heg39eEr0wHeCy+3wHvgJTBTAjUkBlN67wkV0t9FXdvumXoAlWH94Bvg3fCm9A8M8cxw34Oa+iaq2oNRqAxzJy8+RF56Zyj4Zoh1/QSqyr2DrAzz4LdgiG/8J/hWnZQjsOJ3DqIyzIHPi78hKx59KvhmCOf6vB6/5U9l5KEqwzx4G1ludk/wzRC2ImItntyPyjAXXsghFZN9ge94zq3MfBdkZZghOvDfo0i44NaIysynQVSGOfCG+DlADgUC3xGkHLvqZ2WYO3nxauDgzQCl2Cd+VYbtmOaFy/sXoBxb8qMyzHHeM83x6f2BBzmEUvT+XivTghfAcgJoln+Ai/vR/9XpF/dcmXwnPHOc5YGc+ELwAVbk9/2oTBM858G7ATL86cAD0FX5Sz8q44ELTXiW4UGXwl8EH6AYrfhVGbYD7pkDTYdvBgqPLAnTovx44NQ7dhlhC4ZwDlnhHM0JW/0qwxrwS5xrusQ9ds4RXICC9PoT19+8RGle/BoFofmnBkw5RrP8ZzQj/N0JzzXhWdpxGEiFXwsuQFH+cNf11xAzMISXB74/Kx6lGe6nXviw51QYSE6dDywAXZa+7QtuSpsw+d2fVduDpLk5mubudsM7pouhb4ILUJDudj6nin/SvDT/NL1FhRxGeuo8TYfve/AhsGQINDl1JxB4t8dmhDnw1JAoNcUF5Pk9/8aJn/kETU0t0GSIugFuhBh+JDF/qNtPtKgJ1BBvU1PKYTly3PfjJ589Tm9M5eji4V/wA+H9Pv5EE/1f9S9M4cKBWKiMUAAAAABJRU5ErkJggg==" />
                    <img className='h-10 w-10' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEJ0lEQVR4nO2ZvW8bdRzGf1Q09r357MT3YikTZSgIwdAWCZA6MYBQ/oIKykCHDlUZujcUlQ2pVMAYJFQQUgckhKCxHb/cxU7sOunZvoiKdkCZUFGGVlS0gd/vQXcXv9upae4SG/mRnsny3ef5+vHd92xCJppoosAEW3sVdf0EGUfB0lTY2kPXlqaScRPq2jxsHag71ubJOAm/Ph+Crf+OuubAAzX1HoqzHBkXwU6cacHvuKp+QMZBAHkGNXWjCV5THXjAUm87r5FRF6r6221Tb8ADluL4LTLqQk1L9YW/pQDr8UUyyoKlvQRLZX3hvQDAuvIKGVXBUr/qqkwXfByozCyQkb1xWcpfPVNvh19zAkw/QiWeIKMmWMrH/SvTBr8243wCji+RURKKsxys+B994RvgLXjg5vQWLE04uOu8reioxY/B0uZgKWdhKdcGVqYd3IP3XJ6+hlLsLMrROazKx1BSdF/uE6grR7Chn4SdOIW6fgE1/Qpq6nVUtQKq6iaq6vbuV5kB8A1wDx4ox4CSZ7YadU1Xotu0KG/SFblAi5HrtBi5goJ0AcuRUyiIJ2HKz+0Ov5H4yF3AWktY9zrQfWMatjKd4H3g2UrDMlhxx4WI5+WGJcAQLw4OYOunUddZE757Heg39eEr0wHeCy+3wHvgJTBTAjUkBlN67wkV0t9FXdvumXoAlWH94Bvg3fCm9A8M8cxw34Oa+iaq2oNRqAxzJy8+RF56Zyj4Zoh1/QSqyr2DrAzz4LdgiG/8J/hWnZQjsOJ3DqIyzIHPi78hKx59KvhmCOf6vB6/5U9l5KEqwzx4G1ludk/wzRC2ImItntyPyjAXXsghFZN9ge94zq3MfBdkZZghOvDfo0i44NaIysynQVSGOfCG+DlADgUC3xGkHLvqZ2WYO3nxauDgzQCl2Cd+VYbtmOaFy/sXoBxb8qMyzHHeM83x6f2BBzmEUvT+XivTghfAcgJoln+Ai/vR/9XpF/dcmXwnPHOc5YGc+ELwAVbk9/2oTBM858G7ATL86cAD0FX5Sz8q44ELTXiW4UGXwl8EH6AYrfhVGbYD7pkDTYdvBgqPLAnTovx44NQ7dhlhC4ZwDlnhHM0JW/0qwxrwS5xrusQ9ds4RXICC9PoT19+8RGle/BoFofmnBkw5RrP8ZzQj/N0JzzXhWdpxGEiFXwsuQFH+cNf11xAzMISXB74/Kx6lGe6nXviw51QYSE6dDywAXZa+7QtuSpsw+d2fVduDpLk5mubudsM7pouhb4ILUJDudj6nin/SvDT/NL1FhRxGeuo8TYfve/AhsGQINDl1JxB4t8dmhDnw1JAoNcUF5Pk9/8aJn/kETU0t0GSIugFuhBh+JDF/qNtPtKgJ1BBvU1PKYTly3PfjJ589Tm9M5eji4V/wA+H9Pv5EE/1f9S9M4cKBWKiMUAAAAABJRU5ErkJggg==" />
                    <img className='h-10 w-10' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADxElEQVR4nO1Z3UtUQRQf+zLCIhKih0AKvXPuVmotUmZpUVAPgtCbUI/1H2RvUUjoS5CQD+FDUFL5kRQZlhUWld4zu+GLWPhgPfVgWpYVfXpi5uqy997ZdT+8tgt7YF72zvzO7zdz58xv7jKWi1zkwrcgATWysWwNEvCEBH/MsjEIoZIEkGqWuZ9lW5DgDyMCBDxg2RQUNndHkbdbyKhi2RKE/L5HgOC9LBuCwrCLEGa9AmQzKlimByHc1ZMHIoQ7LJODMFAee/aVgFmyIMgyNQj5bSdh/pQEf+YS0c0yMQjNbYTw10nWPETCPOxZhSGjlGVakIAOV9UZjDxDeO5amVssk4KGSkzv7PMjkedoHHWtguy7/f+QRSgkC/aQME+QgEZCfpMEjLsIomYcujb1+NzYRoUlMREKF4fkcNl6WbPJgnoScJYEtNsE+FTMCuMUUKsRUJvQWMGn5sS2q9yKg1EhOSUyuxcIYSKxRDEJDBOxPA82sTz1LB1shAnJMbaAcHANIe9PPQF/TyGjLiZ+yKhTfVLH75cc46/CQNFq6VtigPwhAW+lxyeEK2SZDSTgGFklZTQSKFhwiedzjAQK1Bghx5oNCktiKmyVQ7eyvZJboglWeQ4lG+Sjn36G7JP8gybvPRorzk8OrJMtJ4TrmmX8JO2yLyZQ8EnN7HdQOLgyNVApQsBVzWaalmVv0chbENRWOOQ3aKBmRXrgsnogv6wB/0ohfiBt8iGjigR81rw2bURsWbr40SJaNSJmCM3qlHHRrFYYXtxWXSlOX4TgFzXJvpHFDyaNFzb2kYAvS0LekVjwJs1G60seB/o0r02TP6zdyeXmciZuThpD8Gb3hvWHrS45QpcjuQX1SWPYPouiKluXP2x1yRHeOJKH+Y6kMYaMUpeA1/6w1VqN6OOe/451ShKCIZv22VhxvhobbVMStQppH/fOzTfq6WMVb1Z1XBFUrU3+5uknYNS5CoFy/wXYFxntu0uDgQ1zm/O7pjz+VKbt5daNkf4I3c5+xvElEOCpHudsGw5nlE9a2BLPKIwXfC0hP7/kZdRrtXlPSh5fjeE9bsvsvwDk7xIjKZ0lPz3XJhMU9c5f8lbxurhf3uZNnnxFou6w6gKjXjGYjj8WZmUO/wQIvjcOcXuTYmBT3C8asTa5iIio9FEAnNIQ/0XIr5FlbEkYR5VZaCGEHxoBJ/0U0OL6ONVJQ2ZJynivzCL7Phx1MCJcWlzWnj/t1Kw/ImHuXDRcKxBQk6H2l49/CioX6sN92PHX1FK60lzkgmV//AM7f1WAktwY2AAAAABJRU5ErkJggg==" />
                  </div>}
                <input type='button' style={{ cursor: 'pointer' }}
                  onClick={() => handleContactNow(item.price, item.area, item.description, item.type, item.url1, item.title)}
                  value="Contact Now" className='bg-black w-full text-white mt-3 text-xl p-2' />
              </div>
            );
          }) : <div className="flex justify-center items-center h-[80%]">
            {property ? <span className='text-black text-large text-[#636363] gap-4 flex items-center'><TbFaceIdError size={40} /> No Porperty Found</span> : <Oval
              height={80}
              width={80}
              color="#4fa94d"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel='oval-loading'
              secondaryColor="#4fa94d"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />}
          </div>}
        </div>
      </div >
    )
  )
}
