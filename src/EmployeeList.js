import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Heading, Stack, Text, Badge, Divider } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/employees');
      setEmployees(data);
    } catch (error) {
      console.log('Error fetching employees', error);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      setEmployees(employees.filter((employee) => employee.id !== id));
    } catch (error) {
      console.log('Error deleting employee', error);
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={5}>
        <Heading size="lg" fontWeight="bold" color="teal.600">Employee List</Heading>
        <Button as={Link} to="/add-employee" colorScheme="teal" variant="solid" size="md" boxShadow="sm">
          Add Employee
        </Button>
      </Flex>
      <Divider mb={5} />
      <Stack spacing={4}>
        {employees.length > 0 ? (
          employees.map((employee) => (
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
