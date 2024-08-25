import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // to get the employee ID from the URL
import { useToast } from '@chakra-ui/react'; // Import useToast from Chakra UI
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Stack,
} from '@chakra-ui/react';

const EmployeeForm = () => {
  const { id } = useParams(); // Get employee ID from URL
  const toast = useToast(); // Initialize toast
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    birth_date: '',
    salary: '',
    role: '',
    manager_id: '',
    email: '',
  });

  useEffect(() => {
    if (id) {
      fetchEmployeeDetails();
    }
  }, [id]);

  const fetchEmployeeDetails = async () => {
    try {
      const baseURL = process.env.NODE_ENV === 'production'
        ? `https://epiuse-assessment.vercel.app/api/employees/${id}`
        : `http://localhost:5000/api/employees/${id}`;

      const { data } = await axios.get(baseURL);
      setFormData({
        name: data.name || '',
        surname: data.surname || '',
        birth_date: data.birth_date || '',
        salary: data.salary || '',
        role: data.role || '',
        manager_id: data.manager_id || '',
        email: data.email || '',
      });
    } catch (error) {
      console.log('Error fetching employee details', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch employee details',
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const baseURL = process.env.NODE_ENV === 'production'
        ? `https://epiuse-assessment.vercel.app/api/employees/${id}`
        : `http://localhost:5000/api/employees/${id}`;

      if (id) {
        // Update existing employee
        await axios.put(baseURL, formData);
        toast({
          title: 'Employee updated.',
          description: `Employee ${formData.name} ${formData.surname} has been updated successfully.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Add new employee
        await axios.post(baseURL.replace(`/${id}`, ''), formData);
        toast({
          title: 'Employee added.',
          description: `Employee ${formData.name} ${formData.surname} has been added successfully.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }

      // Clear the form
      setFormData({
        name: '',
        surname: '',
        birth_date: '',
        salary: '',
        role: '',
        manager_id: '',
        email: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${id ? 'update' : 'add'} employee: ${error.message}`,
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
            <FormLabel>Manager ID</FormLabel>
            <Input
              type="number"
              name="manager_id"
              value={formData.manager_id || ''}
              onChange={handleChange}
            />
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
            {id ? 'Update Employee' : 'Add Employee'}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default EmployeeForm;
