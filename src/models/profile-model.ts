type ProfileModel = {
  id: string;
  name: string;
  gender: string;
  bio?: string;
  avatar_url?: string;
  date_of_birth: Date;
  user_id: string;
};

export default ProfileModel;
