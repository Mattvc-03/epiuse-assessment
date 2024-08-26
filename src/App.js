import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ChakraProvider, Box, Flex, Heading, Button, VStack } from '@chakra-ui/react';
import { FaUser, FaPlus, FaSitemap } from 'react-icons/fa';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';
import EmployeeDetails from './EmployeeDetails';
import EmployeeHierarchy from './EmployeeHierarchy';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Flex height="100vh" bg="gray.100" overflow="hidden">
          {/* Sidebar */}
          <VStack
            as="nav"
            width="250px"
            bgGradient="linear(to-b, teal.500, teal.600)"
            color="white"
            p={5}
            spacing={6}
            align="start"
            position="fixed"
            top={0}
            left={0}
            height="100vh"
            boxShadow="xl"
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
              _hover={{ bg: "teal.700" }}
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
              _hover={{ bg: "teal.700" }}
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
              _hover={{ bg: "teal.700" }}
            >
              Hierarchy
            </Button>
          </VStack>

          {/* Main Content */}
          <Box
            flex={1}
            p={8}
            ml="250px"
            bg="white"
            borderRadius="lg"
            boxShadow="xl"
            overflowY="auto"
            height="100vh"
          >
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
