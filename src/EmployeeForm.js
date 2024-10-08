import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useToast } from '@chakra-ui/react'; 
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Stack,
  Select,
} from '@chakra-ui/react';

const EmployeeForm = () => {
  const { id } = useParams(); 
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    birth_date: '',
    salary: '',
    role: '',
    manager_id: '',
    email: '',
  });
  const [managers, setManagers] = useState([]); 
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null); // Store current employee ID

  useEffect(() => {
    fetchManagers(); 
    if (id) {
      fetchEmployeeDetails();
    }
  }, [id]);

  const fetchManagers = async () => {
    try {
      const baseURL = process.env.NODE_ENV === 'production'
        ? 'https://epiuse-assessment.vercel.app/api/employees'
        : 'http://localhost:5000/api/employees';

      const { data } = await axios.get(baseURL);
      setManagers(data);
    } catch (error) {
      console.log('Error fetching managers', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch managers',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchEmployeeDetails = async () => {
    try {
      const baseURL = process.env.NODE_ENV === 'production'
        ? `https://epiuse-assessment.vercel.app/api/employees?id=${id}`
        : `http://localhost:5000/api/employees?id=${id}`;
  
      const { data } = await axios.get(baseURL);
      const employee = data.find(emp => emp.id === parseInt(id));
  
      if (employee) {
        setFormData({
          name: employee.name || '',
          surname: employee.surname || '',
          birth_date: employee.birth_date || '',
          salary: employee.salary || '',
          role: employee.role || '',
          manager_id: employee.manager_id || '',
          email: employee.email || '',
        });
        setCurrentEmployeeId(employee.id); // Set the current employee ID
      } else {
        console.log('Employee not found');
        toast({
          title: 'Error',
          description: 'Employee not found',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
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

    // Ensure manager_id is null if empty
    const updatedFormData = {
        ...formData,
        manager_id: formData.manager_id === '' ? null : formData.manager_id
    };

    // Check if the user is trying to set themselves as their own manager
    if (currentEmployeeId && updatedFormData.manager_id === currentEmployeeId.toString()) {
      toast({
        title: 'Error',
        description: 'You cannot set yourself as your own manager.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
        const baseURL = process.env.NODE_ENV === 'production'
            ? `https://epiuse-assessment.vercel.app/api/employees`
            : `http://localhost:5000/api/employees`;

        if (id) {
            await axios.put(`${baseURL}?id=${id}`, updatedFormData);
            toast({
                title: 'Employee updated.',
                description: `Employee ${formData.name} ${formData.surname} has been updated successfully.`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } else {
            await axios.post(baseURL, updatedFormData);
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
            <FormLabel>Manager</FormLabel>
            <Select
              name="manager_id"
              value={formData.manager_id}
              onChange={handleChange}
            >
              <option value="">None</option>
              {managers.map(manager => (
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
            {id ? 'Update Employee' : 'Add Employee'}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default EmployeeForm;
