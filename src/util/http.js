import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();
const BASE_URL = "http://localhost:8080/events";

export async function fetchEvents({ signal, searchTerm, max }) {
  let url = `${BASE_URL}`;

  if (searchTerm && max) {
    url += `?search=${searchTerm}&max=${max}`;
  } else if (searchTerm) {
    url += `?search=${searchTerm}`;
  } else if (max) {
    url += `?max=${max}`;
  }

  const response = await fetch(url, { signal });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the events");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}

export async function createEvent(eventData) {
  let url = `${BASE_URL}`;

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(eventData),
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while creating the event");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();

  return event;
}

export async function fetchEvent({ signal, id }) {
  let url = `${BASE_URL}`;

  const response = await fetch(`${url}/${id}`, { signal });

  if (!response.ok) {
    const error = new Error("An error occurred while get event details");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();

  return event;
}

export async function deleteEvent(id) {
  let url = `${BASE_URL}`;

  const response = await fetch(`${url}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = new Error("An error occurred while deleting the event");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();

  return event;
}

export async function updateEvent({ id, event }) {
  let url = `${BASE_URL}/${id}`;

  const response = await fetch(url, {
    method: "PUT",
    body: JSON.stringify({ event }),
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while updating the event");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
}

export async function fetchImages({ signal }) {
  let url = `${BASE_URL}/images`;

  const response = await fetch(url, { signal });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the images");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { images } = await response.json();

  return images;
}
