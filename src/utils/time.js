export function getLocalTimeFromTimestamp(timestamp) {
  // Ensure the timestamp is in milliseconds. If it's in seconds, convert it to milliseconds.
  if (timestamp.toString().length === 10) {
    timestamp *= 1000; // Convert seconds to milliseconds
  }

  // Create a new Date object using the provided timestamp
  const date = new Date(timestamp);

  // Array of month abbreviations
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Extract the date components
  const day = date.getDate().toString().padStart(2, "0");
  const month = monthNames[date.getMonth()]; // Get abbreviated month
  const year = date.getFullYear();

  // Extract the time components
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  // Format date and time
  const formattedDate = `${day} ${month}`;
  const formattedTime = `${hours}:${minutes}:${seconds}`;

  // Return the full formatted date and time
  return { formattedDate, formattedTime };
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
    timeUnit = "second";
    timeValue = timeInSeconds;
  } else if (timeInSeconds < secondsInHour) {
    timeUnit = "minute";
    timeValue = Math.floor(timeInSeconds / secondsInMinute);
  } else if (timeInSeconds < secondsInDay) {
    timeUnit = "hour";
    timeValue = Math.floor(timeInSeconds / secondsInHour);
  } else if (timeInSeconds < secondsInMonth) {
    timeUnit = "day";
    timeValue = Math.floor(timeInSeconds / secondsInDay);
  } else if (timeInSeconds < secondsInYear) {
    timeUnit = "month";
    timeValue = Math.floor(timeInSeconds / secondsInMonth);
  } else {
    timeUnit = "year";
    timeValue = Math.floor(timeInSeconds / secondsInYear);
  }

  return { value: timeValue, unit: timeValue > 1 ? timeUnit + "s" : timeUnit };
}
