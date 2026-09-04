/**
 * mockApi
 * -------
 * Stands in for the real backend. Since the client's floor staff often
 * work on spotty airport wifi / 3G, every call here simulates realistic
 * network latency and a chance of failure so the UI's loading + error
 * states get properly exercised instead of only ever hitting the happy
 * path in dev.
 *
 * `window.__ffPortalNetworkMode` lets us force "slow" or "offline" for
 * demoing the unhappy path live (see NetworkSimulator control in the UI).
 */

const LATENCY = {
  normal: [250, 700],
  slow: [2200, 4000],
};

let members = [
  { id: "m1", memberId: "FF-10234", name: "Ritika Desai", email: "ritika.desai@example.com", tier: "Gold", miles: 84210, status: "Active" },
  { id: "m2", memberId: "FF-10771", name: "Arvind Kulkarni", email: "arvind.k@example.com", tier: "Platinum", miles: 152430, status: "Active" },
  { id: "m3", memberId: "FF-11209", name: "Meera Nair", email: "meera.nair@example.com", tier: "Silver", miles: 12980, status: "Suspended" },
  { id: "m4", memberId: "FF-11588", name: "Devansh Rao", email: "devansh.rao@example.com", tier: "Diamond", miles: 301050, status: "Active" },
];

function getNetworkMode() {
  if (typeof window === "undefined") return "normal";
  return window.__ffPortalNetworkMode || "normal";
}

function delay() {
  const mode = getNetworkMode() === "slow" ? "slow" : "normal";
  const [min, max] = LATENCY[mode];
  const ms = Math.floor(Math.random() * (max - min)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function maybeFail() {
  const mode = getNetworkMode();
  if (mode === "offline") {
    const err = new Error("You're offline. Check your connection and try again.");
    err.code = "OFFLINE";
    throw err;
  }
  // Small organic failure chance even in "normal" mode so the error
  // path isn't purely theoretical.
  if (Math.random() < 0.06) {
    const err = new Error("The server took too long to respond.");
    err.code = "TIMEOUT";
    throw err;
  }
}

export async function fetchMembers() {
  await delay();
  maybeFail();
  return [...members];
}

export async function createMember(payload) {
  await delay();
  maybeFail();
  const record = { id: `m${Date.now()}`, ...payload };
  members = [record, ...members];
  return record;
}

export async function updateMember(id, payload) {
  await delay();
  maybeFail();
  members = members.map((m) => (m.id === id ? { ...m, ...payload } : m));
  const updated = members.find((m) => m.id === id);
  if (!updated) {
    const err = new Error("Record not found. It may have been removed.");
    err.code = "NOT_FOUND";
    throw err;
  }
  return updated;
}

export async function deleteMember(id) {
  await delay();
  maybeFail();
  members = members.filter((m) => m.id !== id);
  return id;
}
