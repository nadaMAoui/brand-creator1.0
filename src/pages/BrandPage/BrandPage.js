import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Drawer, List, ListItem, ListItemText, Divider, Typography, Chip, TextField, Button } from "@mui/material";
import ProductTable from "../../components/ProductTable";

function BrandPage({ supabase }) {
  // Extracts the brand name from URL parameters
  const { brandName } = useParams();
  // Gets any additional state passed from the previous route using useLocation
  const { state } = useLocation();
  /*const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");*/

  /*const handleAddTag = ({ supabase }) => {
    if (newTag.trim() && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    } 
  };*/
// useEffect hook runs once after component mounts
  useEffect(() => {
    createDynamicTable(brandName)
  }, []);

  //Create a sql function in supabase
  //Alter the role to public for the entire schema
  async function createDynamicTable(tableName) {
    const { data, error } = await supabase.rpc('createbrandtable', {
      table_name: tableName,  // Pass dynamic table name here
    });
    if (error) {
      console.error('Error creating table:', error);
    } else {
      console.log(`Table '${tableName}' created successfully or already exists.`);
    }
  }


  /*const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };*/

  return (
    <div style={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box", marginTop: "64px" },
        }}
      >
        <Typography variant="h6" sx={{ padding: 2 }}>
          Brand Details
        </Typography>
        <Divider />
        <List>
          <ListItem>
            <ListItemText primary="Brand Name" secondary={brandName} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Description" secondary={state?.description || "No description"} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Category" secondary={state?.category || "No category"} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Contact Email" secondary={state?.contactEmail || "No contact email"} />
          </ListItem>
        </List>
        <Button
          variant="contained"
          color="primary"
        >
          Publish
        </Button>
      </Drawer>

      <div style={{ flexGrow: 1, padding: "24px" }}>
        {/* <section>
          <Typography variant="h5" gutterBottom>
            Tags
          </Typography>
          <div style={{ marginBottom: "16px" }}>
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleDeleteTag(tag)}
                style={{ margin: "0 8px 8px 0" }}
              />
            ))}
          </div>
          <TextField
            label="New Tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            variant="outlined"
            size="small"
            style={{ marginRight: "8px" }}
          />
          <Button variant="contained" color="primary" onClick={handleAddTag}>
            Add Tag
          </Button>
        </section> */}

        <section style={{ marginTop: "24px" }}>
          <ProductTable tags={[]} supabase={supabase} brandName={brandName} />
        </section>
      </div>
    </div>
  );
}

export default BrandPage;
