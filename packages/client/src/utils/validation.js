import { PASSWORD_MIN_LENGTH, NAME_MAX_LENGTH } from './constants';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// These are UX-only checks that catch obvious mistakes before hitting the
// network. The server re-validates everything and stays the source of truth.
export const isValidEmail = (email) => EMAIL_REGEX.test(email.trim());

export const isValidPassword = (password) => password.length >= PASSWORD_MIN_LENGTH;

export const isValidName = (name) => {
  const trimmed = name.trim();
  return trimmed.length > 0 && trimmed.length <= NAME_MAX_LENGTH;
};
