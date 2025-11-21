/* --- START OF FILE app.js --- */

document.addEventListener("DOMContentLoaded", () => {
    
    // ------------------------------------------------
    // 1. Lenis 平滑滚动 (所有页面通用)
    // ------------------------------------------------
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({ 
            duration: 1.2, 
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
            smooth: true 
        });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
    }
        function getSlideWidth() {
    return track.parentElement.offsetWidth;
}

function updateTrack() {
    track.style.transition = 'transform 0.8s cubic-bezier(0.2, 1, 0.3, 1)';
    const slideWidth = getSlideWidth();
    track.style.transform = `translate3d(-${currentSlide * slideWidth}px, 0, 0)`;
}

    // --- 4. 手机菜单逻辑 ---
    const menuToggle = document.getElementById('menuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (menuToggle && mobileMenu && closeMenu) {
        // 打开菜单
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            // 如果你想停止背景滚动，可以加: document.body.style.overflow = 'hidden';
        });

        // 关闭菜单 (点击 Close 按钮)
        closeMenu.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            // document.body.style.overflow = '';
        });

        // 点击任何一个链接后，自动关闭菜单 (体验更好)
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
    }

    // ------------------------------------------------
    // 2. GSAP 鼠标光标 (所有页面通用)
    // ------------------------------------------------
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline && typeof gsap !== 'undefined') {
        // 初始隐藏
        gsap.set([cursorDot, cursorOutline], { xPercent: -50, yPercent: -50, opacity: 0 });
        
        // 性能优化：使用 quickSetter
        const setDot = gsap.quickSetter(cursorDot, "css", "transform");
        
        window.addEventListener("mousemove", (e) => {
            gsap.to([cursorDot, cursorOutline], { opacity: 1, duration: 0.2, overwrite: 'auto' });
            
            // 实心点：瞬间跟随
            setDot({ x: e.clientX, y: e.clientY });
            
            // 空心圈：平滑延迟
            gsap.to(cursorOutline, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.15,
                ease: "power2.out"
            });
        });

        document.addEventListener("mouseleave", () => {
            gsap.to([cursorDot, cursorOutline], { opacity: 0, duration: 0.2 });
        });
    }

    // ------------------------------------------------
    // 3. 首页作品悬浮图片特效 (Work Item Hover)
    // ------------------------------------------------
    const workItems = document.querySelectorAll('.work-item');
    const hoverReveal = document.querySelector('.hover-reveal');
    const hiddenImg = document.querySelector('.hidden-img');

    // 只有当页面上存在这些元素时才运行 (防止 Gallery 页报错)
    if (workItems.length > 0 && hoverReveal && hiddenImg && typeof gsap !== 'undefined') {
        
        // 初始状态
        gsap.set(hoverReveal, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.8 });

        workItems.forEach(item => {
            // 鼠标移入：显示图片
            item.addEventListener('mouseenter', () => {
                const imgSrc = item.getAttribute('data-img');
                if (imgSrc) {
                    hiddenImg.src = imgSrc;
                    gsap.to(hoverReveal, { 
                        autoAlpha: 1, 
                        scale: 1, 
                        duration: 0.3, 
                        ease: "power2.out",
                        overwrite: 'auto' 
                    });
                }
            });

            // 鼠标移出：隐藏图片
            item.addEventListener('mouseleave', () => {
                gsap.to(hoverReveal, { 
                    autoAlpha: 0, 
                    scale: 0.8, 
                    duration: 0.3, 
                    overwrite: 'auto' 
                });
            });

            // 鼠标移动：图片跟随
            item.addEventListener('mousemove', (e) => {
                // 因为 hoverReveal 是 fixed 定位，直接用 clientX/Y
                gsap.to(hoverReveal, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.2, // 稍微有点延迟，更有质感
                    ease: "power1.out"
                });
            });
        });
    }
});