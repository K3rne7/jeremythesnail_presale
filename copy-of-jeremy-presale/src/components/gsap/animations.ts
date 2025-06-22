import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export const animateHeroText = (textElements: gsap.TweenTarget) => {
  gsap.from(textElements, {
    duration: 1,
    y: 50,
    opacity: 0,
    stagger: 0.2,
    ease: 'power3.out',
    delay: 0.5,
  });
};

export const animateElementOnScroll = (element: gsap.TweenTarget, vars?: gsap.TweenVars) => {
  gsap.from(element, {
    scrollTrigger: {
      trigger: element as gsap.DOMTarget, // Cast to DOMTarget
      start: 'top 80%', // When top of element hits 80% of viewport height
      toggleActions: 'play none none none', // Play animation once
    },
    duration: 1,
    y: 100,
    opacity: 0,
    ease: 'power3.out',
    ...vars,
  });
};

export const createParallax = (element: gsap.TweenTarget, strength: number = 0.2) => {
  gsap.to(element, {
    yPercent: -strength * 100,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body, // or a specific container
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
};

export const animateRoadmapTimeline = (timelineItems: gsap.TweenTarget) => {
  gsap.utils.toArray(timelineItems).forEach((item, index) => {
    gsap.from(item as gsap.TweenTarget, {
      scrollTrigger: {
        trigger: item as gsap.DOMTarget, // Cast to DOMTarget
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      x: index % 2 === 0 ? -100 : 100,
      duration: 0.8,
      ease: 'power3.out',
    });
  });
};

export const animateCardFlip = (cardElement: HTMLElement) => {
  // This is a simplified example. Real card flips might involve more complex structure.
  // Assumes a card structure like: <div class="card"><div class="card-front">...</div><div class="card-back">...</div></div>
  const front = cardElement.querySelector('.card-front');
  const back = cardElement.querySelector('.card-back');
  if (!front || !back) return;

  gsap.set(back, { rotationY: -180, opacity: 0 }); // Initially hide back

  cardElement.addEventListener('mouseenter', () => {
    gsap.to(front, { duration: 0.5, rotationY: 180, opacity: 0, ease: 'power2.inOut' });
    gsap.to(back, { duration: 0.5, rotationY: 0, opacity: 1, ease: 'power2.inOut' });
  });

  cardElement.addEventListener('mouseleave', () => {
    gsap.to(front, { duration: 0.5, rotationY: 0, opacity: 1, ease: 'power2.inOut' });
    gsap.to(back, { duration: 0.5, rotationY: -180, opacity: 0, ease: 'power2.inOut' });
  });
};


export const animateBackgroundGradient = (element: gsap.TweenTarget) => {
  // This uses Tailwind's animation 'gradient-bg' defined in tailwind.config.js & index.html
  // So, GSAP might not be needed if CSS animation is sufficient.
  // If GSAP control is desired:
  gsap.to(element, {
    duration: 15,
    backgroundPosition: "-200% 50%", // Example to shift gradient
    ease: "linear",
    repeat: -1,
    yoyo: true // if you want it to go back and forth
  });
};

export const animateSnailPath = (snailElement: gsap.TweenTarget, pathElement: SVGPathElement) => {
  if (!snailElement || !pathElement) return;
  gsap.to(snailElement, {
    duration: 10,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
    motionPath: {
      path: pathElement,
      align: pathElement as Element, // Cast to Element as per error msg requirement
      alignOrigin: [0.5, 0.5],
      autoRotate: true
    }
  });
};