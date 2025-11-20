document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Lenis 平滑滚动
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    gsap.registerPlugin(ScrollTrigger);

    // 2. 自定义光标跟随
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    window.addEventListener("mousemove", (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        gsap.to(cursorOutline, {
            x: posX, y: posY, duration: 0.15, ease: "power2.out"
        });
    });

    // 3. 预加载动画
    const tl = gsap.timeline();
    tl.to(".preloader-text span", { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" })
      .to(".preloader", { y: "-100%", duration: 1, delay: 0.5, ease: "power4.inOut" })
      .from(".hero-title .line", { y: 100, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out" }, "-=0.5");

    // 4. 首页：作品列表悬浮图片显示 (Work List Hover)
    const workItems = document.querySelectorAll('.work-item');
    const hoverReveal = document.querySelector('.hover-reveal');
    const hiddenImg = document.querySelector('.hidden-img');

    workItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const imgSrc = item.getAttribute('data-img');
            if(imgSrc) {
                hiddenImg.src = imgSrc;
                gsap.to(hoverReveal, { opacity: 1, visibility: 'visible', scale: 1, duration: 0.3 });
            }
        });
        item.addEventListener('mouseleave', () => {
            gsap.to(hoverReveal, { opacity: 0, scale: 0.8, duration: 0.3 });
        });
        item.addEventListener('mousemove', (e) => {
            gsap.to(hoverReveal, { x: e.clientX, y: e.clientY, duration: 0.5, ease: "power2.out" });
        });
    });

    // 5. 视差效果
    const parallaxImages = document.querySelectorAll('.bio-image img');
    parallaxImages.forEach(img => {
        gsap.to(img, {
            yPercent: 20, ease: "none",
            scrollTrigger: {
                trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true
            }
        });
    });

    // 6. 头部隐藏/显示
    let lastScroll = 0;
    const header = document.querySelector('.fixed-header');
    window.addEventListener('scroll', () => {
        const current = window.pageYOffset;
        if(current <= 0) { header.style.transform = "translateY(0)"; return; }
        if(current > lastScroll && current > 100) { header.style.transform = "translateY(-100%)"; }
        else { header.style.transform = "translateY(0)"; }
        lastScroll = current;
    });
});