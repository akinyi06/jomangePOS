let users = [
  { id: 1, username: "admin", role: "ADMIN", active: true },
  { id: 2, username: "cashier", role: "STAFF", active: true },
];

export function getUsers() {
  return Promise.resolve(users);
}

export function createUser(user) {
  const newUser = { id: Date.now(), ...user, active: true };
  users.push(newUser);
  return Promise.resolve(newUser);
}

export function toggleUser(id) {
  users = users.map(u =>
    u.id === id ? { ...u, active: !u.active } : u
  );
  return Promise.resolve(users.find(u => u.id === id));
}

export function resetPassword(id, newPassword) {
  // Just simulate password reset
  return Promise.resolve({ id, message: "Password reset successful" });
}
