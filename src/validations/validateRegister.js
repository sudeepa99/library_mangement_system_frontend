export const validateRegister = ({ name, email, password, role }) => {
  const errors = {};

  if (!name.trim()) {
    errors.name = "Name is required";
  } else if (name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters";
  }

  if (!email.trim()) {
    errors.email = "Email is required";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email address";
    }
  }

  if (!role) {
    errors.role = "Role is required";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  }

  return errors;
};
