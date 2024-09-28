import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';

const Profile = ({ user, supabase }) => { // Functional component named Profile

// State variables to manage password fields
  const [newPassword, setNewPassword] = useState('');
  const [password, setPassword] = useState('');

 // Styling object for centering the authentication form
  const centerAuthStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    flexDirection: "column"
  };
// useEffect hook to potentially perform actions when the component mounts (currently just logs user data)
  useEffect(() => {
    console.log(user);
  }, [])

  return (
    <Card style={centerAuthStyle}>
      <CardHeader
        title="Profile Information"
        subheader={`Last sign-in: ${user.last_sign_in_at}`}
      />
      <CardContent>
      <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={user.email}
          sx={{ marginBottom: 2 }}
          disabled
        />

        <TextField
          label="Phone number"
          variant="outlined"
          fullWidth
          type='number'
          value={user.email}
          sx={{ marginBottom: 2 }}
          
        />  


      </CardContent>
    </Card>
  );
};
// Exports the Profile component for use in other parts of your application
export default Profile;