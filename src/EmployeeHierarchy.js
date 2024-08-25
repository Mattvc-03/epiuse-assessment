import React, { useEffect, useState } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { Box, Heading } from '@chakra-ui/react';
import { supabase } from './supabase'; // Ensure this import is correct

const generateColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const EmployeeHierarchy = () => {
  const [employees, setEmployees] = useState([]);
  const [rootColors, setRootColors] = useState({});

  useEffect(() => {
    const fetchEmployees = async () => {
      const { data, error } = await supabase.from('employees').select('*');
      if (error) {
        console.log('Error fetching employees', error);
      } else {
        setEmployees(data);
        const colors = {};
        const roots = data.filter(emp => !emp.manager_id);
        roots.forEach(root => {
          colors[root.id] = generateColor();
        });
        setRootColors(colors);
      }
    };

    fetchEmployees();
  }, []);

  const buildTree = (empList) => {
    const map = {};
    empList.forEach(emp => {
      map[emp.id] = { ...emp, children: [] };
    });

    const roots = [];
    empList.forEach(emp => {
      if (emp.manager_id && map[emp.manager_id]) {
        map[emp.manager_id].children.push(map[emp.id]);
      } else {
        roots.push(map[emp.id]);
      }
    });

    return roots;
  };

  const renderTree = (node, parentColor) => {
    // Use the parent's color if available, otherwise generate a new color for root nodes
    const nodeColor = parentColor || rootColors[node.id] || generateColor();
  
    // Determine if the node is a leaf node (no children)
    const isLeafNode = !node.children || node.children.length === 0;
  
    return (
      <TreeNode
        key={node.id}
        label={
          <Box
            style={{
              backgroundColor: nodeColor,
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid black',
              minWidth: '100px',
              textAlign: 'center',
            }}
          >
            ID: {node.id} <br /> {node.name} <br /> {node.role}
          </Box>
        }
        lineWidth={isLeafNode ? '0px' : '2px'}  // Remove line for leaf nodes
        lineColor={isLeafNode ? 'transparent' : 'blue'}  // Hide line color for leaf nodes
        lineBorderRadius={isLeafNode ? '0px' : '10px'}  // No border radius for leaf nodes
        style={{
          borderBottom: isLeafNode ? 'none' : '',
        }}  // Ensure no line is rendered for leaf nodes
        connectors={isLeafNode ? [] : undefined}  // Ensure no connectors are rendered for leaf nodes
      >
        {!isLeafNode && 
          node.children.map(child => renderTree(child, nodeColor))  // Pass the parent's color to children
        }
      </TreeNode>
    );
  };
  
  
  
  const roots = buildTree(employees);

  return (
    <Box p={5}>
      <Heading>Employee Hierarchy</Heading>
      <Tree
  lineWidth={'2px'}
  lineColor={'blue'}
  lineBorderRadius={'10px'}
  label={<Box>EPIUSE</Box>}
>
  {roots.map(root => renderTree(root))}
</Tree>


    </Box>
  );
};

export default EmployeeHierarchy;
