import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from './supabase';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import Gravatar from 'react-gravatar';

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    const { data, error } = await supabase.from('employees').select('*').eq('id', id).single();
    if (error) console.log('Error fetching employee', error);
    else setEmployee(data);
  };

  if (!employee) return <Text>Loading...</Text>;

  return (
    <Box p={5}>
      <Heading>Employee Details</Heading>
      <Gravatar email={employee.email} size={100} />
      <Text mt={3}><strong>Name:</strong> {employee.name} {employee.surname}</Text>
      <Text><strong>Role:</strong> {employee.role}</Text>
      <Text><strong>Salary:</strong> {employee.salary}</Text>
      <Link to={`/edit-employee/${employee.id}`}>
        <Button mt={4} colorScheme="teal">Edit</Button>
      </Link>
    </Box>
  );
};

export default EmployeeDetails;
