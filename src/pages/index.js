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

const Home = () => {
  const [items, setItems] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', stock: '' });

  useEffect(() => {
    fetch('/api/items')
      .then((res) => res.json())
      .then(setItems);
  }, []);

  const handleSave = async () => {
    await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setDialogOpen(false);
    setFormData({ name: '', price: '', stock: '' });
    fetch('/api/items')
      .then((res) => res.json())
      .then(setItems);
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
        ]}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Add New Item</DialogTitle>
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
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Home;