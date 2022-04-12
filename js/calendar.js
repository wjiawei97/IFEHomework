var yearSelector = document.querySelector('#year-select')
var monthSelector = document.querySelector('#month-select')
var date = new Date()
var currentYear = date.getFullYear();
var currentMonth = date.getMonth() + 1;
var selectedYear = currentYear;
var selectedMonth = currentMonth;
var selectedDay = 0;
var timerId;

window.onload = function () {
  startTime()
  showCalendar(selectedYear, selectedMonth)
}

//展示年份和月份选择框
function startTime () {
  //给#year-select赋值
  let gap = 10;
  for (let i = (currentYear - gap); i < (currentYear + gap); i++) {
    yearSelector.options.add(new Option(i + '年', i))
  }
  yearSelector.options[gap].selected = true
  //给#month-select赋值
  for (let i = 0; i <= 12; i++) {
    monthSelector.options.add(new Option(i + '月', i))
  }
  monthSelector.options[currentMonth].selected = true;
}

//监听选择年份 事件
yearSelector.onchange = function () {
  selectedYear = yearSelector.options[yearSelector.selectedIndex].value;
  showCalendar(selectedYear, selectedMonth);
}
monthSelector.onchange = function () {
  selectedMonth = monthSelector.options[monthSelector.selectedIndex].value;
  showCalendar(selectedYear, selectedMonth);
}

//显示日历
function showCalendar (year, month) {
  var calendar = document.querySelector('#calendar')
  var calendarBody = document.querySelector('.calendar-body')
  if (calendar.contains(calendarBody)) {
    calendarBody.remove()
  }
  calendarBody = document.createElement('div')
  calendarBody.className = 'calendar-body'
  calendar.appendChild(calendarBody)

  //获取该年月的第一天是周几，添加空白span
  let day = new Date(year, month - 1, 1).getDay();
  for (let i = 0; i < day; i++) {
    var span = document.createElement('span')
    span.innerHTML = '';
    calendarBody.appendChild(span)
  }

  //获取该年月的天数
  let totalDay = new Date(year, month, -1).getDate() + 1;
  for (let i = 1; i <= totalDay; i++) {
    var span = document.createElement('span')
    span.innerHTML = i;
    calendarBody.appendChild(span)
  }

  //监听日期选择
  calendarBody.addEventListener('click', function (event) {
    for (let i = 0; i < calendarBody.children.length; i++) {
      calendarBody.children[i].style.backgroundColor = '#fff';
      calendarBody.children[i].style.color = '#000';
    }
    var elem = event.target;
    elem.style.backgroundColor = 'rgb(107,173,203)'
    elem.style.color = '#fff'
    selectedDay = elem.innerHTML;
  })

}

/*
 *实现一个函数显示上一个月或者下一个月
 * 如果传入参数为`prev`，就是显示上一个月
 * 如果传入参数为`next`，就是显示下一个月
 */
function Month (flag) {
  if (flag === 'prev') {
    showCalendar(selectedYear, --selectedMonth);
    monthSelector.options[selectedMonth].selected = true;
  } else if (flag === 'next') {
    showCalendar(selectedYear, ++selectedMonth);
    monthSelector.options[selectedMonth].selected = true;
  }
}
//封装一个函数，实现日历显示今天
function now () {
  showCalendar(currentYear, currentMonth);
  var today = date.getDate();
  var weekFirstDay = new Date(currentYear, currentMonth - 1, 1).getDay();//该月的第一天是周几 
  // console.log(currentYear, currentMonth, weekFirstDay);
  var todaySpan = document.querySelectorAll('.calendar-body span')[weekFirstDay - 1 + today]

  todaySpan.style.backgroundColor = 'rgb(107,173,203)'
  todaySpan.style.color = '#fff'
}


//实现根据选择的日期，计算倒计时，并且每秒更新一次
function updateCountDown () {
  // your complement
  var countDown = document.querySelector('#countdown')
  countDown.innerHTML = '';

  var festivalName = document.createElement('div');
  festivalName.className = 'festival-name'
  festivalName.innerHTML = document.querySelector('#title').value;
  countDown.appendChild(festivalName)

  var timerDiv = document.createElement('div');
  timerDiv.className = 'timer';
  countDown.appendChild(timerDiv);

  var dayItem = document.createElement('div');
  var hourItem = document.createElement('div');
  var minuteItem = document.createElement('div');
  var secondItem = document.createElement('div');
  dayItem.className = 'timer-item';
  hourItem.className = 'timer-item';
  minuteItem.className = 'timer-item';
  secondItem.className = 'timer-item';

  // calTimeInterval(...)//不调用该函数会有1s延迟
  timerId = setInterval(calTimeInterval, 1000, dayItem, hourItem, minuteItem, secondItem, timerDiv)

}
function calTimeInterval (dayItem, hourItem, minuteItem, secondItem, timerDiv) {
  var selectDate = new Date(selectedYear, selectedMonth - 1, selectedDay)
  date = new Date();
  var interval = 0;

  if (selectDate < date) {
    //在当前日期之前，就展示现在到明年这个节日的倒计时
    interval = (new Date(selectedYear + 1, selectedMonth - 1, selectedDay) - date) / 1000
  } else {
    //在当前日期之之后，就展示现在到今年这个节日的倒计时
    interval = (selectDate - date) / 1000;
  }
  var day = padZero(parseInt(interval / 60 / 60 / 24))
  var hour = padZero(parseInt(interval / 60 / 60 % 24));
  var minute = padZero(parseInt(interval / 60 % 60));
  var second = parseInt(interval % 60);


  dayItem.innerHTML = "<div class='number'>" + day + "</div><div>DAYS</div>"
  hourItem.innerHTML = "<div class='number'>" + hour + "</div><div>HOURS</div>"
  minuteItem.innerHTML = "<div class='number'>" + minute + "</div><div>MINUTES</div>"
  secondItem.innerHTML = "<div class='number'>" + second + "</div><div>SECONDS</div>"
  timerDiv.appendChild(dayItem)
  timerDiv.appendChild(hourItem)
  timerDiv.appendChild(minuteItem)
  timerDiv.appendChild(secondItem)

  if (day === 0 && hour === 0 && minute === 0 && second === 0) {
    clearInterval(timerId)
  }
}





//编码一  ==============================================================================
//在页面中显示当前日期及时间，按秒更新
//2008 年 01 月 01 日星期一 03:02:02
// var main = document.querySelector('#main')
// setInterval(showTime, 1000)

function showTime () {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var day = getWeek(year + '-' + month + '-' + date);
  var hour = padZero(now.getHours());
  var minute = padZero(now.getMinutes());
  var second = padZero(now.getSeconds());
  var timeString = formatTime(year, month, date, day, hour, minute, second);
  main.innerHTML = timeString;
}

//根据某个日期返回这一天是星期几
//日期字符串（如：2022-05-02）
function getWeek (dateString) {
  let weeks = ['日', '一', '二', '三', '四', '五', '六']
  return weeks[new Date(dateString).getDay()]
}

//个位数的情况前面补充 0 ，补充为两位
function padZero (num) {
  return num < 10 ? '0' + num : num;
}

//把最后的日期时间，按照要求的格式进行包装
function formatTime (year, month, date, day, hour, minute, second) {
  return year + ' 年 ' + month + ' 月 ' + date + ' 日 ' + ' 星期' + day + ' ' + hour + ':' + minute + ':' + second
}

//判断某年某月的 1 号是星期几
function getFirstDayWeek (year, month) {
  let weeks = ['日', '一', '二', '三', '四', '五', '六']
  return weeks[new Date(year, month - 1, 1).getDay()]
}