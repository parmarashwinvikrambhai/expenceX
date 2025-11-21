import { useEffect, useState } from "react";
import axiosInstance from "../../services/apiClient";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

function Profile() {
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    profilePic: string;
    totalIncome: number;
    totalExpense: number;
    saving: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  
  const navigate = useNavigate();

  // Edit form states
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get("/auth/profile");
      setProfile(response.data);
    } catch (error) {
      console.error("Profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axiosInstance.post("/auth/profile-pic", formData, {
        withCredentials: true,
      });

      setProfile((prev) => {
        if (!prev) return null;
        return { ...prev, profilePic: res.data.user.profilePic };
      });
    } catch (err) {
      console.log("Upload Error:", err);
    }
  };
 

const handleUpdate = async () => {
    try {
      const res = await axiosInstance.put("/auth/edit-profile", {
        name: editName,
        email: editEmail,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setProfile((prev: any) => ({
        ...prev,
        name: res.data.user.name,
        email: res.data.user.email,
      }));

      setEditMode(false);
    } catch (err) {
      console.log("Update error:", err);
    }
  };
if (loading) {
  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-9999">
      <Loader size={50} className="animate-spin text-black" />
    </div>
  );
}

if (!profile) {
  return (
    <div className="text-center mt-20 text-xl font-semibold text-red-600 border rounded-xl p-3 w-[800px] m-auto">
      Failed to Load Profile
    </div>
  );
}


return (
    <div className="w-full flex justify-center px-4 py-10">
      
      <div
        className="
        w-full max-w-sm 
        rounded-xl 
        flex justify-center 
        items-center 
        text-white 
        p-6 
        sm:p-8
      "
        style={{ backgroundColor: "#3E4B54" }}
      >
        <div className="flex flex-col items-center gap-5 w-full">
          {/* VIEW MODE */}
          {!editMode && (
            <>
              {/* Profile Image */}
              <label className="relative cursor-pointer">
                <img
                  className="w-24 h-24 rounded-full object-cover border-2 border-white"
                  src={profile.profilePic}
                  alt="profile"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <span className="text-xl font-semibold">{profile.name}</span>
              <div className="text-sm opacity-90">{profile.email}</div>

              {/* Stats Section */}
              <div className="grid grid-cols-3 w-full text-center mt-4 gap-4">
                <div>
                  <p className="font-bold text-sm">Income</p>
                  <p className="text-sm">${profile.totalIncome}</p>
                </div>
                <div>
                  <p className="font-bold text-sm">Expense</p>
                  <p className="text-sm">${profile.totalExpense}</p>
                </div>
                <div>
                  <p className="font-bold text-sm">Saving</p>
                  <p className="text-sm">${profile.saving}</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3 mt-6 w-full justify-center">
                <button
                  className="border border-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700 transition"
                  onClick={() => {
                    setEditName(profile.name);
                    setEditEmail(profile.email);
                    setEditMode(true);
                  }}
                >
                  Edit Profile
                </button>

                <button
                  className="border border-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700 transition"
                  onClick={() => navigate("/change-password")}
                >
                  Change Password
                </button>
              </div>
            </>
          )}

          {editMode && (
            <>
              <h1 className="font-bold text-2xl">Edit your Details</h1>
              <div className="w-full flex flex-col items-center gap-4 mt-2">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="px-3 py-2 rounded-lg w-full border text-white"
                  placeholder="Enter name"
                />

                <input
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="px-3 py-2 rounded-lg w-full border  text-white"
                  placeholder="Enter email"
                />

                <div className="flex gap-3 w-full justify-center mt-2">
                  <button
                    onClick={handleUpdate}
                    className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm"
                  >
                    Update
                  </button>

                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

}

export default Profile;
