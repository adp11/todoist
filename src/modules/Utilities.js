import { subDays, addDays, format, isWithinInterval } from 'date-fns';

// dueDate: yyyy-mm-dd
// new Date("yyyy/mm/dd")
// range: yyyy-mm/dd > yyyy-mm-dd

function getDateToday() {
    const today = new Date();
    let date = String(today.getDate()).padStart(2, '0');
    let month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
    let year = today.getFullYear();

    return `${year}-${month}-${date}`;
}

function getThisWeekRange() {
    const today = new Date(); 
    const day = today.getDay();
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

    return isWithinInterval(
        new Date(`${date[0]}/${date[1]}/${date[2]}`),
        {
            start: new Date(`${startDate[0]}/${startDate[1]}/${startDate[2]}`),
            end: new Date(`${endDate[0]}/${endDate[1]}/${endDate[2]}`),
        }
    )
}

function isValidFormat(projectName) {
    return projectName.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/) === null;
}

// param 'title': "prjName (src)" OR "prjName"
// titleComponents: [task title, optional task source]
function extractComponents(title) {
    let idx = title.indexOf("(");
    return (idx!==-1) ? [title.substring(0, idx-1), title.substring(idx+1, title.length-1)]
                      : [title]    
}

export {getDateToday, getThisWeekRange, isInInterval, isValidFormat, extractComponents};

