let audits = [
  { id: 1, username: "admin", action: "CREATE_USER", details: "Created cashier", createdAt: new Date().toISOString() },
  { id: 2, username: "cashier", action: "SALE", details: "Sold 2 bottles of whiskey", createdAt: new Date().toISOString() },
];

export function getAuditLogs() {
  return Promise.resolve(audits);
}

export function addAudit(log) {
  const newLog = { id: Date.now(), ...log, createdAt: new Date().toISOString() };
  audits.unshift(newLog);
  return Promise.resolve(newLog);
}
