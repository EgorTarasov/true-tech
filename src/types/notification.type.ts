import { Priority } from "./priority.type";

export interface Notification {
  id: number;
  priority: Priority;
  date: Date;
  title: string;
  description: string;
}
