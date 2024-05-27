import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadAvatar from '../components/Profile/UploadAvatar';
import UpdateUser from '../components/Profile/UpdateUser';
import DeleteUser from '../components/Profile/DeleteUser';
import LogoutButton from '../components/Profile/LogoutButton';
import '../Styles/Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:3001/auth/profile', {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          console.error('Error al obtener el perfil del usuario');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleAvatarClick = () => {
    document.getElementById('avatarInput').click();
  };

  if (!profile) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <div className="profile-container">
      <UploadAvatar onUpload={newAvatar => setProfile({ ...profile, avatar: newAvatar })} />
      {profile.avatar && (
        <img
          src={`http://localhost:3001/${profile.avatar}`}
          alt="Avatar"
          className="profile-avatar"
          onClick={handleAvatarClick}
          style={{ cursor: 'pointer' }}
        />
      )}
      <h2>{profile.username}</h2>
      <UpdateUser onUpdate={newUsername => setProfile({ ...profile, username: newUsername })} />
      <LogoutButton />
      <DeleteUser onDelete={() => navigate('/')} />
    </div>
  );
};

export default Profile;
