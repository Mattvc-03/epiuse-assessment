import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ChakraProvider, Box, Flex, Heading, Button, VStack, } from '@chakra-ui/react';
import { FaUser, FaPlus, FaSitemap } from 'react-icons/fa';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';
import EmployeeDetails from './EmployeeDetails';
import EmployeeHierarchy from './EmployeeHierarchy';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Flex height="100vh">
          {/* Sidebar */}
          <VStack
            as="nav"
            width="250px"
            bg="teal.500"
            color="white"
            p={5}
            spacing={6}
            align="start"
            boxShadow="lg"
          >
            <Heading size="lg" mb={4}>
              Employee App
            </Heading>
            <Button
              as={Link}
              to="/"
              leftIcon={<FaUser />}
              variant="ghost"
              justifyContent="start"
              width="full"
              colorScheme="whiteAlpha"
              fontSize="lg"
            >
              Employee List
            </Button>
            <Button
              as={Link}
              to="/add-employee"
              leftIcon={<FaPlus />}
              variant="ghost"
              justifyContent="start"
              width="full"
              colorScheme="whiteAlpha"
              fontSize="lg"
            >
              Add Employee
            </Button>
            <Button
              as={Link}
              to="/hierarchy"
              leftIcon={<FaSitemap />}
              variant="ghost"
              justifyContent="start"
              width="full"
              colorScheme="whiteAlpha"
              fontSize="lg"
            >
              Hierarchy
            </Button>
          </VStack>

          {/* Main Content */}
          <Box flex={1} p={8} bg="gray.100">
            <Routes>
              <Route path="/" element={<EmployeeList />} />
              <Route path="/add-employee" element={<EmployeeForm />} />
              <Route path="/edit-employee/:id" element={<EmployeeForm />} />
              <Route path="/employee/:id" element={<EmployeeDetails />} />
              <Route path="/hierarchy" element={<EmployeeHierarchy />} />
            </Routes>
          </Box>
        </Flex>
      </Router>
    </ChakraProvider>
  );
}

export default App;
