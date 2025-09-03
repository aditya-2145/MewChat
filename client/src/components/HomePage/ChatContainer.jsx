import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../../assets/assets";
import { formatMessageTime } from "../../lib/utils";
import { ChatContext } from "../../../context/ChatContext";
import { AuthContext } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState("");
  const listRef = useRef(null);
  const endRef = useRef(null);

  const scrollToBottom = () => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth" });
    if (listRef.current)
      listRef.current.scrollTop = listRef.current.scrollHeight;
  };

  // send text message
  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (input.trim() === "") return;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  // send image message
  const handleSendingImage = async (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select a valid image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      event.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  // fetch messages when selecting a user
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id); // ✅ now correct
    }
  }, [selectedUser]);

  // scroll to bottom when chat is opened
  useEffect(() => {
    if (!selectedUser) return;
    const id = requestAnimationFrame(scrollToBottom);
    return () => cancelAnimationFrame(id);
  }, [selectedUser]);

  // scroll to bottom when messages update
  useEffect(() => {
    if (!selectedUser) return;
    scrollToBottom();
  }, [messages.length, selectedUser]);

  return selectedUser ? (
    <div className="h-full relative backdrop-blur-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="currentPP"
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          )}
        </p>
        <img
          src={assets.arrow_icon}
          alt="back"
          className="md:hidden w-7 cursor-pointer"
          onClick={() => setSelectedUser(null)}
        />
        <img src={assets.help_icon} alt="help" className="max-md:hidden w-5" />
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        className="flex flex-col h-[calc(100%-120px)] overflow-y-auto p-3 pb-6 scroll-smooth"
      >
        {messages.map((msg, index) => {
          const isOwnMessage = msg.senderId === authUser._id;
          return (
            <div
              key={index}
              className={`flex items-end gap-2 mb-2 ${
                isOwnMessage ? "justify-end" : "justify-start"
              }`}
            >
              {msg.image ? (
                <img
                  src={msg.image}
                  alt=""
                  className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden"
                  onLoad={scrollToBottom}
                />
              ) : (
                <p
                  className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg break-all text-white ${
                    isOwnMessage
                      ? "bg-[#4DA169]/50 rounded-br-none"
                      : "bg-gray-700/50 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </p>
              )}
              <div className="text-center text-xs">
                <img
                  src={
                    isOwnMessage
                      ? authUser?.profilePic || assets.avatar_icon
                      : selectedUser?.profilePic || assets.avatar_icon
                  }
                  alt=""
                  className="w-7 rounded-full"
                />
                <p className="text-white/50">
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input
            onChange={(event) => setInput(event.target.value)}
            value={input}
            onKeyDown={(event) =>
              event.key === "Enter" ? handleSendMessage(event) : null
            }
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"
          />
          <input
            onChange={handleSendingImage}
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt="upload"
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>
        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt="send"
          className="w-7 cursor-pointer"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} alt="logo" className="max-w-35" />
      <p className="text-lg font-medium text-white">Chat Anytime Anywhere</p>
    </div>
  );
};

export default ChatContainer;
