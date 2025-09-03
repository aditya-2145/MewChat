import React, { useContext, useEffect, useState } from "react";
import assets from "../../assets/assets";
import { ChatContext } from "../../../context/ChatContext";
import { AuthContext } from "../../../context/AuthContext";

const RightSideBar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);

  // Fixed: Use useState correctly for component state
  const [messageImages, setMessageImages] = useState([]);

  // Get all images from messages and set them to state
  useEffect(() => {
    if (messages && messages.length > 0) {
      setMessageImages(
        messages.filter((msg) => msg.image).map((msg) => msg.image)
      );
    } else {
      setMessageImages([]);
    }
  }, [messages]);

  return (
    selectedUser && (
      <div
        className={`bg-[#8185B2]/10 text-white w-full relative overflow-scroll ${
          selectedUser ? "max-md:hidden" : ""
        }`}
      >
        <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt=""
            className="w-20 aspect-[1/1] rounded-full"
          />
          <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
            {onlineUsers.includes(selectedUser._id) && (
              <p className="w-2 h-2 rounded-full bg-green-500"></p>
            )}
            {selectedUser.fullName}
          </h1>
          <p className="px-10 mx-auto">{selectedUser.bio}</p>
        </div>

        <hr className="border-[#ffffff50] my-4" />

        <div className="px-5 text-xs">
          <p className="text-sm font-medium mb-2">Shared Images</p>
          {messageImages.length > 0 ? (
            <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
              {messageImages.map((url, index) => (
                <div
                  key={index}
                  onClick={() => window.open(url, "_blank")} // Added _blank for new tab
                  className="rounded cursor-pointer hover:opacity-100 transition-opacity"
                >
                  <img
                    src={url}
                    alt={`Shared image ${index + 1}`}
                    className="w-full h-20 object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">
              No images shared yet
            </p>
          )}
        </div>

        <button
          onClick={() => logout()}
          className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#A5D9A0]/50 to-[#1C4D33] text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer hover:from-[#A5D9A0]/70 hover:to-[#1C4D33]/90 transition-all"
        >
          Logout
        </button>
      </div>
    )
  );
};

export default RightSideBar;
