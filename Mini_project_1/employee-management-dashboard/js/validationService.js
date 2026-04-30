const validationService = (() => {
  return {
    validateAuthForm(formData, isSignup = false) {
      const errors = {};

      if (!formData.username?.trim()) {
        errors.username = 'Username is required.';
      }

      if (!formData.password?.trim()) {
        errors.password = 'Password is required.';
      } else if (isSignup && formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters.';
      }

      if (isSignup) {
        if (!formData.confirmPassword?.trim()) {
          errors.confirmPassword = 'Confirm Password is required.';
        } else if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match.';
        }
      }

      return errors;
    },

    validateEmployeeForm(formData) {
      const errors = {};

      if (!formData.firstName?.trim()) {
        errors.firstName = 'First name is required.';
      }

      if (!formData.lastName?.trim()) {
        errors.lastName = 'Last name is required.';
      }

      if (!formData.email?.trim()) {
        errors.email = 'Email is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Invalid email format.';
      }

      if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
        errors.phone = 'Phone must be 10 digits.';
      }

      if (!formData.department?.trim()) {
        errors.department = 'Department required.';
      }

      if (!formData.designation?.trim()) {
        errors.designation = 'Designation required.';
      }

      if (formData.salary === undefined || formData.salary === null || Number(formData.salary) <= 0) {
        errors.salary = 'Salary must be positive.';
      }

      if (!formData.status?.trim()) {
        errors.status = 'Status required.';
      }

      return errors;
    }
  };
})();