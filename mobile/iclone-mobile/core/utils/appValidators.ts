export class AppValidators {
  // -----------------------------
  // Non-empty string validator
  // -----------------------------
  static nonEmpty(value: string): string | null {
    if (!value || value.trim().length === 0) {
      return "This field cannot be empty.";
    }
    return null;
  }

  // -----------------------------
  // Email validator
  // -----------------------------
  static email(value: string): string | null {
    if (!value || value.trim().length === 0) {
      return "Email cannot be empty.";
    }

    // Very safe general-use regex (like Flutter's email behavior)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      return "Please enter a valid email address.";
    }

    return null;
  }

  // -----------------------------
  // Username validator
  // Rules:
  // - At least 8 characters
  // - Must contain letters
  // - Must contain numbers
  // -----------------------------
  static username(value: string): string | null {
    if (!value || value.trim().length === 0) {
      return "Username cannot be empty.";
    }

    if (value.length < 8) {
      return "Username must be at least 8 characters long.";
    }

    if (!/[A-Za-z]/.test(value)) {
      return "Username must contain at least one letter.";
    }

    if (!/[0-9]/.test(value)) {
      return "Username must contain at least one number.";
    }

    return null;
  }

  // -----------------------------
  // Password validator
  // Rules:
  // - At least 8 chars
  // - At least 1 uppercase
  // - At least 1 lowercase
  // - At least 1 number
  // - At least 1 special character
  // -----------------------------
  static password(value: string): string | null {
    if (!value || value.trim().length === 0) {
      return "Password cannot be empty.";
    }

    if (value.length < 8) {
      return "Password must be at least 8 characters long.";
    }

    if (!/[A-Z]/.test(value)) {
      return "Password must contain at least one uppercase letter.";
    }

    if (!/[a-z]/.test(value)) {
      return "Password must contain at least one lowercase letter.";
    }

    if (!/[0-9]/.test(value)) {
      return "Password must contain at least one number.";
    }

    if (!/[!@#$%^&*(),.?\":{}|<>_\-+=/\\[\];']/ .test(value)) {
      return "Password must contain at least one special character.";
    }

    return null;
  }
}
