document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. 简单的平滑滚动 (保留 Lenis) ---
    // 如果 Lenis 没加载成功，这部分会自动忽略，不会报错
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({ duration: 1.2, smooth: true });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
    }

    // --- 2. 简单的光标跟随 (原生 JS) ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (cursorDot && cursorOutline) {
        window.addEventListener("mousemove", (e) => {
            const x = e.clientX;
            const y = e.clientY;
            
            // 圆点直接跟随
            cursorDot.style.left = `${x}px`;
            cursorDot.style.top = `${y}px`;
            
            // 圆圈加一点延迟动画
            cursorOutline.animate({
                left: `${x}px`,
                top: `${y}px`
            }, { duration: 500, fill: "forwards" });
        });
    }

    // --- 3. ★★★ 核心修复：作品图片悬浮 ★★★ ---
    const workItems = document.querySelectorAll('.work-item');
    const hoverReveal = document.querySelector('.hover-reveal');
    const hiddenImg = document.querySelector('.hidden-img');

    // 检查元素是否存在，如果不存在就在控制台报错
    if (!hoverReveal || !hiddenImg) {
        console.error("错误：找不到 .hover-reveal 或 .hidden-img 元素！请检查 HTML。");
        return;
    }

    workItems.forEach(item => {
        // 鼠标移入
        item.addEventListener('mouseenter', (e) => {
            const imgSrc = item.getAttribute('data-img');
            // 只有当链接存在时才显示
            if (imgSrc) {
                hiddenImg.src = imgSrc;
                
                // 强制显示 (不依赖 GSAP)
                hoverReveal.style.opacity = '1';
                hoverReveal.style.visibility = 'visible';
                hoverReveal.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        });

        // 鼠标移出
        item.addEventListener('mouseleave', () => {
            // 强制隐藏
            hoverReveal.style.opacity = '0';
            hoverReveal.style.visibility = 'hidden';
            hoverReveal.style.transform = 'translate(-50%, -50%) scale(0.8)';
        });

        // 鼠标移动
        item.addEventListener('mousemove', (e) => {
            // 图片跟随鼠标
            hoverReveal.style.left = `${e.clientX}px`;
            hoverReveal.style.top = `${e.clientY}px`;
        });
    });
});