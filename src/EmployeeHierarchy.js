import React, { useEffect, useState } from 'react';
import OrgChart from '@unicef/react-org-chart';
import { supabase } from './supabase';
import { Box, Heading, Text } from '@chakra-ui/react';

const EmployeeHierarchy = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const { data, error } = await supabase.from('employees').select('*');
    if (error) console.log('Error fetching employees', error);
    else setEmployees(data);
  };

  const buildTree = (empList) => {
    const map = {};
    empList.forEach(emp => {
      map[emp.id] = { ...emp, children: [] };
    });

    const tree = [];
    empList.forEach(emp => {
      if (emp.manager_id) {
        map[emp.manager_id].children.push(map[emp.id]);
      } else {
        tree.push(map[emp.id]);
      }
    });

    return tree;
  };

  const tree = buildTree(employees);

  return (
    <Box p={5}>
      <Heading>Employee Hierarchy</Heading>
      {tree.length > 0 ? (
        <OrgChart data={tree} />
      ) : (
        <Text>No hierarchy data available</Text>
      )}
    </Box>
  );
};

export default EmployeeHierarchy;
