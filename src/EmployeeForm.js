import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Replace useHistory with useNavigate
import { supabase } from './supabase';
import { Box, Input, Button, FormLabel, Heading, Stack } from '@chakra-ui/react';

const EmployeeForm = ({ employee }) => {
  const [name, setName] = useState(employee ? employee.name : '');
  const [surname, setSurname] = useState(employee ? employee.surname : '');
  const [email, setEmail] = useState(employee ? employee.email : '');
  const [role, setRole] = useState(employee ? employee.role : '');
  const [salary, setSalary] = useState(employee ? employee.salary : '');

  const navigate = useNavigate(); // Replace useHistory with useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (employee) {
      await supabase.from('employees').update({ name, surname, email, role, salary }).eq('id', employee.id);
    } else {
      await supabase.from('employees').insert([{ name, surname, email, role, salary }]);
    }
    navigate('/'); // Replace history.push('/') with navigate('/')
  };

  return (
    <Box p={5}>
      <Heading>{employee ? 'Edit Employee' : 'Add Employee'}</Heading>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Box>
            <FormLabel>Name</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Box>
          <Box>
            <FormLabel>Surname</FormLabel>
            <Input value={surname} onChange={(e) => setSurname(e.target.value)} />
          </Box>
          <Box>
            <FormLabel>Email</FormLabel>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </Box>
          <Box>
            <FormLabel>Role</FormLabel>
            <Input value={role} onChange={(e) => setRole(e.target.value)} />
          </Box>
          <Box>
            <FormLabel>Salary</FormLabel>
            <Input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} />
          </Box>
          <Button colorScheme="blue" type="submit">
            {employee ? 'Update' : 'Create'}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default EmployeeForm;
