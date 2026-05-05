# 主页面滑动功能使用说明

## 📁 修改的文件
- `index.html` - 主页面改为可左右滑动的结构
- `style.css` - 滑动区域样式（确保不覆盖顶部 header）
- `js/slider.js` - 滑动功能的 JavaScript 代码

## 🎨 如何自定义内容

### 1. 修改滑动页面内容（index.html）
找到 `<section class="myself slider-item">` 部分，可以：
- 修改每页的标题（h2）、副标题（h3）、文字（p）
- 添加图片：`<img src="image/xxx.jpg" alt="描述">`
- 添加链接：`<a href="链接地址">文字</a>`
- 增加或删除页面（复制/删除整个 `<section class="myself slider-item">...</section>`）

**示例：添加第4页**
```html
<section class="myself slider-item">
    <h2>第四页标题</h2>
    <h3>副标题</h3>
    <p>内容描述</p>
</section>
```

### 2. 调整样式（style.css）

#### 整体区域设置：
```css
.myself-slider {
    height: 100vh;            /* 全屏高度 */
    padding-top: 100px;       /* 为顶部 header 预留空间（header高度）*/
}
```

#### 单个页面样式：
```css
.myself {
    background: linear-gradient(...), url(image/Myself.jpeg);  /* 背景图片和渐变 */
    background-size: cover;   /* 背景尺寸 */
}

.myself h2 {
    font-size: clamp(35px,5vw,80px);  /* 主标题大小 */
}

.myself h3 {
    font-size: clamp(20px,2.5vw,60px);  /* 副标题大小 */
}

.myself p {
    font-size: clamp(10px,1vw,20px);    /* 段落文字大小 */
}
```

#### 按钮样式：
```css
.slider-btn {
    width: 60px;              /* 按钮大小 */
    height: 60px;
    background: rgba(0, 0, 0, 0.5);  /* 背景色（半透明黑）*/
    font-size: 36px;          /* 箭头大小 */
}

.slider-btn-left {
    left: 20px;               /* 左按钮位置 */
}

.slider-btn-right {
    right: 20px;              /* 右按钮位置 */
}
```

#### 指示器样式：
```css
.slider-dots {
    bottom: 30px;             /* 距离底部距离 */
}

.slider-dot {
    width: 10px;              /* 点的大小 */
    background: rgba(255, 255, 255, 0.5);  /* 默认颜色（半透明白）*/
}

.slider-dot.active {
    background: white;        /* 激活颜色（纯白）*/
    width: 30px;              /* 激活时长度 */
}
```

### 3. 功能配置（js/slider.js）

在文件开头找到 `CONFIG` 对象：

```javascript
const CONFIG = {
    autoPlayDelay: 0,        // 自动播放延迟
                             // 0 = 禁用
                             // 3000 = 每3秒自动切换
                             
    swipeThreshold: 50,      // 滑动灵敏度（像素）
                             // 数字越小越灵敏
                             
    enableLoop: false,       // 是否循环播放
                             // true = 最后一页后回到第一页
                             // false = 到头停止
};
```

## 🎯 功能特性

✅ 左右按钮点击切换  
✅ 鼠标拖拽滑动  
✅ 触摸滑动（移动端）  
✅ 键盘方向键导航  
✅ 指示器点击跳转  
✅ 可选自动播放  
✅ 响应式设计  
✅ 平滑动画效果  

## 📱 移动端优化

移动端会自动调整：
- 按钮变小（40x40px）
- 内边距减小
- 支持触摸滑动

如需在移动端隐藏按钮（只用触摸），在 CSS 中取消注释：
```css
@media (max-width: 768px) {
    .slider-btn { display: none; }
}
```

## 🔧 常见修改示例

### 改变滑动方向为垂直
需要修改 CSS 中的 `flex-direction` 和 `transform` 属性，以及 JS 中的计算逻辑。

### 一次显示多个项目
修改 `.slider-item` 的 `min-width` 为 `50%`（显示2个）或 `33.33%`（显示3个）

### 添加淡入淡出效果
在 `.slider-item` 中添加 `transition: opacity 0.4s;`

## 🚀 快速测试

刷新页面后应该看到：
1. 一个滑动区域
2. 左右两个圆形按钮
3. 底部的指示器点点
4. 可以点击按钮、拖拽或触摸来切换页面

---

💡 提示：所有可自定义的地方都有中文注释标注！
