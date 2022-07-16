export const createStopwatch = async (time) => {
  const response = await fetch(`/api/stopwatches`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      started: time,
    }),
  });

  return response.json();
};

export const saveToggles = async (id, timestamp) => {
  const response = await fetch(`/api/stopwatches/${id}/toggle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      time: timestamp,
    }),
  });

  return response.json();
};

export const saveLaps = async (id, timestamp) => {
  const response = await fetch(`/api/stopwatches/${id}/lap`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      time: timestamp,
    }),
  });
  return response.json();
};

export const resetStopwatch = async (id, time) => {
  const response = await fetch(`/api/stopwatches/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      started: time,
    }),
  });

  return response.json();
};

export const deleteStopwatch = async (id) => {
  const response = await fetch(`/api/stopwatches/${id}`, {
    method: "DELETE",
  });

  if (response.status === 204) {
    return "Succeed to delete stopwatch";
  } else {
    return "Failed to delete stopwatch";
  }
};
