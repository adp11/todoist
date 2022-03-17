import { subDays, addDays, format, isWithinInterval } from 'date-fns';


// format: YYYY-MM-DD
function getDateToday() {
    const today = new Date();
    let date = String(today.getDate()).padStart(2, '0');
    let month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
    let year = today.getFullYear();

    return `${year}-${month}-${date}`;
}

// format: YYYY-MM-DD
function getThisWeekRange() {
    const today = new Date(); 
    const day = String(today.getDay());
    let weekStart = "";
    let weekEnd = "";

    if (day === 0) {
        weekStart = subDays(today, 6);
        weekEnd = today;
    } else {
        const diffBetweenTodayAndMonday = (day%7)-1;
        weekStart = subDays(today, diffBetweenTodayAndMonday);
        weekEnd = addDays(today, 6-diffBetweenTodayAndMonday);
    }
    return [format(weekStart, "yyyy-MM-dd"), format(weekEnd, "yyyy-MM-dd")];
}

function isInInterval(dueDate, range) {
    const date = dueDate.split("-");
    const startDate = range[0].split("-");
    const endDate = range[1].split("-");

    // dueDate: yyyy-mm-dd
    // new Date("yyyy/mm/dd")
    // range: yyyy-mm/dd > yyyy-mm-dd
    return isWithinInterval(
        new Date(`${date[0]}/${date[1]}/${date[2]}`),
        {
            start: new Date(`${startDate[0]}/${startDate[1]}/${startDate[2]}`),
            end: new Date(`${endDate[0]}/${endDate[1]}/${endDate[2]}`),
        }
    )
}


// this regex is still not robust enough
function isInvalidFormat(projectName) {
    return projectName.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/) === null;
}
export {getDateToday, getThisWeekRange, isInInterval, isInvalidFormat};