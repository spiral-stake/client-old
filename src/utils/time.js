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
  const secondsInMinute = 60;
  const secondsInHour = secondsInMinute * 60;
  const secondsInDay = secondsInHour * 24;
  const secondsInMonth = secondsInDay * 30.44; // Approximate average month length
  const secondsInYear = secondsInDay * 365.25; // Approximate average year length

  let timeUnit;
  let timeValue;

  if (timeInSeconds < secondsInMinute) {
    timeUnit = "seconds";
    timeValue = timeInSeconds;
  } else if (timeInSeconds < secondsInHour) {
    timeUnit = "minutes";
    timeValue = Math.floor(timeInSeconds / secondsInMinute);
  } else if (timeInSeconds < secondsInDay) {
    timeUnit = "hours";
    timeValue = Math.floor(timeInSeconds / secondsInHour);
  } else if (timeInSeconds < secondsInMonth) {
    timeUnit = "days";
    timeValue = Math.floor(timeInSeconds / secondsInDay);
  } else if (timeInSeconds < secondsInYear) {
    timeUnit = "months";
    timeValue = Math.floor(timeInSeconds / secondsInMonth);
  } else {
    timeUnit = "years";
    timeValue = Math.floor(timeInSeconds / secondsInYear);
  }

  return { value: timeValue, unit: timeValue > 1 ? timeUnit + "s" : timeUnit };
}
