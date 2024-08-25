import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
import { useParams } from 'react-router-dom';

const EmployeeForm = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    birth_date: '',
    salary: '',
    role: '',
    manager_id: '',
    email: '',
  });

  const [employees, setEmployees] = useState([]);
  const toast = useToast();

  useEffect(() => {
    fetchEmployees();
    if (id) {
      fetchEmployeeDetails();
    }
  }, [id]);

  const fetchEmployees = async () => {
    try {
      const baseURL = process.env.NODE_ENV === 'production'
        ? 'https://epiuse-assessment.vercel.app/api/employees'
        : 'http://localhost:5000/api/employees';

      const { data } = await axios.get(baseURL);
      setEmployees(data);
    } catch (error) {
      console.log('Error fetching employees', error);
    }
  };

  const fetchEmployeeDetails = async () => {
    try {
      const baseURL = process.env.NODE_ENV === 'production'
        ? `https://epiuse-assessment.vercel.app/api/employees/${id}`
        : `http://localhost:5000/api/employees/${id}`;

      const { data } = await axios.get(baseURL);
      setFormData(data);
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

      const method = id ? 'put' : 'post';
      const { data } = await axios[method](baseURL, {
        ...formData,
        manager_id: formData.manager_id === '' ? null : parseInt(formData.manager_id, 10),
      });

      toast({
        title: id ? 'Employee updated.' : 'Employee added.',
        description: id
          ? `Employee ${formData.name} ${formData.surname} has been updated successfully.`
          : `Employee ${formData.name} ${formData.surname} has been added successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

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
      console.log('Error submitting form', error);
      toast({
        title: 'Error',
        description: `Failed to ${id ? 'update' : 'add'} employee`,
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
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} {emp.surname}
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
