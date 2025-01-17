import { startOfMonth, endOfMonth, isBefore, isAfter, isWithinInterval } from 'date-fns';
import type { MonthSelection } from '../types/date';

export function getMonthName(month: number): string {
  return new Date(2000, month).toLocaleString('default', { month: 'long' });
}

export function getCurrentMonthSelection(): MonthSelection {
  const now = new Date();
  return {
    month: now.getMonth(),
    year: now.getFullYear()
  };
}

export function getFirstDayOfMonth(selection: MonthSelection): string {
  // Create date with time set to noon to avoid timezone issues
  const date = new Date(selection.year, selection.month, 1, 12, 0, 0);
  return date.toISOString().split('T')[0];
}

export function isInMonthRange(
  date: string | null,
  start: MonthSelection,
  end: MonthSelection,
  showAllTime: boolean
): boolean {
  if (!date) return false;
  if (showAllTime) return true;

  const transactionDate = new Date(date);
  const startDate = startOfMonth(new Date(start.year, start.month));
  const endDate = endOfMonth(new Date(end.year, end.month));

  return isWithinInterval(transactionDate, { start: startDate, end: endDate });
}

export function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}