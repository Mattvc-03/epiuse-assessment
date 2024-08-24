import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { Box, Button, Flex, Heading, Stack, Text, Badge } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  // Define fetchEmployees function before useEffect
  const fetchEmployees = async () => {
    const { data, error } = await supabase.from('employees').select('*');
    if (error) {
      console.log('Error fetching employees', error);
    } else {
      setEmployees(data);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []); // Dependency array is empty since fetchEmployees is defined inside the component

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={5}>
        <Heading size="lg">Employee List</Heading>
        <Button as={Link} to="/add-employee" colorScheme="teal">
          Add Employee
        </Button>
      </Flex>
      <Stack spacing={4}>
        {employees.length > 0 ? (
          employees.map((employee) => (
            <Box
              key={employee.id}
              p={4}
              borderWidth={1}
              borderRadius="md"
              boxShadow="md"
              bg="white"
            >
              <Flex justify="space-between" align="center">
                <Box>
                  <Heading size="md">
                    {employee.name} {employee.surname}
                  </Heading>
                  <Text>{employee.email}</Text>
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
                  >
                    View Details
                  </Button>
                  <Button
                    as={Link}
                    to={`/edit-employee/${employee.id}`}
                    colorScheme="teal"
                    size="sm"
                  >
                    Edit
                  </Button>
                </Flex>
              </Flex>
            </Box>
          ))
        ) : (
          <Text>No employees found.</Text>
        )}
      </Stack>
    </Box>
  );
};

export default EmployeeList;
