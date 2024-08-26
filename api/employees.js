require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'https://epiuse-assessment.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const { data, error } = await supabase.from('employees').select('*');
    if (error) {
      console.error('Error fetching employees:', error);
      return res.status(500).json({ error: 'Failed to fetch employees' });
    }
    res.status(200).json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
});
// Get a specific employee by ID
app.get('/api/employees', async (req, res) => {
  const { id } = req.query;
  console.log(`Fetching employee with ID: ${id}`);

  try {
    const { data, error } = await supabase.from('employees').select('*').eq('id', id);
    if (error) {
      console.error('Error fetching employee:', error);
      return res.status(500).json({ error: 'Failed to fetch employee' });
    }

    if (!data || data.length === 0) {
      console.log(`Employee with ID: ${id} not found`);
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json(data[0]);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
});

// Add a new employee
app.post('/api/employees', async (req, res) => {
  const { name, surname, email, role, manager_id, birth_date, salary } = req.body;
  try {
    const { data, error } = await supabase
      .from('employees')
      .insert([{ name, surname, email, role, manager_id: manager_id || null, birth_date, salary }]);

    if (error) {
      console.error('Error adding employee:', error);
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
});

// Update an employee
app.put('/api/employees', async (req, res) => {
  const { id } = req.query; // Ensure you're getting the `id` from the query
  const { name, surname, email, role, manager_id, birth_date, salary } = req.body;

  console.log(`Updating employee with ID: ${id}`); // Log the ID for debugging
  console.log(`Received data:`, { name, surname, email, role, manager_id, birth_date, salary }); // Log received data

  try {
    const { data, error } = await supabase
      .from('employees')
      .update({ name, surname, email, role, manager_id, birth_date, salary })
      .eq('id', id);

    if (error) {
      console.error('Error updating employee:', error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
});



// Delete an employee
app.delete('/api/employees', async (req, res) => {
  const { id } = req.query;
  try {
    const { error } = await supabase.from('employees').delete().eq('id', id);

    if (error) {
      console.error('Error deleting employee:', error);
      return res.status(500).json({ error: error.message });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
