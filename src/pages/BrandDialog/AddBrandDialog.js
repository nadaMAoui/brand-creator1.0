import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  FormHelperText,
} from "@mui/material";

function AddBrandDialog({ open, onClose, brand, supabase, user }) {
  // State variables for form fields and errors
  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState({});// Object to store form validation errors

// useEffect hook to update form fields based on the provided brand object
  useEffect(() => {
    if (brand) {
      setBrandName(brand.brandName || "");
      setDescription(brand.description || "");
      setContactEmail(brand.contactEmail || "");
      setCategory(brand.category || "");
    } else {
      setBrandName("");
      setDescription("");
      setContactEmail("");
      setCategory("");
    }
  }, [brand]);
// Function to handle form submission
  const handleSubmit = async () => {
    const formErrors = {
      brandName: !brandName ? "Brand Name is required" : "",
      contactEmail: !contactEmail ? "Contact Email is required" : "",
      category: !category ? "Category is required" : "",
    };

    const hasErrors = Object.values(formErrors).some((error) => error !== "");

    if (!hasErrors) {
      if (brand) {
        const { error } = await supabase
          .from("Brands")
          .update({
            brandName,
            description,
            contactEmail,
            category,
            updated_at: new Date().toISOString(),
            user
          })
          .eq("id", brand.id);

        if (error) {
          console.error(error);
        }
      } else {
        const { error } = await supabase
          .from("Brands")
          .insert({
            brandName,
            description,
            contactEmail,
            category,
            user,
            created_at: new Date().toISOString(),
          });

        if (error) {
          console.error(error);
        }
      }
      setBrandName("");
      setDescription("");
      setContactEmail("");
      setCategory("");
      onClose();
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{brand ? "Edit Brand" : "Create your brand"}</DialogTitle>
      <DialogContent>
        <TextField
          required
          autoFocus
          margin="dense"
          label="Brand Name"
          type="text"
          fullWidth
          value={brandName}
          error={!!errors.brandName}
          helperText={errors.brandName}
          onChange={(e) => setBrandName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          required
          margin="dense"
          label="Contact Email"
          type="email"
          fullWidth
          value={contactEmail}
          error={!!errors.contactEmail}
          helperText={errors.contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />
        <FormControl
          fullWidth
          margin="dense"
          required
          error={!!errors.category}
        >
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="Technology">Technology</MenuItem>
            <MenuItem value="Fashion">Fashion</MenuItem>
            <MenuItem value="Food">Food</MenuItem>
            <MenuItem value="Health">Health</MenuItem>
          </Select>
          {errors.category && (
            <FormHelperText>{errors.category}</FormHelperText>
          )}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddBrandDialog;
