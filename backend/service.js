require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

const app = express();
const port = 5000;

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Get all employees
app.get('/employees', async (req, res) => {
    try {
      const { data, error } = await supabase.from('employees').select('*');
      if (error) {
        console.error('Error fetching employees:', error);
        return res.status(500).json({ error: 'Failed to fetch employees' });
      }
      console.log('Fetched employees:', data);  // Add this line to see the fetched data in the terminal
      res.status(200).json(data);
    } catch (err) {
      console.error('Unexpected error:', err);
      res.status(500).json({ error: 'Unexpected error occurred' });
    }
  });
  

// Add a new employee
app.post('/api/employees', async (req, res) => {
  const { name, surname, email, role, manager_id } = req.body;
  const { data, error } = await supabase
    .from('employees')
    .insert([{ name, surname, email, role, manager_id }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json(data);
});

// Update an employee
app.put('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  const { name, surname, email, role, manager_id } = req.body;

  const { data, error } = await supabase
    .from('employees')
    .update({ name, surname, email, role, manager_id })
    .eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json(data);
});

// Delete an employee
app.delete('/api/employees/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from('employees').delete().eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
