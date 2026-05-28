/**
 * Aura & Bloom - Artisanal Wax Sachets Website Engine
 * Core Logic: Dynamic Canvas Botanicals, Customizer, Carousel, Accordion, and Revealer
 */

// --- FIREBASE CONFIGURATION & INITIALIZATION ---
// TODO: Replace this object with your actual Firebase config from the Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID_HERE"
};

let db = null;
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
} else {
  console.warn("Firebase SDK not loaded. Operating in Demo Mode.");
}

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. DECORATIVE FLOATING BOTANICALS CANVAS ENGINE ---
  const canvas = document.getElementById('petal-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const maxParticles = 25; // Keep it low for elegant subtleness & high performance
    
    // Resize handler
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Mouse tracking for soft deflection
    let mouse = { x: -1000, y: -1000, radius: 120 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });
    
    // Particle Class
    class BotanicalParticle {
      constructor() {
        this.reset(true);
      }
      
      reset(init = false) {
        this.x = Math.random() * canvas.width;
        this.y = init ? Math.random() * canvas.height : -50;
        this.size = Math.random() * 12 + 6; // Size between 6px and 18px
        this.speedY = Math.random() * 0.6 + 0.4; // Very slow drift
        this.speedX = Math.random() * 0.4 - 0.2;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = Math.random() * 0.01 - 0.005;
        this.swing = Math.random() * 0.02 + 0.01; // Left-right swing frequency
        this.swingWidth = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.4 + 0.2; // Soft translucent values
        
        // Pick particle type: 0 = Eucalyptus Leaf (green), 1 = Rose Petal (terracotta), 2 = Gold Flake (gold)
        const rand = Math.random();
        if (rand < 0.45) {
          this.type = 'leaf';
          this.color = `hsla(140, ${Math.floor(Math.random() * 10 + 8)}%, ${Math.floor(Math.random() * 10 + 35)}%, ${this.opacity})`;
        } else if (rand < 0.85) {
          this.type = 'petal';
          this.color = `hsla(12, ${Math.floor(Math.random() * 15 + 30)}%, ${Math.floor(Math.random() * 10 + 60)}%, ${this.opacity})`;
        } else {
          this.type = 'gold';
          this.color = `hsla(42, 60%, 65%, ${this.opacity + 0.1})`;
        }
      }
      
      update() {
        // Normal gravity & drift movement
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y * this.swing) * this.swingWidth;
        this.angle += this.spin;
        
        // Soft Mouse Deflection
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const forceX = (dx / dist) * force * 1.5;
          const forceY = (dy / dist) * force * 1.5;
          this.x += forceX;
          this.y += forceY;
        }
        
        // Boundary reset
        if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
          this.reset(false);
        }
      }
      
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        
        ctx.beginPath();
        if (this.type === 'leaf') {
          // Double pointed oval shape for leaves
          ctx.moveTo(0, -this.size);
          ctx.quadraticCurveTo(this.size * 0.6, 0, 0, this.size);
          ctx.quadraticCurveTo(-this.size * 0.6, 0, 0, -this.size);
        } else if (this.type === 'petal') {
          // Tear-drop petal shape
          ctx.moveTo(0, -this.size * 0.7);
          ctx.bezierCurveTo(this.size * 0.7, -this.size * 0.7, this.size * 0.7, this.size * 0.4, 0, this.size);
          ctx.bezierCurveTo(-this.size * 0.7, this.size * 0.4, -this.size * 0.7, -this.size * 0.7, 0, -this.size * 0.7);
        } else {
          // Irregular gold foil flecks
          ctx.moveTo(-this.size * 0.4, -this.size * 0.4);
          ctx.lineTo(this.size * 0.3, -this.size * 0.5);
          ctx.lineTo(this.size * 0.5, this.size * 0.2);
          ctx.lineTo(-this.size * 0.2, this.size * 0.4);
          ctx.closePath();
        }
        ctx.fill();
        ctx.restore();
      }
    }
    
    // Spawn particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new BotanicalParticle());
    }
    
    // Main animation loop
    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    };
    animateParticles();
  }

  // --- 2. HEADER NAVIGATION ADJUSTMENTS ---
  const header = document.querySelector('header');
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
  
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      menuToggle.classList.toggle('active');
    });
    
    // Close nav when clicking a link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuToggle.classList.remove('active');
      });
    });
  }

  // --- 3. SCENT GRID FILTERING SYSTEM ---
  const tabBtns = document.querySelectorAll('.tab-btn');
  const scentCards = document.querySelectorAll('.scent-card');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      
      scentCards.forEach(card => {
        // Reset styles first
        card.style.display = 'flex';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
        
        if (filter !== 'all' && !card.classList.contains(filter)) {
          // Smooth fade-out animation
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300); // match standard transition values
        }
      });
    });
  });

  // --- 4. ARTISANAL SCENT CUSTOMIZER ENGINE ---
  // Core Selection State
  const customSachet = {
    shape: 'hexagon',
    scent: 'lavender',
    ribbon: 'olive',
    botanicals: ['rosebud', 'lavender'] // pre-selected elements
  };

  // Base Prices
  const prices = {
    shapes: { hexagon: 50.00, oval: 50.00, arch: 50.00 },
    scents: { lavender: 0.00, rose: 0.50, citrus: 0.50, cedarwood: 1.00 },
    ribbons: { olive: 0.00, cream: 0.00, terracotta: 0.50 },
    botanicals: { rosebud: 1.50, lavender: 1.00, orange: 1.50, jasmine: 1.20, cinnamon: 1.00 }
  };

  // SVG Paths for Shapes
  const shapeSVGPaths = {
    hexagon: "M100,20 L180,60 L180,140 L100,180 L20,140 L20,60 Z",
    oval: "M100,20 C150,20 180,50 180,100 C180,150 150,180 100,180 C50,180 20,150 20,100 C20,50 50,20 100,20 Z",
    arch: "M20,180 L20,80 C20,35 55,20 100,20 C145,20 180,35 180,80 L180,180 Z"
  };

  // Ribbon Color Fills
  const ribbonColors = {
    olive: '#4A5D4E',
    cream: '#E9E3D5',
    terracotta: '#C58B7E'
  };

  // Scented Wax Colors
  const waxColors = {
    lavender: '#FAF8F5',  // soft pure off-white
    rose: '#FDF3F1',      // delicate hint of rose-pink
    citrus: '#FFFDF0',    // sunlit cream yellow
    cedarwood: '#F5ECE3'  // earthy cream beige
  };

  // DOM elements
  const svgWaxBody = document.getElementById('svg-wax-body');
  const svgRibbon = document.getElementById('svg-ribbon');
  const priceDisplay = document.getElementById('custom-price');
  const steps = document.querySelectorAll('.customizer-step-content');
  const dots = document.querySelectorAll('.step-dot');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  let currentStep = 0;

  // Calculation logic
  const updateCustomizerPrice = () => {
    let total = prices.shapes[customSachet.shape] + prices.scents[customSachet.scent] + prices.ribbons[customSachet.ribbon];
    customSachet.botanicals.forEach(bot => {
      total += prices.botanicals[bot] || 0;
    });
    if (priceDisplay) {
      priceDisplay.textContent = `₱${total.toFixed(2)}`;
    }
  };

  // UI Visual Sync Logic
  const syncCustomizerSVG = () => {
    if (!svgWaxBody || !svgRibbon) return;
    
    // Shape Update
    svgWaxBody.setAttribute('d', shapeSVGPaths[customSachet.shape]);
    
    // Ribbon Update
    svgRibbon.setAttribute('fill', ribbonColors[customSachet.ribbon]);
    
    // Wax Color Update
    svgWaxBody.setAttribute('fill', waxColors[customSachet.scent]);
    
    // Botanicals Layer Sync
    document.querySelectorAll('.svg-botanical').forEach(layer => {
      const botanicalId = layer.getAttribute('data-botanical-type');
      if (customSachet.botanicals.includes(botanicalId)) {
        layer.classList.add('active');
      } else {
        layer.classList.remove('active');
      }
    });
  };

  // Bind Customizer Clicks
  const initCustomizerEvents = () => {
    const optionCards = document.querySelectorAll('.option-card');
    
    optionCards.forEach(card => {
      card.addEventListener('click', () => {
        const type = card.getAttribute('data-type');
        const value = card.getAttribute('data-value');
        
        if (type === 'shape') {
          document.querySelectorAll('.option-card[data-type="shape"]').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          customSachet.shape = value;
        } else if (type === 'scent') {
          document.querySelectorAll('.option-card[data-type="scent"]').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          customSachet.scent = value;
        } else if (type === 'ribbon') {
          document.querySelectorAll('.option-card[data-type="ribbon"]').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          customSachet.ribbon = value;
        } else if (type === 'botanical') {
          if (customSachet.botanicals.includes(value)) {
            customSachet.botanicals = customSachet.botanicals.filter(b => b !== value);
            card.classList.remove('selected');
          } else {
            // Limit to max 3 botanicals for absolute design balance
            if (customSachet.botanicals.length < 3) {
              customSachet.botanicals.push(value);
              card.classList.add('selected');
            } else {
              // Quick alert vibration on full slots
              card.style.animation = 'none';
              card.offsetHeight; /* trigger reflow */
              card.style.animation = 'shake 0.4s ease';
              return;
            }
          }
        }
        
        syncCustomizerSVG();
        updateCustomizerPrice();
      });
    });

    // Step Nav Button binds
    if (btnNext && btnPrev) {
      btnNext.addEventListener('click', () => {
        if (currentStep < steps.length - 1) {
          steps[currentStep].classList.remove('active');
          dots[currentStep].classList.remove('active');
          
          currentStep++;
          
          steps[currentStep].classList.add('active');
          dots[currentStep].classList.add('active');
          
          // Show/Hide buttons
          btnPrev.style.visibility = 'visible';
          
          if (currentStep === steps.length - 1) {
            btnNext.textContent = 'Craft & Add to Cart';
            btnNext.classList.add('btn-primary');
          }
        } else if (currentStep === steps.length - 1) {
          // Trigger successful animation transition!
          if (db && firebaseConfig.projectId !== "YOUR_PROJECT_ID") {
            // Calculate final price number or string
            const priceText = document.getElementById('custom-price') ? document.getElementById('custom-price').textContent : 'Unknown';
            
            const orderData = {
              shape: customSachet.shape,
              scent: customSachet.scent,
              ribbon: customSachet.ribbon,
              botanicals: customSachet.botanicals,
              price: priceText,
              timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            db.collection("bespoke_orders").add(orderData)
              .then(() => {
                showSuccessScreen();
              })
              .catch((error) => {
                console.error("Error saving order: ", error);
                alert("There was an error processing your custom order. Please try again.");
              });
          } else {
            // Fallback if Firebase isn't configured
            showSuccessScreen();
          }
        }
      });
      
      btnPrev.addEventListener('click', () => {
        if (currentStep > 0) {
          steps[currentStep].classList.remove('active');
          dots[currentStep].classList.remove('active');
          
          currentStep--;
          
          steps[currentStep].classList.add('active');
          dots[currentStep].classList.add('active');
          
          btnNext.textContent = 'Next Step';
          
          if (currentStep === 0) {
            btnPrev.style.visibility = 'hidden';
          }
        }
      });
      
      btnPrev.style.visibility = 'hidden'; // initial state
    }
  };

  const showSuccessScreen = () => {
    const customizerPanel = document.getElementById('customizer-panel');
    const stickyPreview = document.getElementById('customizer-preview');
    if (!customizerPanel) return;

    // Build the success panel contents
    customizerPanel.innerHTML = `
      <div class="success-screen">
        <div class="success-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h3 class="serif-font" style="font-size: 2.2rem; color: var(--color-moss-dark); margin-bottom: 1rem;">Meticulously Queued</h3>
        <p style="color: var(--color-text-muted); margin-bottom: 2rem; max-width: 400px; font-size: 0.95rem;">
          Our artisans have received your design specs. Your bespoke botanical wax sachet is queued for pouring in our small batch laboratory.
        </p>
        <div style="background-color: var(--color-cream-warm); border-radius: var(--border-radius-md); padding: 1.5rem 2rem; text-align: left; width: 100%; margin-bottom: 2rem; border: 1px solid rgba(74,93,78,0.08);">
          <h4 style="font-family: var(--font-sans); text-transform: uppercase; font-size: 0.75rem; letter-spacing: 2px; color: var(--color-clay); margin-bottom: 1rem;">Bespoke Specifications:</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.9rem;">
            <li><strong>Geometric Shape:</strong> ${customSachet.shape.charAt(0).toUpperCase() + customSachet.shape.slice(1)}</li>
            <li><strong>Essential Scent:</strong> ${customSachet.scent.charAt(0).toUpperCase() + customSachet.scent.slice(1)}</li>
            <li><strong>Velvet Ribbon:</strong> ${customSachet.ribbon.charAt(0).toUpperCase() + customSachet.ribbon.slice(1)}</li>
            <li><strong>Embellished Botanicals:</strong> ${customSachet.botanicals.map(b => b.charAt(0).toUpperCase() + b.slice(1)).join(', ')}</li>
          </ul>
        </div>
        <button class="btn btn-primary" onclick="window.location.reload()" style="width: 100%;">Design Another Bespoke Tablet</button>
      </div>
    `;

    // Visual scroll sync
    if (window.innerWidth <= 1024) {
      stickyPreview.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Shake keyframe animation for max botanicals warning
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-6px); }
      40%, 80% { transform: translateX(6px); }
    }
  `;
  document.head.appendChild(style);

  // Initialize customizer elements
  initCustomizerEvents();
  syncCustomizerSVG();
  updateCustomizerPrice();


  // --- 5. TESTIMONIAL CAROUSEL SLIDER ---
  const slides = document.querySelectorAll('.testimonial-slide');
  const btnNextTestimonial = document.getElementById('testimonial-next');
  const btnPrevTestimonial = document.getElementById('testimonial-prev');
  let currentSlide = 0;
  let autoplayInterval;

  const showSlide = (index) => {
    if (slides.length === 0) return;
    
    // Bounds wrap
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    // Shift wrapper
    const wrapper = document.querySelector('.testimonial-wrapper');
    if (wrapper) {
      wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    // Toggle active opacity classes
    slides.forEach((slide, idx) => {
      if (idx === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  };

  const nextSlide = () => {
    showSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    showSlide(currentSlide - 1);
  };

  // Autoplay functionality
  const startAutoplay = () => {
    autoplayInterval = setInterval(nextSlide, 8000); // Swap every 8s
  };

  const resetAutoplay = () => {
    clearInterval(autoplayInterval);
    startAutoplay();
  };

  if (btnNextTestimonial && btnPrevTestimonial) {
    btnNextTestimonial.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });
    
    btnPrevTestimonial.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });
    
    // Start initial loops
    showSlide(0);
    startAutoplay();
  }

  // --- 6. FAQ ACCORDION ENGINE ---
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    if (question && answer) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Collapse all other active accordions
        faqItems.forEach(i => {
          i.classList.remove('active');
          i.querySelector('.faq-answer').style.maxHeight = '0';
        });
        
        if (!isActive) {
          item.classList.add('active');
          // Smoothly set maxHeight to exactly fits its inner height!
          const innerHeight = answer.querySelector('.faq-answer-inner').scrollHeight;
          answer.style.maxHeight = `${innerHeight + 30}px`;
        }
      });
    }
  });

  // --- 7. NEWSLETTER SUBSCRIPTION INTERACTION ---
  const newsForm = document.getElementById('news-form');
  const newsSuccess = document.getElementById('news-success');
  
  if (newsForm && newsSuccess) {
    newsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsForm.querySelector('input').value;
      if (email.trim() !== '') {
        if (db && firebaseConfig.projectId !== "YOUR_PROJECT_ID") {
          db.collection("newsletter_subscribers").add({
            email: email,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          }).then(() => {
            newsForm.style.display = 'none';
            newsSuccess.textContent = `Gratitude. Scent updates sent to: ${email}`;
            newsSuccess.style.display = 'block';
          }).catch((error) => {
            console.error("Error saving subscriber: ", error);
            alert("Error subscribing to newsletter. Please try again.");
          });
        } else {
          // Fallback if Firebase isn't configured
          newsForm.style.display = 'none';
          newsSuccess.textContent = `[Demo Mode] Gratitude. Scent updates sent to: ${email}`;
          newsSuccess.style.display = 'block';
        }
      }
    });
  }

  // --- 8. SMOOTH INTERSECTION OBSERVER FOR FADE REVEALS ---
  const revealElements = document.querySelectorAll('.fade-up-element');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
      observer.observe(el);
    });
  } else {
    // Fallback if observer is unsupported
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // --- 9. CONTACT STUDIO FORM INTEGRATION ---
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = contactForm.querySelectorAll('input, textarea');
      const name = inputs[0] ? inputs[0].value : '';
      const email = inputs[1] ? inputs[1].value : '';
      const message = inputs[2] ? inputs[2].value : '';
      
      if (name.trim() && email.trim() && message.trim()) {
        if (db && firebaseConfig.projectId !== "YOUR_PROJECT_ID") {
          db.collection("contact_messages").add({
            name: name,
            email: email,
            message: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          }).then(() => {
            alert("Thank you! Your message has been sent to our studio.");
            contactForm.reset();
          }).catch((error) => {
            console.error("Error saving message: ", error);
            alert("There was an error sending your message. Please try again.");
          });
        } else {
          alert("[Demo Mode] Thank you! Your message would have been sent.");
          contactForm.reset();
        }
      }
    });
  }
});
