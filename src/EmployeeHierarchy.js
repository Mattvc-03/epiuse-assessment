import React, { useEffect, useState } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { Box, Heading } from '@chakra-ui/react';
import Gravatar from 'react-gravatar';
import axios from 'axios';

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
      try {
        const baseURL = process.env.NODE_ENV === 'production'
          ? 'https://epiuse-assessment.vercel.app/api/employees'
          : 'http://localhost:5000/api/employees';

        const { data } = await axios.get(baseURL);
        setEmployees(data);

        const colors = {};
        const roots = data.filter(emp => !emp.manager_id);
        roots.forEach(root => {
          colors[root.id] = generateColor();
        });
        setRootColors(colors);

      } catch (error) {
        console.log('Error fetching employees', error);
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
    const nodeColor = parentColor || rootColors[node.id] || generateColor();
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
              minWidth: '120px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: 'white'
            }}
          >
            <Gravatar 
              email={node.email}
              size={50}
              style={{ borderRadius: '50%', marginBottom: '8px' }}
            />
            ID: {node.id} <br /> {node.name} <br /> {node.role}
          </Box>
        }
        lineStyle={isLeafNode ? { visibility: 'hidden' } : {}} 
      >
        {!isLeafNode && 
          node.children.map(child => renderTree(child, nodeColor))
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
