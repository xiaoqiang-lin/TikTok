module.exports =  function formatTime (date){
  const ONE_SECOND = 1000;
  const ONE_MINUTE = 60000;
  const ONE_HOUR = 3600000;
  const ONE_DAY = 86400000;
  const ONE_WEEK = 604800000;
  const ONE_MONTH = 2629746000;
  const ONE_YEAR = 31556952000;
  const ONE_SECOND_AGO = "秒前";
  const ONE_MINUTE_AGO = "分钟前";
  const ONE_HOUR_AGO = "小时前";
  const ONE_DAY_AGO = "天前";
  const ONE_MONTH_AGO = "月前";
  const ONE_YEAR_AGO = "年前";
  let delta = new Date().getTime() - date.getTime()
  if (delta < 1 * ONE_MINUTE) {
    let seconds = ~~(delta / ONE_SECOND);
    return (seconds <= 0 ? 1 : seconds) + ONE_SECOND_AGO;
  }
  if (delta < 45 * ONE_MINUTE) {
    let minutes = ~~(delta / ONE_MINUTE)
    return (minutes <= 0 ? 1 : minutes) + ONE_MINUTE_AGO;
  }
  if (delta < 24 * ONE_HOUR) {
    let hours = ~~(delta / ONE_HOUR);
    return (hours <= 0 ? 1 : hours) + ONE_HOUR_AGO;
  }
  if (delta < 48 * ONE_HOUR) {
    return "昨天";
  }
  if (delta < 30 * ONE_DAY) {
    let days = ~~(delta / ONE_DAY);
    return (days <= 0 ? 1 : days) + ONE_DAY_AGO;
  }
  if (delta < 12 * 4 * ONE_WEEK) {
    let months = ~~(delta / ONE_MONTH);
    return (months <= 0 ? 1 : months) + ONE_MONTH_AGO;
  } else {
    let years = ~~(delta / ONE_YEAR);
    return (years <= 0 ? 1 : years) + ONE_YEAR_AGO;
  }
}