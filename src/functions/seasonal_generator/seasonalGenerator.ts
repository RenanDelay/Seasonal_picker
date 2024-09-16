import { month_list } from "../../data/month_list";


type DateInfo = {
    day: number;
    name: string;
    date: Date;
  };
  
  type MonthData = {
    month: string;
    month_index: number,
    dates: DateInfo[];
  };

  export function extractData(inputText: string): MonthData[] {

    const datePattern = /^(\d{1,2}) (\w{3})$/;
  
    const lines = inputText.split("\n").filter((line) => line.trim() !== "");
  
    const result: MonthData[] = [];
    let currentMonth: MonthData | any
    let currentDate: DateInfo | null = null;
  
    lines.forEach((line) => {
      line = line.trim();
      const monthIndex = month_list.findIndex(res => res == line)
      if (month_list.some((res) => res === line)) {
        if (currentMonth) {
          result.push(currentMonth);
        }
        currentMonth = {
          month: line.replace("**", ""),
          month_index: monthIndex,
          dates: [],
        };
      } else {
        const dateMatch = line.match(datePattern);
        if (dateMatch && currentMonth) {
          if (currentDate) {
            currentMonth.dates.push(currentDate);
          }
          currentDate = {
            day: parseInt(dateMatch[1], 10),
            name: line.substring(dateMatch[0].length).trim(),
            date: new Date(
              new Date().getFullYear(),
              currentMonth?.month_index,
              parseInt(dateMatch[1], 10)
            ),
          };
        } else if (currentDate) {
          currentDate.name += " " + line;
        }
      }
    });
  
    if (currentDate && currentMonth) {
      currentMonth.dates.push(currentDate);
    }
    if (currentMonth) {
      result.push(currentMonth);
    }
  
    return result;
  }