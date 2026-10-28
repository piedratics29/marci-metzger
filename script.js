/* Marci Metzger revamp — vanilla JS interactions.
   Every animation here is plain CSS + this small file:
   IntersectionObserver adds classes, CSS transitions do the rest. */

// ---------- 1. Navbar: glass background after scrolling ----------
const navbar = document.getElementById("navbar");
const onScrollNav = () => navbar.classList.toggle("scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScrollNav, { passive: true });
onScrollNav();

// ---------- 2. Mobile menu ----------
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
menuToggle.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("open");
  navbar.classList.toggle("menu-open", open);
  menuToggle.innerHTML = open ? "&times;" : "&#9776;";
});
mobileMenu.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    navbar.classList.remove("menu-open");
    menuToggle.innerHTML = "&#9776;";
  })
);

// ---------- 3. Hero parallax: map scroll position -> image movement ----------
const heroImg = document.getElementById("hero-img");
let ticking = false;
window.addEventListener(
  "scroll",
  () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        // same math as the React version: scroll 0-900px -> move 0-220px, zoom 1.08 -> 1.22
        const move = Math.min(y / 900, 1) * 220;
        const zoom = 1.08 + Math.min(y / 900, 1) * 0.14;
        heroImg.style.transform = `translateY(${move}px) scale(${zoom})`;
      }
      ticking = false;
    });
  },
  { passive: true }
);

// ---------- 4. Reveal on scroll (fade + slide up) ----------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.transitionDelay = (el.dataset.delay || 0) + "s";
        el.classList.add("visible");
        revealObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll("[data-reveal]").forEach((el) => revealObserver.observe(el));

// ---------- 5. Animated counters ----------
const easeOut = (t) => 1 - Math.pow(1 - t, 4);
const runCounter = (el) => {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const duration = 2000;
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = (target * easeOut(p)).toFixed(decimals);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll("[data-count]").forEach((el) => counterObserver.observe(el));

// ---------- 6. Gallery filters ----------
const filterBtns = document.querySelectorAll(".filter-btn");
const bentoItems = document.querySelectorAll(".bento-item");
filterBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    bentoItems.forEach((item) => {
      item.classList.toggle("hidden", f !== "all" && item.dataset.cat !== f);
    });
  })
);

// ---------- 7. Lightbox ----------
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxTag = document.getElementById("lightbox-tag");
bentoItems.forEach((item) =>
  item.addEventListener("click", () => {
    lightboxImg.src = item.querySelector("img").src;
    lightboxImg.alt = item.dataset.title;
    lightboxTitle.textContent = item.dataset.title;
    lightboxTag.textContent = item.dataset.tag;
    lightbox.classList.add("open");
  })
);
const closeLightbox = () => lightbox.classList.remove("open");
document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

// ---------- 8. Contact form ----------
// DEMO: submits to a placeholder endpoint. For real email delivery on static
// hosting, sign up free at https://formspree.io, get your endpoint, and replace
// FORM_ENDPOINT below (e.g. "https://formspree.io/f/abcdwxyz").
const FORM_ENDPOINT = "";
const form = document.getElementById("contact-form");
const sendBtn = document.getElementById("send-btn");
const formStatus = document.getElementById("form-status");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!FORM_ENDPOINT) {
    formStatus.textContent =
      "Demo mode: connect a free Formspree endpoint in script.js to receive messages. Or call 206-919-6886.";
    return;
  }
  sendBtn.disabled = true;
  sendBtn.textContent = "Sending…";
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    if (!res.ok) throw new Error();
    form.reset();
    formStatus.textContent = "Message sent — Marci's team will be in touch shortly.";
  } catch {
    formStatus.textContent = "Could not send. Please call 206-919-6886.";
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = "Send Message";
  }
});


const navLinks = document.querySelectorAll(
  '.nav-links > a:not(.btn), #mobile-menu a:not(.btn)'
);

const sections = document.querySelectorAll(
  '#home, #about, #listings, #services, #contact'
);

function setActiveLink(id) {
  navLinks.forEach(link => {
    const target = link.getAttribute('href');

    link.classList.toggle(
      'active',
      target === `#${id}`
    );
  });
}

// Automatically update active links while scrolling
const observer = new IntersectionObserver(
  entries => {
    const visibleSections = [...entries]
      .filter(entry => entry.isIntersecting)
      .sort(
        (a, b) =>
          b.intersectionRatio - a.intersectionRatio
      );

    if (visibleSections.length > 0) {
      setActiveLink(visibleSections[0].target.id);
    }
  },
  {
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  }
);


// active link for each section when it is in view
sections.forEach(section => observer.observe(section));

// Remove active state when the footer is reached
const footer = document.querySelector('footer');

if (footer) {
  const footerObserver = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) {
        navLinks.forEach(link =>
          link.classList.remove('active')
        );
      }
    },
    {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0
    }
  );

  footerObserver.observe(footer);
}

// scroll button functionality
const scrollBtn = document.getElementById('scroll-btn');
const scrollIcon = document.getElementById('scroll-icon');

function updateScrollButton() {
  const scrollY = window.scrollY;
  const pageHeight = document.documentElement.scrollHeight;
  const viewportHeight = window.innerHeight;

  const hasScrolled = scrollY > 100;
  const atBottom =
    scrollY + viewportHeight >= pageHeight - 10;

  // Hide at the top; show after scrolling down
  scrollBtn.classList.toggle('visible', hasScrolled);

  if (atBottom) {
    // Show UP arrow at the bottom
    scrollIcon.innerHTML =
      '<path d="M12 19V5M5 12l7-7 7 7" />';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    scrollBtn.title = 'Scroll to top';
  } else {
    // Show DOWN arrow everywhere else
    scrollIcon.innerHTML =
      '<path d="M12 5v14M19 12l-7 7-7-7" />';
    scrollBtn.setAttribute('aria-label', 'Scroll to bottom');
    scrollBtn.title = 'Scroll to bottom';
  }
}

scrollBtn.addEventListener('click', () => {
  const pageHeight = document.documentElement.scrollHeight;
  const viewportHeight = window.innerHeight;

  const atBottom =
    window.scrollY + viewportHeight >= pageHeight - 10;

  window.scrollTo({
    top: atBottom ? 0 : pageHeight,
    behavior: 'smooth'
  });
});

window.addEventListener('scroll', updateScrollButton);
window.addEventListener('resize', updateScrollButton);

updateScrollButton();

