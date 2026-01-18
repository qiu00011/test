/* --- START OF FILE app.js --- */

document.addEventListener("DOMContentLoaded", () => {
    
    // ------------------------------------------------
    // 1. Lenis 平滑滚动 & 返回顶部 (Back To Top)
    // ------------------------------------------------
    let lenis; // 定义在外部，供后面调用

    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({ 
            duration: 1.2, 
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
            smooth: true 
        });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
    }

    // --- Back To Top 逻辑 ---
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        // 监听滚动：超过 500px 显示按钮
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        // 点击事件：平滑回到顶部
        backToTopBtn.addEventListener('click', () => {
            if (lenis) {
                lenis.scrollTo(0); // 使用 Lenis 的丝滑滚动
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' }); // 降级方案
            }
        });
    }

    // ------------------------------------------------
    // 2. 手机端菜单逻辑 (Mobile Menu) - ★★★ 修复重点在此
    // ------------------------------------------------
    const menuToggle = document.getElementById('menuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (menuToggle && mobileMenu && closeMenu) {
        // 打开菜单
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
        });

        // 关闭菜单 (点击 Close 按钮)
        closeMenu.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });

        // 点击链接自动关闭菜单
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
    }

    // ------------------------------------------------
    // 3. GSAP 鼠标光标 (Custom Cursor)
    // ------------------------------------------------
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline && typeof gsap !== 'undefined') {
        // 初始隐藏
        gsap.set([cursorDot, cursorOutline], { xPercent: -50, yPercent: -50, opacity: 0 });
        
        const setDot = gsap.quickSetter(cursorDot, "css", "transform");
        
        window.addEventListener("mousemove", (e) => {
            gsap.to([cursorDot, cursorOutline], { opacity: 1, duration: 0.2, overwrite: 'auto' });
            setDot({ x: e.clientX, y: e.clientY });
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
    // 4. 首页作品列表悬浮图片特效 (Work Hover Reveal)
    // ------------------------------------------------
    const workItems = document.querySelectorAll('.work-item');
    const hoverReveal = document.querySelector('.hover-reveal');
    const hiddenImg = document.querySelector('.hidden-img');

    if (workItems.length > 0 && hoverReveal && hiddenImg && typeof gsap !== 'undefined') {
        
        gsap.set(hoverReveal, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.8 });

        workItems.forEach(item => {
            // 移入
            item.addEventListener('mouseenter', () => {
                const imgSrc = item.getAttribute('data-img');
                if (imgSrc) {
                    hiddenImg.src = imgSrc;
                    gsap.to(hoverReveal, { 
                        autoAlpha: 1, scale: 1, duration: 0.3, ease: "power2.out", overwrite: 'auto' 
                    });
                }
            });

            // 移出
            item.addEventListener('mouseleave', () => {
                gsap.to(hoverReveal, { 
                    autoAlpha: 0, scale: 0.8, duration: 0.3, overwrite: 'auto' 
                });
            });

            // 移动
            item.addEventListener('mousemove', (e) => {
                gsap.to(hoverReveal, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.2,
                    ease: "power1.out"
                });
            });
        });
    }
});
