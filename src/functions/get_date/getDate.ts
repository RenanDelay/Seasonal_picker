export default function getLastDays(days: number): Date[] {
    const datesArray: Date[] = [];
    const today = new Date(new Date().getFullYear() + 1 , 0, 0);
    for (let i = 0; i < days; i++) {
      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - i);
      datesArray.push(pastDate);
    }
    return datesArray.reverse();
  }