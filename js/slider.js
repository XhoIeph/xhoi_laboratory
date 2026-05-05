/**
 * 页面滑动功能
 * 支持：左右按钮点击、指示器点击、鼠标拖拽、触摸滑动
 */

document.addEventListener('DOMContentLoaded', () => {
  // ========== 配置参数 - 可自定义 ==========
  const CONFIG = {
    autoPlayDelay: 0,        // 自动播放延迟（毫秒）0=禁用自动播放，建议：3000-5000
    swipeThreshold: 50,      // 滑动触发阈值（像素）- 滑动超过此距离才切换页面
    enableLoop: false,       // 是否循环播放（到最后一页后回到第一页）
  };

  // ========== 获取 DOM 元素 ==========
  const wrapper = document.querySelector('.slider-wrapper');
  const track = document.querySelector('.slider-track');
  const items = document.querySelectorAll('.slider-item');
  const btnLeft = document.querySelector('.slider-btn-left');
  const btnRight = document.querySelector('.slider-btn-right');
  const dotsContainer = document.querySelector('.slider-dots');

  // 检查必要元素是否存在
  if (!track || items.length === 0) return;

  // ========== 状态变量 ==========
  let currentIndex = 0;              // 当前显示的页面索引（0开始）
  let isDragging = false;            // 是否正在拖拽
  let startPos = 0;                  // 拖拽开始位置
  let currentTranslate = 0;          // 当前偏移量
  let prevTranslate = 0;             // 上次偏移量
  let animationID = null;            // 动画帧ID
  let autoPlayTimer = null;          // 自动播放定时器

  // ========== 初始化指示器点点 ==========
  function initDots() {
    dotsContainer.innerHTML = '';    // 清空容器
    items.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot';
      dot.setAttribute('aria-label', `跳转到第 ${index + 1} 页`);
      if (index === 0) dot.classList.add('active');
      
      // 点击指示器跳转
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  }

  // ========== 更新指示器状态 ==========
  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  // ========== 更新按钮状态 ==========
  function updateButtons() {
    if (!btnLeft || !btnRight) return;
    
    // 如果不循环播放，首页禁用左按钮，末页禁用右按钮
    if (!CONFIG.enableLoop) {
      btnLeft.disabled = currentIndex === 0;
      btnRight.disabled = currentIndex === items.length - 1;
    } else {
      btnLeft.disabled = false;
      btnRight.disabled = false;
    }
  }

  // ========== 跳转到指定页面 ==========
  function goToSlide(index) {
    // 边界处理
    if (CONFIG.enableLoop) {
      if (index < 0) index = items.length - 1;
      if (index >= items.length) index = 0;
    } else {
      index = Math.max(0, Math.min(index, items.length - 1));
    }

    currentIndex = index;
    
    // 3D视角移动效果 - 页面本身不旋转，只改变观察视角
    const offset = -currentIndex * 100;      // 水平偏移百分比
    
    // 计算视角原点位置 - 视角跟随页面移动，产生立体透视效果
    const perspectiveX = 50 + currentIndex * 8; // 每切换一页，视角向右偏移8%
    const perspectiveY = 50; // 垂直方向保持居中
    
    // 只平移页面，不旋转
    track.style.transform = `translateX(${offset}%)`;
    
    // 改变视角原点，产生3D观察角度变化
    wrapper.style.perspectiveOrigin = `${perspectiveX}% ${perspectiveY}%`;
    
    updateDots();
    updateButtons();
    resetAutoPlay();                     // 重置自动播放
  }

  // ========== 上一页 ==========
  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  // ========== 下一页 ==========
  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  // ========== 鼠标/触摸拖拽功能 ==========
  
  // 拖拽开始
  function dragStart(event) {
    isDragging = true;
    startPos = getPositionX(event);
    animationID = requestAnimationFrame(animation);
    track.classList.add('dragging');
  }

  // 拖拽中
  function dragMove(event) {
    if (!isDragging) return;
    const currentPosition = getPositionX(event);
    currentTranslate = prevTranslate + currentPosition - startPos;
  }

  // 拖拽结束
  function dragEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);
    track.classList.remove('dragging');

    const movedBy = currentTranslate - prevTranslate;

    // 判断是否达到滑动阈值
    if (movedBy < -CONFIG.swipeThreshold && currentIndex < items.length - 1) {
      nextSlide();
    } else if (movedBy > CONFIG.swipeThreshold && currentIndex > 0) {
      prevSlide();
    } else {
      goToSlide(currentIndex);  // 回到当前页
    }

    prevTranslate = -currentIndex * track.offsetWidth;
  }

  // 获取触摸/鼠标位置
  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }

  // 动画帧更新
  function animation() {
    if (isDragging) {
      track.style.transform = `translateX(${currentTranslate}px)`;
      requestAnimationFrame(animation);
    }
  }

  // ========== 自动播放 ==========
  function startAutoPlay() {
    if (CONFIG.autoPlayDelay <= 0) return;  // 如果延迟为0，不启用自动播放
    
    autoPlayTimer = setInterval(() => {
      if (CONFIG.enableLoop || currentIndex < items.length - 1) {
        nextSlide();
      } else {
        stopAutoPlay();  // 到最后一页停止自动播放
      }
    }, CONFIG.autoPlayDelay);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  // ========== 事件监听 ==========
  
  // 按钮点击
  if (btnLeft) btnLeft.addEventListener('click', prevSlide);
  if (btnRight) btnRight.addEventListener('click', nextSlide);

  // 鼠标拖拽事件已禁用 - 只能通过按钮切换
  // track.addEventListener('mousedown', dragStart);
  // track.addEventListener('mousemove', dragMove);
  // track.addEventListener('mouseup', dragEnd);
  // track.addEventListener('mouseleave', dragEnd);

  // 触摸拖拽事件已禁用 - 移动端也只能通过按钮切换
  // track.addEventListener('touchstart', dragStart);
  // track.addEventListener('touchmove', dragMove);
  // track.addEventListener('touchend', dragEnd);

  // 键盘导航
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  // 窗口尺寸变化时重置位置
  window.addEventListener('resize', () => {
    goToSlide(currentIndex);
  });

  // ========== 初始化 ==========
  initDots();
  updateButtons();
  startAutoPlay();  // 如果配置了自动播放，这里会启动

  // 鼠标悬停时暂停自动播放
  if (track) {
    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('mouseleave', startAutoPlay);
  }
});
