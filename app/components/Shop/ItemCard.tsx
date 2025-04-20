import Image from "next/image";
import React, { FC } from "react";
import { useUserColorUpdateMutation } from "@/redux/features/user/userApi";
import { useUpdateWatchTimeMutation } from "@/redux/features/user/userApi";

type Props = {
  item: any;
  user: any;
  onUnauthenticatedClick: () => void;
};

const ItemCard: FC<Props> = ({ item, user, onUnauthenticatedClick }) => {
  const [updateUserColor] = useUserColorUpdateMutation();
  const [updateWatchTime] = useUpdateWatchTimeMutation();

  const handleClick = () => {
    if (!user) {
      onUnauthenticatedClick();
      return;
    }

    if (user.watchTime < item.price) {
      alert("You don't have enough watch time points to buy this item.");
      return;
    }

    if (user.nameColor === item.nameColor) {
      alert("You already own this item.");
    }

    // Update name color
    updateUserColor({ nameColor: item.nameColor }); // Make sure to pass required payload format

    // Update watch time
    updateWatchTime({ watchTime: user.watchTime - item.price });

    alert(`You have successfully purchased ${item.name}!`);
  };

  return (
    <div className="w-full min-h-[35vh] dark:bg-slate-500 dark:bg-opacity-20 backdrop-blur border dark:border-[#ffffff1d] border-[#00000015] dark:shadow-[bg-slate-700] rounded-lg p-3 shadow-sm dark:shadow-inner">
      <div className="relative aspect-square w-full">
        <Image
          src={item.image.url}
          fill
          style={{ objectFit: "contain" }}
          className="rounded"
          alt={item.name}
        />
      </div>
      <br />
      <h1 className="font-Poppins text-[16px] text-black dark:text-[#fff]">
        {item.name}
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
        {item.description}
      </p>
      <div className="w-full flex items-center justify-between pt-3">
        <div className="flex items-center gap-2">
          <span className="text-black dark:text-[#fff] font-medium">
            {item.price} Watchtime Points
          </span>
        </div>
        <button
          onClick={handleClick}
          className="bg-[crimson] hover:bg-[crimson]/90 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
