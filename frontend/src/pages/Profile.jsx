import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../redux/profileSlice";
import { uploadProfileImage, updateProfile } from "../api/userApi";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading } = useSelector((state) => state.profile);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const token = localStorage.getItem("token");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const previewUrl = URL.createObjectURL(selectedFile);
    setPreview(previewUrl);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      await uploadProfileImage(file, token);
      await dispatch(fetchProfile(token));

      setFile(null);
      setPreview(null);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreview(null);
  };

  // START EDIT
  const handleEdit = () => {
    setName(user.name);
    setEmail(user.email);
    setEditMode(true);
  };

  // SAVE PROFILE
  const handleSave = async () => {
    try {
      await updateProfile({ name, email }, token);

      await dispatch(fetchProfile(token));

      setEditMode(false);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-lg rounded-lg p-8 text-center w-full max-w-md">

        <h1 className="text-2xl font-bold mb-6">Profile Page</h1>

        {user && (
          <>
            {/* Profile Image */}
            <label htmlFor="fileInput" className="cursor-pointer flex justify-center">
              <img
                src={
                  preview
                    ? preview
                    : user?.profileImage
                    ? `http://localhost:5000/uploads/${user.profileImage}`
                    : "https://dummyimage.com/150x150/cccccc/000000&text=Profile"
                }
                alt="profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-gray-300 hover:opacity-80 transition"
              />
            </label>

            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {file && (
              <div className="mt-4 flex justify-center gap-3">
                <button
                  onClick={handleUpload}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  Save Photo
                </button>

                <button
                  onClick={handleCancel}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* PROFILE INFO */}
            {!editMode ? (
              <>
                <h2 className="text-xl font-semibold mt-6">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>

                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={handleEdit}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Edit Profile
                  </button>

                  <button
                    onClick={() => navigate("/home")}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Back to Home
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-3 mt-6">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded-md"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded-md"
                  />
                </div>

                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </>
        )}

      </div>

    </div>
  );
};

export default Profile;