import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';

const AddCard = ({ onButtonClick }) => {
// Defines the AddCard component, which takes an onButtonClick prop to handle button clicks.
  let onClick = () => {
  // Defines the onClick handler function that calls the onButtonClick prop when the button is clicked.
    onButtonClick();
  }
  return (
    // Renders the card component with its header, actions, and button.
    <Card
    variant="elevation"
    elevation={12}
    sx={{
      maxWidth: 345,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
      borderRadius: "4px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
    }}
    >
        <CardHeader
        title="Add your brand"
        subheader="Use Our platform to create and manage your products"
      />
      <CardActions
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={ onClick }
        >
          Add your brand
        </Button>
      </CardActions>
    </Card>
  );
};
// Makes the AddCard component available for import in other files.
export default AddCard;
