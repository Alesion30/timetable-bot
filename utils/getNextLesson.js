const spring1 = require("../data/spring1.json");

// 次の授業情報を取得する
const getNextLesson = (date) => {
  const daykeys = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const day = date.getDay(); // 曜日（0-6）
  const hour = date.getHours(); // 時
  const minute = date.getMinutes(); // 分
  const second = date.getSeconds(); // 秒

  // 日曜 または 土曜の時は null を返す
  if (day === 0 || day === 6) {
    return null;
  }

  const daykey = daykeys[day];
  const dayLessons = spring1[daykey];

  const nextPeriod = getNextPeriod(hour, minute, second);

  // 次の授業がない場合は null を返す
  if (nextPeriod === null) {
    return null;
  }

  const dayLesson = dayLessons[nextPeriod];
  return dayLesson;
};

// 次が何限かを返す
const getNextPeriod = (hour, minute, second) => {
  const time = convertTime(hour, minute, second);

  if (time < convertTime(8, 40, 0)) {
    // 1限
    return 1;
  } else if (time < convertTime(10, 30, 0)) {
    // 2限
    return 2;
  } else if (time < convertTime(13, 0, 0)) {
    // 3限
    return 3;
  } else if (time < convertTime(14, 50, 0)) {
    // 4限
    return 4;
  } else if (time < convertTime(16, 40, 0)) {
    // 5限
    return 5;
  } else {
    return null;
  }
};

// 「時分秒」を「秒」に変換する
const convertTime = (hour, minute, second) => {
  return hour * 60 * 60 + minute * 60 + second;
};

module.exports = getNextLesson;
