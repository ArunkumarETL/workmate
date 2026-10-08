import {
  ref,
  set,
  get,
  update,
  remove,
  onValue,
  push,
} from "firebase/database";

import { database } from "@/lib/firebase";

// ================= CONFIG =================
const isSimulationMode = false;

// ================= LOCAL MEMORY =================
const memoryStore = {};

const setLocalPath = (path, value) => {
  if (value === null) delete memoryStore[path];
  else memoryStore[path] = value;
};

const getLocalPath = (path) => memoryStore[path] || null;

// =======================================================
// 📡 LISTENER
// =======================================================
export const listenData = (userId, node, callback) => {
  const path = `users/${userId}/${node}`;

  if (isSimulationMode) {
    callback(getLocalPath(path));
    return () => {};
  }

  const dbRef = ref(database, path);

  return onValue(dbRef, (snap) => {
    callback(snap.exists() ? snap.val() : null);
  });
};

// =======================================================
// 👷 WORKERS
// =======================================================
export const addWorker = async (userId, data) => {
  const workerId = Date.now().toString();
  const path = `users/${userId}/workers/${workerId}`;

  const workerData = {
    ...data,
    totalDays: 0,
    totalSalary: 0,
    finalSalary: 0,
    advanceTaken: 0,
    createdAt: new Date().toISOString(),
  };

  if (isSimulationMode){ setLocalPath(path, workerData);
  }else{ await set(ref(database, path), workerData);
  }

  await syncSalaryAndDashboard(userId);
  return workerId;
};

export const updateWorker = async (userId, workerId, data) => {
  const path = `users/${userId}/workers/${workerId}`;

  if (isSimulationMode) {
    const existing = getLocalPath(path) || {};
    setLocalPath(path, { ...existing, ...data });
  } else {
    await update(ref(database, path), data);
  }

  await syncSalaryAndDashboard(userId);
};

export const deleteWorker = async (userId, workerId) => {
  const path = `users/${userId}/workers/${workerId}`;

  if (isSimulationMode) setLocalPath(path, null);
  else await remove(ref(database, path));

  await syncSalaryAndDashboard(userId);
};

// =======================================================
// 🏗️ SITES
// =======================================================
export const addSite = async (userId, data) => {
  console.log('addsite recevied:',userId, data);
  const siteId = Date.now().toString();
  const path = `users/${userId}/sites/${siteId}`;
  console.log('saving to:',path);

  const siteData = {
    ...data,
    totalWorkers: 0,
    totalSalary: 0,
    createdAt: new Date().toISOString(),
  };

  if (isSimulationMode) { 
    setLocalPath(path, siteData);
  }else {await set(ref(database, path), siteData);
  }


  await syncSalaryAndDashboard(userId);
  return siteId;
};

export const updateSite = async (userId, siteId, data) => {
  const path = `users/${userId}/sites/${siteId}`;

  if (isSimulationMode) {
    const existing = getLocalPath(path) || {};
    setLocalPath(path, { ...existing, ...data });
  } else {
    await update(ref(database, path), data);
  }

  await syncSalaryAndDashboard(userId);
};

export const deleteSite = async (userId, siteId) => {
  const path = `users/${userId}/sites/${siteId}`;

  if (isSimulationMode) setLocalPath(path, null);
  else await remove(ref(database, path));

  await syncSalaryAndDashboard(userId);
};

// =======================================================
// 📅 ATTENDANCE (FIXED)
// =======================================================
export const saveAttendance = async (
  userId,
  dateStr,
  workerId,
  status,
  siteId = null
) => {
  const path = `users/${userId}/attendance/${dateStr}/${workerId}`;

  const isReset = status === "Reset" || !status;

  const data = {
    status,
    siteId,
  };

  if (isSimulationMode) {
    if (isReset) setLocalPath(path, null);
    else setLocalPath(path, data);

    await syncSalaryAndDashboard(userId);
    return;
  }

  if (isReset) {
    await remove(ref(database, path));
  } else {
    await set(ref(database, path), data);
  }

  await syncSalaryAndDashboard(userId);
};

// =======================================================
// 📊 SALARY + DASHBOARD ENGINE
// =======================================================
export const syncSalaryAndDashboard = async (userId) => {
  const base = `users/${userId}`;

  let workers = {};
  let sites = {};
  let attendance = {};

  const [w, s, a] = await Promise.all([
    get(ref(database, `${base}/workers`)),
    get(ref(database, `${base}/sites`)),
    get(ref(database, `${base}/attendance`)),
  ]);

  workers = w.exists() ? w.val() : {};
  sites = s.exists() ? s.val() : {};
  attendance = a.exists() ? a.val() : {};

  const updatedWorkers = {};
  const updatedSites = { ...sites };

  Object.keys(updatedSites).forEach((id) => {
    updatedSites[id].totalWorkers = 0;
    updatedSites[id].totalSalary = 0;
  });

  Object.keys(workers).forEach((id) => {
    updatedWorkers[id] = {
      ...workers[id],
      totalDays: 0,
      totalSalary: 0,
      finalSalary: 0,
    };
  });

  Object.keys(attendance).forEach((date) => {
    Object.keys(attendance[date] || {}).forEach((workerId) => {
      const entry = attendance[date][workerId];
      const worker = updatedWorkers[workerId];

      if (!worker) return;

      const wage = Number(worker.dailyWage) || 0;

      if (entry.status === "Present") {
        worker.totalDays += 1;
        worker.totalSalary += wage;

        if (entry.siteId && updatedSites[entry.siteId]) {
          updatedSites[entry.siteId].totalWorkers += 1;
          updatedSites[entry.siteId].totalSalary += wage;
        }
      }

      if (entry.status === "Half Day") {
        worker.totalDays += 0.5;
        worker.totalSalary += wage / 2;

        if (entry.siteId && updatedSites[entry.siteId]) {
          updatedSites[entry.siteId].totalWorkers += 0.5;
          updatedSites[entry.siteId].totalSalary += wage / 2;
        }
      }

      worker.finalSalary = worker.totalSalary;
    });
  });

  let grandTotalSalary = 0;

  Object.values(updatedWorkers).forEach((w) => {
    grandTotalSalary += w.finalSalary || 0;
  });

  const today = new Date().toISOString().split("T")[0];

  let todayAttendance = 0;

  if (attendance[today]) {
    Object.values(attendance[today]).forEach((e) => {
      if (e.status === "Present" || e.status === "Half Day") {
        todayAttendance++;
      }
    });
  }

  const dashboard = {
    totalSites: Object.keys(sites).length,
    totalWorkers: Object.keys(workers).length,
    todayAttendance,
    grandTotalSalary,
  };

  const updates = {
    [`${base}/workers`]: updatedWorkers,
    [`${base}/sites`]: updatedSites,
    [`${base}/dashboard`]: dashboard,
  };

  await update(ref(database), updates);
};

// =======================================================
// 💸 ADVANCES
// =======================================================
export const addAdvance = async (userId, workerId, amount, notes = "") => {
  const advSummaryPath = `users/${userId}/advances/${workerId}`;
  const dateStr = new Date().toISOString();

  if (isSimulationMode) {
    const current = getLocalPath(advSummaryPath) || { amount: 0, history: {} };
    const advId = "adv_" + Date.now();
    const newAmount = (Number(current.amount) || 0) + Number(amount);

    const newHistory = { ...current.history };
    newHistory[advId] = {
      id: advId,
      amount: Number(amount),
      date: dateStr,
      notes: notes || "Advance Taken",
    };

    setLocalPath(advSummaryPath, {
      amount: newAmount,
      history: newHistory,
    });
    await syncSalaryAndDashboard(userId);
  } else {
    const snapshot = await get(ref(database, advSummaryPath));
    const current = snapshot.exists()
      ? snapshot.val()
      : { amount: 0, history: {} };
    const newAmount = (Number(current.amount) || 0) + Number(amount);

    const newAdvRef = push(ref(database, `${advSummaryPath}/history`));
    const advId = newAdvRef.key;

    const updates = {};
    updates[`${advSummaryPath}/amount`] = newAmount;
    updates[`${advSummaryPath}/history/${advId}`] = {
      id: advId,
      amount: Number(amount),
      date: dateStr,
      notes: notes || "Advance Taken",
    };

    await update(ref(database), updates);
    await syncSalaryAndDashboard(userId);
  }
};

export const clearAdvancesForWorker = async (userId, workerId) => {
  const path = `users/${userId}/advances/${workerId}`;
  if (isSimulationMode) {
    setLocalPath(path, null);
    await syncSalaryAndDashboard(userId);
  } else {
    await remove(ref(database, path));
    await syncSalaryAndDashboard(userId);
  }
};