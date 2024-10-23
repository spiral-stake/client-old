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
