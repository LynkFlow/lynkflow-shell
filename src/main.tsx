// Module Federation async boundary -- must stay a thin shim with no
// shared-singleton imports of its own. Real mount logic: app/bootstrap.tsx.
void import("./app/bootstrap");

export {};
