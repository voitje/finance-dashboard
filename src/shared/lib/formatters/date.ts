export const formatDate = (date: string | Date) =>
  new Intl.DateTimeFormat('en-US').format(new Date(date))
