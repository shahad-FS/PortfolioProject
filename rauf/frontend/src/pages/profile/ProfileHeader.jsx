export default function ProfileHeader({ profile, role }) {
  return (
    <div className="bg-white shadow-xl rounded-2xl p-8">
      <h1 className="text-2xl font-bold">{profile.full_name}</h1>
      <p className="text-gray-500">{role}</p>
    </div>
  );
}
