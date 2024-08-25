import React, { useState } from 'react';
import { supabase } from './supabase'; // Make sure the path is correct for your project
import { useToast } from '@chakra-ui/react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Stack,
} from '@chakra-ui/react';

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    birth_date: '',
    salary: '',
    role: '',
    manager_id: '',
    email: '',
  });

  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.from('employees').insert([
        {
          name: formData.name,
          surname: formData.surname,
          birth_date: formData.birth_date,
          salary: parseFloat(formData.salary),
          role: formData.role,
          manager_id: formData.manager_id ? parseInt(formData.manager_id) : null,
          email: formData.email,
        },
      ]);

      if (error) {
        throw error;
      }

      toast({
        title: 'Employee added.',
        description: `Employee ${formData.name} ${formData.surname} has been added successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

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
        description: `Failed to add employee: ${error.message}`,
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
              value={formData.manager_id}
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
            Add Employee
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default EmployeeForm;
