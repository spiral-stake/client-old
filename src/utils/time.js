export function getLocalTimeFromTimestamp(timestamp) {
  // Ensure the timestamp is in milliseconds. If it's in seconds, convert it to milliseconds.
  if (timestamp.toString().length === 10) {
    timestamp *= 1000; // Convert seconds to milliseconds
  }

  // Create a new Date object using the provided timestamp
  const date = new Date(timestamp);

  // Extract the local time components
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Format time (adding leading zeros for hours, minutes, and seconds if needed)
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return formattedTime;
}

export function parseTime(time, unit) {
  if (unit === "minutes") {
    return time * 60;
  }

  if (unit === "hours") {
    return time * 3600;
  }

  if (unit === "days") {
    return time * 86400;
  }

  if (unit === "months") {
    return time * 60 * 60 * 24 * 30.44;
  }
}

export function formatTime(timeInSeconds) {
  if (timeInSeconds < 60) {
    return { value: timeInSeconds, unit: timeInSeconds === 1 ? "second" : "seconds" };
  }

  const minutes = Math.floor(timeInSeconds / 60);
  if (minutes < 60) {
    return { value: minutes, unit: minutes === 1 ? "minute" : "minutes" };
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return { value: hours, unit: hours === 1 ? "hour" : "hours" };
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return { value: days, unit: days === 1 ? "day" : "days" };
  }

  const months = Math.floor(days / 30.44); // Approximate month length (30.44 days)
  return { value: months, unit: months === 1 ? "month" : "months" };
}
