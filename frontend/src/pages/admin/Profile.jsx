import { useState, useContext } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";

function AdminProfile() {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState({ ...user });

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile({ ...profile, photoUrl: reader.result });
                // TODO: Add backend API call to persist the uploaded photo
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <DashboardLayout>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-8 max-w-3xl animate-fadeIn mt-6 mx-auto">
                <div className="flex items-center gap-6 mb-8 border-b dark:border-slate-700 pb-6">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-700 border-4 border-white dark:border-slate-800 shadow-md overflow-hidden flex items-center justify-center">
                            {profile?.photoUrl ? (
                                <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl text-slate-400 dark:text-slate-500 font-bold">
                                    {profile?.name?.charAt(0) || 'U'}
                                </span>
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full cursor-pointer shadow-md hover:bg-indigo-700 transition" title="Upload Photo">
                            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </label>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
                            Administrator Information
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your profile details and picture</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700 dark:text-slate-300">
                    <ProfileItem label="Full Name" value={profile?.name} />
                    <ProfileItem label="Email Address" value={profile?.email} />
                    <ProfileItem label="Role" value="Administrator" />
                    <ProfileItem label="Account Status" value="Active" success={true} />
                </div>
            </div>
        </DashboardLayout>
    );
}

function ProfileItem({ label, value, success }) {
    return (
        <div className="flex flex-col">
            <p className="text-sm font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</p>
            <p className={`text-lg font-semibold mt-1 ${success === true ? "text-green-600 dark:text-green-400" : success === false ? "text-red-500 dark:text-red-400" : "text-slate-800 dark:text-slate-200"}`}>
                {value || "-"}
            </p>
        </div>
    );
}

export default AdminProfile;
