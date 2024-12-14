import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import AdminPrivileges from './components/AdminPrivileges';
import RegisterForm from './components/RegisterForm';
import { getUsers, toggleAdmin } from './api/userApi';
import Footer from './components/Footer/Footer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AdminRequests from './components/AdminRequests';
import { MemoryRouter } from 'react-router-dom';
import { getAllGroupedRequests, updateRequestComment } from './api/requestApi';
jest.mock('./api/userApi', () => ({
  getUsers: jest.fn(),
  toggleAdmin: jest.fn(),
  login: jest.fn(),
  addUser: jest.fn(),
}));

jest.mock('./api/requestApi', () => ({
  getAllGroupedRequests: jest.fn(),
  updateRequestStatus: jest.fn(),
  updateRequestComment: jest.fn(),
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
  const { container } = render(<MemoryRouter>
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

const request = {
  id: 1,
  datum_zahteve: '2024-11-25',
  komentar: 'Test comment',
};






const dummyRequests = [
  {
    id: 1,
    email: 'john.doe@example.com',
    datum_zahteve: new Date().toISOString(),
    stanje: 'in progress',
    komentar: 'Updated Comment',
    dopusti: [
      {
        tip_dopusta: 'Annual Leave',
        zacetek: '2024-12-01',
        konec: '2024-12-10',
        razlog: 'Vacation',
      },
    ],
  },
];

describe('AdminRequests Component', () => {
  it('should render requests comment input field correctly', async () => {


    getAllGroupedRequests.mockResolvedValue(dummyRequests);

    render(<AdminRequests />);

    await waitFor(() => expect(screen.getByTestId('comment-input')).toBeInTheDocument());

  });
});


test('should check if input field is enabled and writable', async () => {


  getAllGroupedRequests.mockResolvedValue(dummyRequests);

  render(<AdminRequests />);

  await waitFor(() => {
    const commentInput = screen.getByTestId('comment-input');
    expect(commentInput).toBeEnabled();
  });


});

test('should check if save comment button is enabled and clickable', async () => {


  getAllGroupedRequests.mockResolvedValue(dummyRequests);

  render(<AdminRequests />);

  await waitFor(() => {
    const saveButton = screen.getByTestId('comment-button');
    expect(saveButton).toBeEnabled();
  });

});
test('Check if comment input vield is writable', async () => {
  getAllGroupedRequests.mockResolvedValue(dummyRequests);
  render(<AdminRequests />);

  await waitFor(() => {
    const saveButton = screen.getByTestId('comment-button');
    expect(saveButton).toBeEnabled();

    const commentInput = screen.getByTestId('comment-input');
    expect(commentInput).toBeEnabled();
  });
  const commentInput = screen.getByTestId('comment-input').querySelector('textarea');
  const saveButton = screen.getByTestId('comment-button');

  fireEvent.change(commentInput, { target: { value: 'Updated Comment' } });
  expect(saveButton).toBeEnabled();
  fireEvent.click(saveButton);
  expect(commentInput.value).toBe('Updated Comment');

});

it('should call handleSaveComment with correct request data when save button is clicked', async () => {
  const dummyRequests = [
    {
      id: 1,
      email: 'user@example.com',
      datum_zahteve: '2023-11-25',
      komentar: 'Initial Comment',
      stanje: 'in progress',
      dopusti: [],
    },
  ];

  getAllGroupedRequests.mockResolvedValue(dummyRequests);
  updateRequestComment.mockResolvedValue({ success: true });

  render(<AdminRequests />);

  await waitFor(() => {
    const saveButton = screen.getByTestId('comment-button');
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeEnabled();
  });

  const commentInput = screen.getByTestId('comment-input').querySelector('textarea');
  fireEvent.change(commentInput, { target: { value: 'Updated Comment' } });

  const saveButton = screen.getByTestId('comment-button');
  fireEvent.click(saveButton);

  await waitFor(() => {
    expect(updateRequestComment).toHaveBeenCalledWith(1, 'Updated Comment');
  });
});