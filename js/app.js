/* --- START OF FILE app.js --- */

document.addEventListener("DOMContentLoaded", () => {
    
    // ------------------------------------------------
    // 1. Lenis 平滑滚动 & 返回顶部 (Back To Top)
    // ------------------------------------------------
    let lenis; 

    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({ 
            duration: 1.2, 
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
            smooth: true 
        });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
    }

    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            if (lenis) {
                lenis.scrollTo(0); 
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }
        });
    }

    // ------------------------------------------------
    // 2. 手机端菜单逻辑 (Mobile Menu) - 彻底恢复原始逻辑
    // ------------------------------------------------
    const menuToggle = document.getElementById('menuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // 点击右上角 Menu 按钮打开
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
        });
    }

    // 点击 Close 按钮关闭
    if (closeMenu && mobileMenu) {
        closeMenu.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    }

    // 点击菜单内的链接自动关闭
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu) mobileMenu.classList.remove('active');
        });
    });
    
    // 3. 通用跑马灯加载函数 (兼容 Safari)
    // ------------------------------------------------
    async function setupMarquee(trackId, prefix, speed = 20) {
        const track = document.getElementById(trackId);
        if (!track) return;

        try {
            const apiUrl = `https://api1.hyeri.us.kg?prefix=${prefix}`;
            const res = await fetch(apiUrl);
            const data = await res.json();
            
            if (data.success && data.images.length > 0) {
                const imgHtml = data.images.map(src => `
                    <div class="marquee-item"><img src="${src}" alt=""></div>
                `).join('');
                
                // 复制3组确保无缝循环
                track.innerHTML = imgHtml + imgHtml + imgHtml;

                // 等待图片加载后启动动画，防止 Safari 跳动
                let loadedCount = 0;
                const allImgs = track.querySelectorAll('img');
                const startAnimation = () => {
                    loadedCount++;
                    if (loadedCount >= allImgs.length) {
                        track.style.animation = `marquee-scroll ${speed}s linear infinite`;
                    }
                };

                allImgs.forEach(img => {
                    if (img.complete) startAnimation();
                    else img.onload = startAnimation;
                });
            }
        } catch (e) { console.error("Marquee Error:", e); }
    }

    // 执行首页底部跑马灯加载
    // 参数：元素ID, 路径前缀, 滚动秒数(越小越快)
    setupMarquee('indexMarqueeTrack', 'marquee/', 10); 
    // ------------------------------------------------
    // 4. 首页作品列表悬浮图片特效 (Work Hover Reveal)
    // ------------------------------------------------
    const workItems = document.querySelectorAll('.work-item');
    const hoverReveal = document.querySelector('.hover-reveal');
    const hiddenImg = document.querySelector('.hidden-img');

    if (workItems.length > 0 && hoverReveal && hiddenImg && typeof gsap !== 'undefined') {
        gsap.set(hoverReveal, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.8 });

        workItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const imgSrc = item.getAttribute('data-img');
                if (imgSrc) {
                    hiddenImg.src = imgSrc;
                    gsap.to(hoverReveal, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "power2.out", overwrite: 'auto' });
                }
            });
            item.addEventListener('mouseleave', () => {
                gsap.to(hoverReveal, { autoAlpha: 0, scale: 0.8, duration: 0.3, overwrite: 'auto' });
            });
            item.addEventListener('mousemove', (e) => {
                gsap.to(hoverReveal, { x: e.clientX, y: e.clientY, duration: 0.2, ease: "power1.out" });
            });
        });
    }

    // ------------------------------------------------
    // 5. 画廊跑马灯初始化 (仅在有该元素的页面执行)
    // ------------------------------------------------
    if (typeof loadMarqueeImages === 'function' && document.getElementById('marqueeTrack')) {
        loadMarqueeImages();
    }
});
