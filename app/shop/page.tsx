"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import { styles } from "../styles/style";
import ItemCard from "../components/Shop/ItemCard";
import Footer from "../components/Footer";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

interface ShopItem {
  _id: string;
  name: string;
  description: string;
  image: { url: string };
  price: number;
  categories: string;
  nameColor?: string;
}

const Page = () => {
  const searchParams = useSearchParams();
  const search = searchParams?.get("title") || "";
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(5);
  const [items, setItems] = useState<ShopItem[]>([]);
  const [category, setCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const { data: userData } = useLoadUserQuery(undefined, {});
  const [showWarning, setShowWarning] = useState(false);

  const triggerWarning = () => {
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 4000);
  };

  const allItems: ShopItem[] = [
    {
      _id: "1",
      name: "Golden Name",
      description: "Let your name be shown in style, GOLD STYLE!",
      nameColor: "#FFD700",
      image: {
        url: "https://res.cloudinary.com/dnjmeyptn/image/upload/v1745143354/goldenName_y24rnu.png",
      },
      price: 100,
      categories: "Name Colours",
    },
    {
      _id: "2",
      name: "Java Badge",
      description: "Display your love towards java, now on your profile!",
      image: {
        url: "https://res.cloudinary.com/dnjmeyptn/image/upload/v1745143355/javaBadge_fgkykb.png",
      },
      price: 12000,
      categories: "Badges",
    },
    {
      _id: "3",
      name: "Ducky Emoji Pack",
      description: "Now use Ducky emojis in reviews, Q/A and more!",
      image: {
        url: "https://res.cloudinary.com/dnjmeyptn/image/upload/v1745143365/WhatsApp_Image_2025-04-20_at_13.56.24_c452263b_djjjv7.jpg",
      },
      price: 210888,
      categories: "Emojis",
    },
    {
      _id: "4",
      name: "Dragon Emoji Pack",
      description: "Now use Dragon emojis in reviews, Q/A and more!",
      image: {
        url: "https://res.cloudinary.com/dnjmeyptn/image/upload/v1745143365/WhatsApp_Image_2025-04-20_at_14.01.48_b6a7324b_egcvzb.jpg",
      },
      price: 510888,
      categories: "Emojis",
    },
    {
      _id: "5",
      name: "King Badge",
      description: "You are a King and you shall show it!",
      image: {
        url: "https://res.cloudinary.com/dnjmeyptn/image/upload/v1745143365/WhatsApp_Image_2025-04-20_at_14.06.56_9acafaca_t3znao.jpg",
      },
      price: 1000000,
      categories: "Badges",
    },
    {
      _id: "6",
      name: "S Grade Badge",
      description:
        "Flex your S-Grade watch-time performance, Limited time only!",
      image: {
        url: "https://res.cloudinary.com/dnjmeyptn/image/upload/v1745143364/WhatsApp_Image_2025-04-20_at_14.12.59_c11d080f_yy7ac6.jpg",
      },
      price: 580000,
      categories: "Badges",
    },
    {
      _id: "7",
      name: "VIP Badge",
      description: "You have truly proven that you are IMPORTANT!",
      image: {
        url: "https://res.cloudinary.com/dnjmeyptn/image/upload/v1745143364/WhatsApp_Image_2025-04-20_at_14.07.07_739e3fe9_aiyvyv.jpg",
      },
      price: 5800000,
      categories: "Badges",
    },
    {
      _id: "8",
      name: "Lime Name",
      description: "Let your name be shown in style, LIME STYLE!",
      nameColor: "#00FF00",
      image: {
        url: "https://res.cloudinary.com/dnjmeyptn/image/upload/v1745144936/lime_name-removebg-preview_y81wtz.png",
      },
      price: 100,
      categories: "Name Colours",
    },
    // Add more items as needed
  ];

  const categories = [
    { title: "All" },
    { title: "Badges" },
    { title: "Name Colours" },
    { title: "Emojis" },
  ];

  useEffect(() => {
    setIsLoading(true);
    console.log(userData);
    const timer = setTimeout(() => {
      let filteredItems = [...allItems];

      if (category !== "All") {
        filteredItems = filteredItems.filter(
          (item) => item.categories === category
        );
      }

      if (search) {
        filteredItems = filteredItems.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      setItems(filteredItems);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [category, search]);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={5}
          />
          {showWarning && (
            <div className="w-full bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-md my-4 flex items-center justify-center font-medium">
              ⚠️ You need to be logged in to buy an item.
            </div>
          )}
          <div className="w-[95%] 800px:w-[85%] m-auto min-h-[70vh]">
            <Heading
              title="Shop - Earn and Spend Watchtime Points"
              description="Browse our exclusive items available for Watchtime Points"
              keywords="shop, watchtime points, rewards, badges, emojis, themes"
            />
            <br />
            {/* Categories and Currency Shower */}
            <div className="w-full flex items-center justify-between">
              <div className="flex flex-wrap">
                {categories.map((cat, index) => (
                  <div
                    key={index}
                    className={`h-[35px] ${
                      category === cat.title ? "bg-[crimson]" : "bg-[#5050cb]"
                    } m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer text-white`}
                    onClick={() => setCategory(cat.title)}
                  >
                    {cat.title}
                  </div>
                ))}
              </div>

              {/* Currency Shower */}
              <div className="bg-[#333333] text-[#FFD700] px-4 py-2 rounded-full shadow-lg font-semibold">
                {userData?.user?.watchTime ? (
                  <span>{userData.user.watchTime} 🪙</span>
                ) : (
                  <span>0 🪙</span>
                )}
              </div>
            </div>

            {items.length === 0 && (
              <p
                className={`${styles.label} justify-center min-h-[50vh] flex items-center`}
              >
                {search
                  ? "No items found!"
                  : "No items found in this category. Please try another one!"}
              </p>
            )}
            <br />
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12">
              {items.map((item, index) => (
                <ItemCard
                  key={item._id || index}
                  item={item}
                  user={userData?.user}
                  onUnauthenticatedClick={triggerWarning}
                />
              ))}
            </div>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Page;
