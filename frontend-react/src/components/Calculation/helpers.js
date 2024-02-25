export function formateDate(date) {
  let dateInstance = new Date(date);

  const year = dateInstance.getFullYear();
  const month = String(dateInstance.getMonth() + 1).padStart(2, "0");
  const day = String(dateInstance.getDate()).padStart(2, "0");
  const hours = String(dateInstance.getHours()).padStart(2, "0");
  const minutes = String(dateInstance.getMinutes()).padStart(2, "0");

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}
