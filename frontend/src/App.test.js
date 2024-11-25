import React from 'react';
import { render, screen, fireEvent, waitFor,within  } from '@testing-library/react';
import AdminPrivileges from './components/AdminPrivileges';
import RegisterForm from './components/RegisterForm';
import { getUsers, toggleAdmin } from './api/userApi';
import Footer from './components/Footer/Footer';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { MemoryRouter } from 'react-router-dom';
jest.mock('./api/userApi', () => ({
  getUsers: jest.fn(),
  toggleAdmin: jest.fn(),
  login: jest.fn(),
  addUser: jest.fn(),
}));

jest.mock('./api/requestApi', () => ({
  getAllGroupedRequests: jest.fn(),
  updateRequestStatus: jest.fn(),
}));

describe('AdminPrivileges Component', () => {
  test('renders loading state initially', () => {
    render(<AdminPrivileges />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders user table after fetching data', async () => {
    getUsers.mockResolvedValue([
      { id: 1, ime: 'John', priimek: 'Doe', email: 'john@example.com', tip_uporabnika_id: 1 },
    ]);

    render(<AdminPrivileges />);

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });
  });

  test('toggles admin status', async () => {
    getUsers.mockResolvedValue([
      { id: 1, ime: 'John', priimek: 'Doe', email: 'john@example.com', tip_uporabnika_id: 1 },
    ]);
    toggleAdmin.mockResolvedValue(true);

    render(<AdminPrivileges />);

    await waitFor(() => {
      expect(screen.getByText('Make Admin')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Make Admin'));
    await waitFor(() => {
      expect(screen.getByText('Remove Admin')).toBeInTheDocument();
    });
  });
});


test("renders footer with the expected background color", () => {
  render(
    <MemoryRouter>
      <ThemeProvider theme={createTheme()}>
        <Footer />
      </ThemeProvider>
    </MemoryRouter>
  );

  const footer = screen.getByRole('contentinfo'); 
  expect(footer).toBeInTheDocument();
  const computedStyle = window.getComputedStyle(footer);

  expect(computedStyle.backgroundColor).toBe('rgb(51, 102, 204)'); 
});
import App from './App';

test('navigates to /register and renders the RegisterPage component', () => {
  // Simulate navigation to /register
  window.history.pushState({}, 'Register Page', '/register');

  render(<App />);
  const registerHeading = screen.getByRole('heading', { name: /Register/i });
  expect(registerHeading).toBeInTheDocument();
});



import LeavesTable from "./components/LeavesTable";
const sampleLeaves = [
  { ime: "John", priimek: "Doe", tip_dopusta: "Sick Leave", zacetek: "2024-11-20", konec: "2024-11-22" },
  { ime: "Alice", priimek: "Brown", tip_dopusta: "Parental Leave", zacetek: "2024-12-01", konec: "2024-12-10" },
  { ime: "Jane", priimek: "Smith", tip_dopusta: "Vacation", zacetek: "2024-11-25", konec: "2024-11-30" },
];

test("sorts the table rows by type of leave", () => {
  render(<LeavesTable leaves={sampleLeaves} />);

  const sortBySelect = screen.getByRole("combobox"); 
  fireEvent.mouseDown(sortBySelect);
  fireEvent.click(screen.getByText("Type of Leave")); 

  const rows = screen.getAllByRole("row").slice(1);

  expect(within(rows[0]).getByText("Parental Leave")).toBeInTheDocument();
  expect(within(rows[1]).getByText("Sick Leave")).toBeInTheDocument();
  expect(within(rows[2]).getByText("Vacation")).toBeInTheDocument();

  expect(within(rows[0]).getByText("Alice")).toBeInTheDocument();
  expect(within(rows[1]).getByText("John")).toBeInTheDocument();
  expect(within(rows[2]).getByText("Jane")).toBeInTheDocument();
});

test("Footer is visible", async () => {
  const { container } = render(    <MemoryRouter>
    <ThemeProvider theme={createTheme()}>
      <Footer />
    </ThemeProvider>
  </MemoryRouter>);

  expect(container).toBeVisible();
});

test('should have no cookies', () => {
  expect(document.cookie).toBe('');
});

test('should have no token in localStorage', () => {
  expect(localStorage.getItem('token')).toBeNull();
});

test("should have required fields", () => {
  render(
    <MemoryRouter>
      <RegisterForm />
    </MemoryRouter>
  );

  const nameField = screen.getByTestId('name-input').querySelector('input');
  const lastNameField = screen.getByTestId('lastName-input').querySelector('input');
  const emailField = screen.getByTestId('email-input').querySelector('input');
  const passwordField = screen.getByTestId('password-input').querySelector('input');
  const confirmPasswordField = screen.getByTestId('confirmPassword-input').querySelector('input');

  expect(nameField).toBeRequired();
  expect(lastNameField).toBeRequired();
  expect(emailField).toBeRequired();
  expect(passwordField).toBeRequired();
  expect(confirmPasswordField).toBeRequired();
});