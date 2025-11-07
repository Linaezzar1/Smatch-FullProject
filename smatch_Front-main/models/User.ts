export interface User {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  address?: string;
  role?: 'user' | 'player' | 'coach' | 'organizer' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;

    birthDate?: string;
  position?: string;

  profilePicture?: string;

}
