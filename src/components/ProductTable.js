import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, IconButton, MenuItem, Select } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import Typography from "@mui/material/Typography";

function ProductTable({ tags, supabase, brandName }) {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    quantity: '',
    price: ''
  });

  // useEffect(() => {
  //   const selectedTags = newProduct.tags.split(',');
  //   const filteredTags = selectedTags.filter(tag => tags.includes(tag));
  //   if (filteredTags.length !== selectedTags.length) {
  //     setNewProduct(prevProduct => ({
  //       ...prevProduct,
  //       tags: filteredTags.join(',')
  //     }));
  //   }

  // }, [tags, newProduct.tags]);
  const fetchData = async () => {
    try {
      // Fetch data from 'products' table
      const { data, error } = await supabase
        .from(brandName) // replace 'products' with your table name
        .select('*'); // fetch all columns

      if (error) {
        console.error('Error fetching products:', error.message);
      } else {
        setProducts(data);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  }

  useEffect(() => {
    fetchData()
  }, [brandName])

  const handleAddProduct = async () => {

    if (!newProduct.name || !newProduct.price) return;

    // Insert the new product into the Supabase database
    const { data, error } = await supabase.from(brandName).insert([{
      name: newProduct.name,
      quantity: newProduct.quantity,
      price: newProduct.price,
    }]);

    if (error) {
      console.error('Error adding product:', error.message);
    } else {
      // If the insert was successful, add the product to the local state
      console.log(data)
      setProducts([...products, newProduct]);
      setNewProduct({ name: '', image: '', tags: '', price: '' });
    }
  };
  const handleRemoveProduct = async (id) => {
    const { error } = await supabase
      .from(brandName) // Replace 'products' with your actual table name
      .delete()
      .eq('id', id); // Deleting where the id matches

    if (error) {
      console.error('Error deleting product:', error);
    } else {
      console.log('Product deleted successfully');
      setProducts(products.filter((product) => product.id !== id)); // Update state after deletion
    }
  };


  const handleTagChange = (event) => {
    setNewProduct({
      ...newProduct,
      tags: event.target.value.join(','),
    });
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Product Table
      </Typography>
      <div style={{ marginBottom: '20px', display: 'flex' }}>
        <TextField
          label="Product Name"
          size="small"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          style={{ marginRight: '10px' }}
        />
        <TextField
          size="small"
          label="Quantity"
          type="number"
          value={newProduct.quantity}
          onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
          style={{ marginRight: '10px' }}
        />
        {/* <TextField
          label="Image URL"
          size="small"
          value={newProduct.image}
          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
          style={{ marginRight: '10px' }}
        /> */}
        {/* <Select
          multiple
          size="small"
          value={newProduct.tags.split(',')}
          onChange={handleTagChange}
          renderValue={(selected) => selected.join(', ')}
          style={{ marginRight: '10px', minWidth: '100px' }}
        >
          {tags.map((tag) => (
            <MenuItem key={tag} value={tag}>
              {tag}
            </MenuItem>
          ))}
        </Select> */}
        <TextField
          size="small"
          label="Price"
          type="number"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          style={{ marginRight: '10px' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddProduct}
          startIcon={<Add />}
        >
          Add Product
        </Button>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              {/* <TableCell>Image</TableCell> */}
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                {/* <TableCell><img src={product.image} alt={product.name} style={{ width: '100px' }} /></TableCell> */}
                <TableCell>{product.quantity}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleRemoveProduct(product.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ProductTable;
