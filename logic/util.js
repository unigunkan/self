//@ts-check

export function getMidnightToday() {
  const midnightToday = new Date();
  midnightToday.setHours(0, 0, 0, 0);
  return midnightToday;
}

export function getMidnightInDays(days) {
  const day = getMidnightToday();
  day.setDate(day.getDate() + days);
  return day;
}

export function downloadText(fileName, text) {
  const link = document.createElement('a');
  link.setAttribute(
      'href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  link.setAttribute('download', fileName);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/** @param {Date} date */
export function getDateString(date) {
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - (offset * 60 * 1000));
  return date.toISOString().split('T')[0];
}

/**@param {string} str */
export function getMidnightFromString(str) {
  const date = new Date(str);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() + (offset * 60 * 1000));
}

/** @param {File} file @returns {Promise<JSON>} */
export function parseJsonFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      //@ts-ignore
      resolve(JSON.parse(reader.result));
    };
    reader.readAsText(file);
  });
}

// Exposed for debugging.
//@ts-ignore
window.getMidnightToday = getMidnightToday;
//@ts-ignore
window.getMidnightInDays = getMidnightInDays;
