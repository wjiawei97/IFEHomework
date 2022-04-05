//1. 鼠标经过，控制左右按钮的显示与隐藏
//2. 底部圆圈，控制图片切换
//3. 左右按钮，控制图片切换
//4. 自动播放

window.addEventListener('load', function () {
  //1.鼠标经过轮播图时，左右按钮显示，移出时隐藏
  var arrowL = document.querySelector('.arrow-l')
  var arrowR = document.querySelector('.arrow-r')
  var focus = document.querySelector('.focus')
  var ul = focus.querySelector('ul')

  focus.addEventListener('mouseenter', function () {
    arrowL.style.display = 'block'
    arrowR.style.display = 'block'
    //停止播放
    clearInterval(timer);
    timer = null;
  })
  focus.addEventListener('mouseleave', function () {
    arrowL.style.display = 'none'
    arrowR.style.display = 'none'
    timer = setInterval(function () {
      arrowR.click();
    }, 2000)
  })

  //2.1 动态生成底部圆圈
  var circle = document.querySelector('.circle');
  var imgLen = focus.querySelectorAll('li').length
  var focusWidth = focus.offsetWidth;
  for (let i = 0; i < imgLen; i++) {
    var newCircle = document.createElement('li')
    newCircle.setAttribute('index', i)
    circle.appendChild(newCircle)

    //2.2点击圆圈设置current类，其余圆圈无current
    newCircle.addEventListener('click', function () {
      for (let i = 0; i < imgLen; i++) {
        circle.children[i].className = ''
      }
      // this.className = 'current';
      var index = this.getAttribute('index');
      num = index; //点击小圆圈后把当前索引号赋值给num
      circleChange(circle, imgLen, num, 'current');
      //2.3点击小圆圈播放相应图片
      animate(ul, - focusWidth * index)
    })
  }

  // 把ol里面的第一个小li设置类名为 current
  circle.children[0].className = 'current';

  //3.点击左右切换按钮 图片切换
  var num = 0; //记录当前播放图片的索引
  // 复制第一个li,添加到ul最后
  var first = ul.children[0].cloneNode(true);
  ul.appendChild(first);

  arrowR.addEventListener('click', function () {
    //如果到了最后一张复制的第一个li图片，就让ul的left=0
    if (num === imgLen) {
      ul.style.left = 0;
      num = 0;
    }
    num++;
    animate(ul, -num * focusWidth);
    //图片切换时，底部圆圈跟着一起动
    circleChange(circle, imgLen, num, 'current');
  })

  arrowL.addEventListener('click', function () {
    if (num == 0) {
      num = imgLen;
      ul.style.left = -num * focusWidth + 'px'
    }
    num--;
    animate(ul, -focusWidth * num);
    circleChange(circle, imgLen, num, 'current');
  })

  //4.自动播放
  var timer = setInterval(function () {
    arrowR.click();
  }, 2000)
})


function circleChange (ele, imgLen, num, className) {
  for (let i = 0; i < imgLen; i++) {
    ele.children[i].className = '';
  }
  ele.children[num % imgLen].className = className;
}


function animate (element, target, callback) {
  // 先清除以前的定时器，只保留当前的一个定时器执行
  clearInterval(element.timer);
  element.timer = setInterval(function () {
    var step = (target - element.offsetLeft) / 10; //步长公式：（目标值-现在的位置）/10
    step = step > 0 ? Math.ceil(step) : Math.floor(step);

    if (element.offsetLeft === target) {
      //停止动画
      clearInterval(element.timer);
      callback && callback();
    }

    element.style.left = element.offsetLeft + step + 'px';
  }, 15)
}
