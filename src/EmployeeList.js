import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Heading, Stack, Text, Badge, Divider, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { SearchIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useToast } from '@chakra-ui/react'; 

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const baseURL = process.env.NODE_ENV === 'production' 
        ? 'https://epiuse-assessment.vercel.app/api/employees'
        : 'http://localhost:5000/api/employees';

      const { data } = await axios.get(baseURL);
      setEmployees(data);
    } catch (error) {
      console.log('Error fetching employees', error);
      toast({
        title: 'Error fetching employees',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const deleteEmployee = async (id) => {
    try {
      const baseURL = process.env.NODE_ENV === 'production' 
        ? `https://epiuse-assessment.vercel.app/api/employees/${id}`
        : `http://localhost:5000/api/employees/${id}`;

      await axios.delete(baseURL);
      setEmployees(employees.filter((employee) => employee.id !== id));

      toast({
        title: 'Employee deleted',
        description: `Employee with ID ${id} has been deleted successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.log('Error deleting employee', error);
      toast({
        title: 'Error deleting employee',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={5}>
        <Heading size="lg" fontWeight="bold" color="teal.600">Employee List</Heading>
        <Button as={Link} to="/add-employee" colorScheme="teal" variant="solid" size="md" boxShadow="sm">
          Add Employee
        </Button>
      </Flex>
      <InputGroup mb={5}>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input 
          type="text" 
          placeholder="Search employees..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </InputGroup>
      <Divider mb={5} />
      <Stack spacing={4}>
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <Box
              key={employee.id}
              p={4}
              borderWidth={1}
              borderRadius="md"
              boxShadow="md"
              bg="gray.50"
              _hover={{ boxShadow: "lg" }}
            >
              <Flex justify="space-between" align="center">
                <Box>
                  <Heading size="md" color="teal.700">
                    {employee.name} {employee.surname}
                  </Heading>
                  <Text color="gray.600">{employee.email}</Text>
                  <Badge colorScheme="green" mt={2}>
                    Role: {employee.role}
                  </Badge>
                </Box>
                <Flex>
                  <Button
                    as={Link}
                    to={`/employee/${employee.id}`}
                    colorScheme="teal"
                    size="sm"
                    mr={2}
                    variant="outline"
                  >
                    View Details
                  </Button>
                  <Button
                    as={Link}
                    to={`/edit-employee/${employee.id}`}
                    colorScheme="teal"
                    size="sm"
                    mr={2}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => deleteEmployee(employee.id)}
                    colorScheme="red"
                    size="sm"
                  >
                    Delete
                  </Button>
                </Flex>
              </Flex>
            </Box>
          ))
        ) : (
          <Text color="gray.600">No employees found.</Text>
        )}
      </Stack>
    </Box>
  );
};

export default EmployeeList;
