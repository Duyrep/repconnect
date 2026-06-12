export default function formatRelativeTime(date: Date) {
  if (isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();
  const pad = (num: number) => String(num).padStart(2, "0");
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;

  if (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  )
    return time;
  else
    return `${time} - ${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}
