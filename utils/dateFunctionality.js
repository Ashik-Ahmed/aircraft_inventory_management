exports.getDateDifference = (date1, date2) => {
    const differenceInMilliseconds = date1 - date2;
    const differenceInSeconds = differenceInMilliseconds / 1000;
    const differenceInMinutes = differenceInSeconds / 60;
    const differenceInHours = differenceInMinutes / 60;
    const differenceInDays = differenceInHours / 24;

    return Math.round(differenceInDays);

}