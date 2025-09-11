export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

export const formatTimeFromMinutes = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

export const getMonthName = (date: Date): string => {
  return date.toLocaleDateString('sv-SE', {month: 'long', year: 'numeric'})
}

export const getDaysInMonth = (year: number, month: number): Date[] => {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days: Date[] = []

  for (let date = new Date(firstDay); date <= lastDay; date.setDate(date.getDate() + 1)) {
    days.push(new Date(date))
  }

  return days
}
