import { useEffect, useState } from 'react';
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

const Home = () => {
  const [items, setItems] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', stock: '' });
  const [editMode, setEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); 

  useEffect(() => {
    fetch('/api/items')
      .then((res) => res.json())
      .then(setItems);
  }, []);

  const handleSave = async () => {
    if (editMode) {
      await fetch(`/api/items/${selectedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      toast.success('Item updated successfully!');
    } else {
      await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      toast.success('Item added successfully!');
    }

    setDialogOpen(false);
    setFormData({ name: '', price: '', stock: '' });
    setEditMode(false);
    setSelectedItem(null);
    fetch('/api/items')
      .then((res) => res.json())
      .then(setItems);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    toast.success('Item deleted successfully!');
    fetch('/api/items')
      .then((res) => res.json())
      .then(setItems);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({ name: item.name, price: item.price, stock: item.stock });
    setEditMode(true);
    setDialogOpen(true);
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <Button variant="contained" onClick={() => setDialogOpen(true)}>
        Add Item
      </Button>
      <DataGrid
        rows={items}
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
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{editMode ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Stock"
            type="number"
            fullWidth
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>{editMode ? 'Update' : 'Save'}</Button>    
              </DialogActions>
      </Dialog>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default Home;
