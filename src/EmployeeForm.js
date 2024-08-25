import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast, Box, Stack, FormControl, FormLabel, Input, Button, Select } from '@chakra-ui/react';
import axios from 'axios';

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    birth_date: '',
    salary: '',
    role: '',
    manager_id: null,  // Set initial value to null
    email: '',
  });

  const [managers, setManagers] = useState([]);

  useEffect(() => {
    if (id) {
      fetchEmployeeDetails(id);
    }
    fetchManagers();
  }, [id]);

  const fetchEmployeeDetails = async (id) => {
    try {
      const baseURL = process.env.NODE_ENV === 'production'
        ? `https://epiuse-assessment.vercel.app/api/employees/${id}`
        : `http://localhost:5000/api/employees/${id}`;

      const { data } = await axios.get(baseURL);
      setFormData({
        name: data.name,
        surname: data.surname,
        birth_date: data.birth_date,
        salary: data.salary,
        role: data.role,
        manager_id: data.manager_id || null,  // Use null if no manager
        email: data.email,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to fetch employee details: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchManagers = async () => {
    try {
      const baseURL = process.env.NODE_ENV === 'production'
        ? 'https://epiuse-assessment.vercel.app/api/employees'
        : 'http://localhost:5000/api/employees';

      const { data } = await axios.get(baseURL);
      setManagers(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to fetch managers: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleManagerChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, manager_id: value ? parseInt(value) : null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const baseURL = process.env.NODE_ENV === 'production'
        ? 'https://epiuse-assessment.vercel.app/api/employees'
        : 'http://localhost:5000/api/employees';
  
      const response = id 
        ? await axios.put(`${baseURL}/${id}`, formData)
        : await axios.post(baseURL, { 
            name: formData.name,
            surname: formData.surname,
            birth_date: formData.birth_date,
            salary: formData.salary,
            role: formData.role,
            manager_id: formData.manager_id || null,
            email: formData.email,
          });  // Insert new record without 'id'
  
      toast({
        title: `Employee ${id ? 'updated' : 'added'}.`,
        description: `Employee ${formData.name} ${formData.surname} has been ${id ? 'updated' : 'added'} successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
  
      // Reset form
      setFormData({
        name: '',
        surname: '',
        birth_date: '',
        salary: '',
        role: '',
        manager_id: null,
        email: '',
      });
  
      navigate('/employee-list');
    } catch (error) {
      console.error("Error adding/updating employee: ", error.response.data);
      toast({
        title: 'Error',
        description: `Failed to ${id ? 'update' : 'add'} employee: ${error.response.data.error || error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  

  return (
    <Box width="400px" mx="auto" mt={10}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl id="name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="surname" isRequired>
            <FormLabel>Surname</FormLabel>
            <Input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="birth_date" isRequired>
            <FormLabel>Birth Date</FormLabel>
            <Input
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="salary" isRequired>
            <FormLabel>Salary</FormLabel>
            <Input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="role" isRequired>
            <FormLabel>Role</FormLabel>
            <Input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="manager_id">
            <FormLabel>Manager</FormLabel>
            <Select
              name="manager_id"
              value={formData.manager_id || ''}
              onChange={handleManagerChange}
            >
              <option value="">None</option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.name} {manager.surname}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormControl>

          <Button type="submit" colorScheme="teal" size="lg">
            {id ? 'Update' : 'Add'} Employee
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default EmployeeForm;
