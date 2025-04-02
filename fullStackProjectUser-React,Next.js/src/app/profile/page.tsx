import AuthGuard from "@/components/Auth/AuthGuard";
import Profile from "@/components/Profile";

const ProfilePage = () => {
  return (
    <AuthGuard>
      <div>
        <Profile />
          </div>
    </AuthGuard>
  );
};

export default ProfilePage;
