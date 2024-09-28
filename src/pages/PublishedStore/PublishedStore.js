import React, { useState, useEffect } from 'react';
import {
    Card, CardContent, CardActions, Button, Grid, Typography, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle, TextField
} from '@mui/material';
import { useParams } from 'react-router-dom';

const PublishedStore = ({ supabase }) => { // Functional component named PublishedStore
    // Access the brand name from URL parameters
    const { brandName } = useParams();
    //state variables
    const [open, setOpen] = useState(false);  // Controls dialog visibility (open/closed)
    const [selectedProduct, setSelectedProduct] = useState(null); // Stores the selected product for ordering
    const [products, setProducts] = useState([]); // Stores the list of products from the brand
    const [formData, setFormData] = useState({  // Stores user information for the order
        name: '',
        surname: '',
        phone: '',
        quantity: 1,
        address: ''
    });
    // Function to fetch products from the Supabase database
    const fetchProducts = async () => {
        const { data, error } = await supabase // Makes a call to Supabase
          .from(brandName) // Specifies the table to query (based on brand name)
          .select('*'); // Selects all columns from the table (customize as needed)

    
        if (error) {
          console.error("Error fetching products: ", error); // Logs error if fetching fails
        } else {
            console.log(data) // Logs fetched data to console
            setProducts(data); // Updates the products state with fetched data
        }
      };
      // Function to create an order table for the specific brand (if it doesn't exist)
      const createOrderTable =async () => {
        const { data, error } = await supabase.rpc('createordertable', { // Calls a Supabase RPC function
            table_name: "orders_" + brandName,  // Pass dynamic table name here
          });
          if (error) {
            console.error('Error creating table:', error); // Logs error on table creation failure
          } else {
            console.log(`Table '${brandName}' created successfully or already exists.`); // Success message
          }
      }
    // Fetches products and creates order table on component mount
      useEffect(() => {
        createOrderTable();
        fetchProducts();
      }, []); // Empty dependency array ensures this runs only once on mount
    
     // Opens the dialog when the "Command" button is clicked for a product
    const handleOpen = (product) => {
        setSelectedProduct(product); // Sets the selected product for ordering
        setOpen(true); // Opens the order details dialog
    };

    // Closes the order details dialog
    const handleClose = () => {
        setOpen(false); // Sets dialog visibility to closed
    };

     // Handles changes in the order form fields
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value }); // Updates form data based on input changes
        console.log(selectedProduct) //Logs the selected product for debugging
    };

    // Handles form submission for order creation
    const handleSubmit = async () => {
        const { quantity } = formData; // Extracts the quantity from form data

        // Inserts a new order record into the "orders_"+brandName table
        const { error: orderError } = await supabase
            .from(`orders_${brandName}`)
            .insert({
                name: formData.name,
                surname: formData.surname,
                phone: formData.phone,
                quantity: formData.quantity,
                address: formData.address,
                id: selectedProduct.id, // Assuming brand_name is a foreign key in the orders table
            });

        if (orderError) {
            console.error('Error submitting order:', orderError); // Logs error on order submission failure
        } else {
            // Calculates the updated quantity for the product
            const updatedQuantity = selectedProduct.quantity - quantity;
            
            // Updates the product's quantity in the brandName table
            const { error: updateError } = await supabase
                .from(brandName)
                .update({ quantity: updatedQuantity })
                .eq('id', selectedProduct.id);

            if (updateError) {
                console.error('Error updating product quantity:', updateError);
            } else {
                // Re-fetch the products to reflect the updated quantity
                fetchProducts();
                console.log("Order submitted and product updated successfully.");
            }
        }

        // Clear form and close dialog
        setFormData({ name: '', surname: '', phone: '', quantity: 1, address: '' });
        setOpen(false);
    };

    return (
        <Grid container spacing={2} style={{ marginTop: '16px', marginLeft: "8px" }}>
            {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">{product.name}</Typography>
                            <Typography color="textSecondary">Price: {product.price}$</Typography>
                            <Typography color="textSecondary">Quantity: {product.quantity}</Typography>
                        </CardContent>
                        <CardActions>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={() => handleOpen(product)}
                            >
                                Command
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}

            {/* Dialog for entering user details */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Order {selectedProduct?.name}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your details to complete the order.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Name"
                        fullWidth
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="surname"
                        label="Surname"
                        fullWidth
                        value={formData.surname}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="phone"
                        label="Phone Number"
                        fullWidth
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="quantity"
                        label="Quantity"
                        type="number"
                        fullWidth
                        value={formData.quantity}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="address"
                        label="Address"
                        fullWidth
                        multiline
                        rows={2}
                        value={formData.address}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Submit Order
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

export default PublishedStore;
