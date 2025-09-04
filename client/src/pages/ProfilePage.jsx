import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null); // For cleaned-up preview URL
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);

  // ✅ Clean up object URL on unmount or when new file is selected
  useEffect(() => {
    if (!selectedImage) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedImage);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedImage) {
      await updateProfile({ fullName: name, bio });
      navigate("/");
      return;
    }
    const render = new FileReader();
    render.readAsDataURL(selectedImage);
    render.onload = async () => {
      const base64Image = render.result;
      await updateProfile({ profilePic: base64Image, fullName: name, bio });
      navigate("/");
    };
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        {/* ===== FORM SECTION ===== */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-10 flex-1"
        >
          <h3 className="text-lg">Profile Details</h3>

          {/* Name input */}
          <input
            onChange={(event) => setName(event.target.value)}
            value={name}
            type="text"
            required
            placeholder="Your Name"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Bio input */}
          <textarea
            placeholder="Update Bio"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={(event) => setBio(event.target.value)}
            value={bio}
          ></textarea>

          {/* Save button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-[#A5D9A0]/50 to-[#1C4D33] text-white p-2 rounded-full text-lg cursor-pointer"
          >
            Save
          </button>
        </form>

        {/* ===== AVATAR PREVIEW SECTION ===== */}
        <div className="flex flex-col items-center mx-10 max-sm:mt-10">
          <div className="w-44 h-44 max-sm:w-32 max-sm:h-32 rounded-full relative overflow-hidden group cursor-pointer">
            <img
              className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:brightness-[0.3] rounded-full"
              src={preview || authUser.profilePic || assets.logo_icon}
              alt="Profile Picture"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-500 ease-in-out"></div>

            {/* Edit Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out transform scale-90 group-hover:scale-100">
              <button
                onClick={() => document.getElementById("avatar").click()}
                aria-label="Edit profile picture"
                className="bg-green-600 text-white px-4 py-2 rounded-full font-medium shadow-lg hover:bg-green-700 transition-colors duration-200"
              >
                Edit
              </button>
            </div>
          </div>

          {/* File Upload Text */}
          <label htmlFor="avatar" className="mt-3 cursor-pointer">
            <input
              onChange={(event) => setSelectedImage(event.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <p className="text-sm text-gray-300 hover:text-white transition-colors duration-200">
              Upload Profile Image
            </p>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
