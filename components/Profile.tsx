
import React, { useState } from 'react';
import { UserProfile } from '../types';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';

interface ProfileProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, setProfile }) => {
  const [formState, setFormState] = useState<UserProfile>(profile);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formState);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        {!isEditing && <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>}
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" type="text" name="name" value={formState.name} onChange={handleChange} disabled={!isEditing} />
          <Input label="Last Menstrual Period (LMP)" type="date" name="lastMenstrualPeriod" value={formState.lastMenstrualPeriod} onChange={handleChange} disabled={!isEditing} />
          <Input label="Estimated Due Date" type="date" name="dueDate" value={formState.dueDate} onChange={handleChange} disabled={!isEditing} />
          
          {isEditing && (
            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" onClick={() => { setIsEditing(false); setFormState(profile); }} variant="secondary">Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};

export default Profile;
