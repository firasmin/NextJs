import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useSWR, { mutate } from 'swr';
const fetcher = (url) => fetch(url).then((res) => res.json());

const Home = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { data, error } = useSWR('/api/items', fetcher);


  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    price: Yup.number()
      .typeError('Price must be a number')
      .required('Price is required')
      .positive('Price must be positive'),
    stock: Yup.number()
      .typeError('Stock must be a number')
      .required('Stock is required')
      .min(0, 'Stock cannot be negative'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      stock: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const apiUrl = editMode ? `/api/items/${selectedItem.id}` : '/api/items';
      const method = editMode ? 'PUT' : 'POST';

      const response = await fetch(apiUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
       
        editMode? toast.info( 'Item update successfully!'):toast.success('Item added successfully');
        resetForm();
        setDialogOpen(false);
        setEditMode(false);
        setSelectedItem(null);
        mutate('/api/items')
      } else {
        if(response.status==409)
        {
          toast.error('stock already exist')
          setDialogOpen(false)
          resetForm();
        }
        else{
          toast.error('Something went wrong');
          resetForm();
        }
      }
    },
  });
  const handleCancle=async()=>{
    formik.resetForm()
    setDialogOpen(false)
  }

  const handleDelete = async (id) => {
    await fetch(`/api/items/${id}`, { method: 'DELETE' }).then(()=>{
      mutate('/api/items')
    });
    toast.success('Item deleted successfully!');
    
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    formik.setValues({ name: item.name, price: item.price, stock: item.stock });
    setEditMode(true);
    setDialogOpen(true);
  };

  return (
    <div style={{ height: 1000, width: '100%' }}>
      <Button variant="contained" onClick={() => setDialogOpen(true)}>
        Add Item
      </Button>
      <DataGrid
        rows={data}
        columns={[
          { field: 'id', headerName: 'ID', width: 70 },
          { field: 'name', headerName: 'Name', width: 130 },
          { field: 'price', headerName: 'Price', width: 130 },
          { field: 'stock', headerName: 'Stock', width: 130 },
          {
            field: 'actions',
            headerName: 'Actions',
            renderCell: (params) => (
              <>
                <Button onClick={() => handleEdit(params.row)}>Edit</Button>
                <Button onClick={() => handleDelete(params.row.id)}>Delete</Button>
              </>
            ),
            width: 300,
          },
        ]}
       
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{editMode ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              margin="dense"
              label="Name"
              name="name"
              fullWidth
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              margin="dense"
              label="Price"
              name="price"
              type="number"
              fullWidth
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
            />
            <TextField
              margin="dense"
              label="Stock"
              name="stock"
              type="number"
              fullWidth
              value={formik.values.stock}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.stock && Boolean(formik.errors.stock)}
              helperText={formik.touched.stock && formik.errors.stock}
            />
            <DialogActions>
              <Button onClick={handleCancle }>Cancel</Button>
              <Button type="submit">{editMode ? 'Update' : 'Save'}</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default Home;
