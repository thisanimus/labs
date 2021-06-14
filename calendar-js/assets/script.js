class Calendar {
  constructor(year, month) {
    this.today = new Date();
    this.year = year;
    this.month = month;
    this.monthName = this.today.toLocaleString("default", { month: "long" });
    this.weeks = this.getWeeksInMonth();
    this.todayDate = this.today.getDate();
    this.todayMonth = this.today.getMonth();
    this.todayYear = this.today.getFullYear();
  }
  isToday(day) {
    let isToday = "day";
    if (
      day == this.todayDate &&
      this.month == this.todayMonth &&
      this.year == this.todayYear
    ) {
      isToday = "today";
    }
    return isToday;
  }
  getWeeksInMonth() {
    const weeks = [];
    const firstDate = new Date(this.year, this.month, 1);
    const lastDate = new Date(this.year, this.month + 1, 0);
    const numDays = lastDate.getDate();

    let dayOfWeekCounter = firstDate.getDay();

    for (let date = 1; date <= numDays; date++) {
      if (dayOfWeekCounter === 0 || weeks.length === 0) {
        weeks.push([]);
      }
      weeks[weeks.length - 1].push(date);
      dayOfWeekCounter = (dayOfWeekCounter + 1) % 7;
    }
    const firstWeek = weeks[0];
    const lastWeek = weeks[weeks.length - 1];
    const firstWeekMakeup = 7 - firstWeek.length;
    const lastWeekMakeup = 7 - lastWeek.length;

    for (let i = 0; i < firstWeekMakeup; i++) {
      firstWeek.unshift("");
    }
    for (let i = 0; i < lastWeekMakeup; i++) {
      lastWeek.push("");
    }
    return weeks;
  }
  calendarMarkup() {
    let weeks = "";
    this.weeks.map((week) => {
      let thisWeek = "<tr>";
      week.map((day) => {
        thisWeek += `<td class="${this.isToday(day)}">${day}</td>`;
      });
      thisWeek += "</tr>";
      weeks += thisWeek;
    });
    return `<table>
      <caption>${this.monthName} ${this.year}</caption>
      <tr><th>SU</th><th>MO</th><th>TU</th><th>WE</th><th>TH</th><th>FR</th><th>SA</th></tr>
      ${weeks}
    </table>`;
  }
}

const calendarWrapper = document.querySelector(".calendar");
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();

const calendar = new Calendar(year, month);
calendarWrapper.insertAdjacentHTML("beforeend", calendar.calendarMarkup());

