(() => {
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  const motion = gsap.matchMedia();
  motion.add(
    {
      reduceMotion: '(prefers-reduced-motion: reduce)',
      hasMotion: '(prefers-reduced-motion: no-preference)'
    },
    (context) => {
      if (context.conditions.reduceMotion) return;

      const reveal = (targets, trigger, options = {}) => {
        const elements = gsap.utils.toArray(targets);
        if (!elements.length) return;

        gsap.fromTo(elements,
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.62,
            ease: 'power3.out',
            stagger: options.stagger ?? 0.09,
            scrollTrigger: {
              trigger,
              start: 'top 84%',
              once: true
            }
          }
        );
      };

      // Keep the hero out of the animation scope. Reveal only the in-scope sections.
      reveal('.features-section .section-heading, .features-section .collaboration-photo', '.features-section');
      reveal('.features-section .feature-card', '.features-section .feature-grid');
      reveal('.demo-section .demo-heading, .demo-section .demo-tabs, .demo-section .demo-preview', '.demo-section', { stagger: 0.12 });
      reveal('.integrations-section .section-heading, .integrations-section .integrations-cta', '.integrations-section');
      reveal('.integrations-section .workflow-grid > div', '.integrations-section .workflow-grid', { stagger: 0.06 });
      reveal('.teams-section .section-heading', '.teams-section');
      reveal('.teams-section .team-bento-card', '.teams-section .team-bento-grid', { stagger: 0.12 });
      reveal('.trust-section .section-heading', '.trust-section');
      reveal('.trust-section .trust-stats > div', '.trust-section .trust-stats');
      reveal('.testimonial-section .section-heading, .testimonial-section .quote-card', '.testimonial-section', { stagger: 0.12 });
      reveal('.faq-section .section-heading, .faq-section .support-link', '.faq-section');
      reveal('.faq-section .faq-list details', '.faq-section .faq-list', { stagger: 0.055 });

      // Small feedback confirms the selected demo tab without moving the page layout.
      document.querySelectorAll('.demo-tab').forEach((tab) => {
        tab.addEventListener('click', () => {
          const preview = document.querySelector('.demo-preview');
          if (!preview) return;
          gsap.fromTo(preview, { autoAlpha: 0.72, y: 6 }, {
            autoAlpha: 1,
            y: 0,
            duration: 0.28,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        });
      });

      document.querySelectorAll('.demo-tab, .workflow-grid > div, .team-bento-card').forEach((card) => {
        card.addEventListener('pointerenter', () => {
          if (window.matchMedia('(hover: none)').matches) return;
          gsap.to(card, { y: -3, duration: 0.18, ease: 'power2.out', overwrite: 'auto' });
        });
        card.addEventListener('pointerleave', () => {
          gsap.to(card, { y: 0, duration: 0.22, ease: 'power2.out', overwrite: 'auto' });
        });
      });
    }
  );
})();
