import { getTsid } from 'tsid-ts';

export default function generateId() {
  return getTsid().toString();
}
