import React from "react";
import Card from "@mui/material/Card";
import CardHeader from '@mui/material/CardHeader';
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import CardActions from '@mui/material/CardActions';

const BrandCard = ({ brandName, description, category, contactEmail, onEdit, onDelete }) => {
  // Defines the BrandCard component with its props.
  const navigate = useNavigate();
  //Gets a function to programmatically navigate to different routes within the application.

  const handleNavigate = () => {
    // Navigates to the design page for the brand.
    navigate(`/design/${brandName}`, {
      state: { brandName, description, category, contactEmail },
    });
  };

  return (
    <Card
    // Renders the card component with its header, actions, and button.
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
        title={brandName}
        subheader={description}
      />
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={onEdit}
        ></Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<DeleteIcon />}
          onClick={onDelete}
        ></Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleNavigate}
        >
          Go to Design
        </Button>
      </CardActions>
    </Card>
  );
};

export default BrandCard;
