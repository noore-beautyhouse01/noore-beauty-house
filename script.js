/* =========================================================
   NOORÉ — BEAUTY HOUSE
   Main JavaScript
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     CONFIG
     ========================================================= */

  const API_BASE =
    window.NOORe_CONFIG?.API_BASE_URL ||
    "http://localhost:5000/api";


  /* =========================================================
     BASIC ELEMENTS
     ========================================================= */

  const body = document.body;
  const preloader = document.querySelector(".preloader");
  const cursor = document.querySelector(".cursor");


  /* =========================================================
     PRELOADER
     ========================================================= */

  body.classList.add("no-scroll");

  window.addEventListener("load", () => {
    setTimeout(() => {
      if (preloader) {
        preloader.classList.add("hide");
      }

      body.classList.remove("no-scroll");
    }, 900);
  });


  /* =========================================================
     CUSTOM CURSOR
     ========================================================= */

  if (
    cursor &&
    window.matchMedia("(pointer:fine)").matches
  ) {
    window.addEventListener(
      "mousemove",
      (event) => {
        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;
      },
      { passive: true }
    );

    const cursorTargets = document.querySelectorAll(
      "a, button, figure, .service-image, input, select, textarea"
    );

    cursorTargets.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        cursor.classList.add("active");
      });

      element.addEventListener("mouseleave", () => {
        cursor.classList.remove("active");
      });
    });
  }


  /* =========================================================
     HERO PARALLAX
     ========================================================= */

  const heroImage = document.querySelector(".hero-bg img");

  if (heroImage) {
    window.addEventListener(
      "scroll",
      () => {
        const y = Math.min(window.scrollY, window.innerHeight);

        heroImage.style.transform =
          `scale(1.08) translate3d(0, ${y * 0.04}px, 0)`;
      },
      { passive: true }
    );
  }


  /* =========================================================
     MOBILE NAVIGATION
     ========================================================= */

  const menu = document.querySelector(".menu");
  const navLinks = document.querySelector(".nav-links");

  if (menu && navLinks) {
    menu.addEventListener("click", () => {
      const isOpen =
        navLinks.classList.toggle("mobile-visible");

      menu.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("mobile-visible");

        menu.setAttribute(
          "aria-expanded",
          "false"
        );
      });
    });
  }


  /* =========================================================
     SERVICE DATA
     ========================================================= */

  const services = [
    {
      title: "Hair<br><i>Atelier</i>",
      count: "01 / 04",
      text:
        "Cut, colour, styling and treatment — refined around the individual, never the trend.",
      image:
        "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1800&q=90"
    },

    {
      title: "Skin<br><i>Rituals</i>",
      count: "02 / 04",
      text:
        "Facials, glow treatments and deep cleansing rituals designed for calm, healthy-looking skin.",
      image:
        "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1800&q=90"
    },

    {
      title: "Makeup<br><i>Artistry</i>",
      count: "03 / 04",
      text:
        "Soft glam, event makeup and polished looks built to feel like you — only more luminous.",
      image:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1800&q=90"
    },

    {
      title: "Bridal<br><i>House</i>",
      count: "04 / 04",
      text:
        "A complete bridal experience with private consultation, makeup, hair styling and finishing details.",
      image:
        "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=1800&q=90"
    }
  ];


  /* =========================================================
     SERVICE SWITCHING
     ========================================================= */

  const serviceTabs =
    document.querySelectorAll(".service-tab");

  const currentImage =
    document.querySelector(
      ".service-image.current img"
    );

  const nextImage =
    document.querySelector(
      ".service-image.next img"
    );

  const serviceTitle =
    document.querySelector(
      ".service-copy h3"
    );

  const serviceCount =
    document.querySelector(
      ".service-count"
    );

  const serviceText =
    document.querySelector(
      ".service-copy > p"
    );


  serviceTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {

      const item = services[index];

      if (!item) return;


      serviceTabs.forEach((button) => {
        button.classList.remove("active");
      });

      tab.classList.add("active");


      if (currentImage) {
        currentImage.parentElement.style.opacity = "0";
        currentImage.parentElement.style.transform =
          "scale(.97)";
      }


      setTimeout(() => {

        if (currentImage) {
          currentImage.src = item.image;
        }

        if (serviceTitle) {
          serviceTitle.innerHTML =
            item.title;
        }

        if (serviceCount) {
          serviceCount.textContent =
            item.count;
        }

        if (serviceText) {
          serviceText.textContent =
            item.text;
        }

        if (currentImage) {
          currentImage.parentElement.style.opacity = "1";
          currentImage.parentElement.style.transform =
            "scale(1)";
        }

      }, 260);


      if (nextImage) {
        nextImage.src =
          services[
            (index + 1) % services.length
          ].image;
      }
    });
  });


  /* =========================================================
     REVEAL ANIMATIONS
     ========================================================= */

  const revealElements =
    document.querySelectorAll(
      [
        ".intro-grid",
        ".intro-image",
        ".service-stage",
        ".statement h2",
        ".house-copy",
        ".house-collage",
        ".journal-grid",
        ".booking-content",
        ".contact-main"
      ].join(",")
    );


  revealElements.forEach((element) => {
    element.classList.add("reveal");
  });


  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                "in-view"
              );

              observer.unobserve(
                entry.target
              );
            }

          });

        },
        {
          threshold: 0.12
        }
      );


    revealElements.forEach((element) => {
      observer.observe(element);
    });

  } else {

    revealElements.forEach((element) => {
      element.classList.add("in-view");
    });

  }


  /* =========================================================
     BOOKING MODAL
     ========================================================= */

  const bookingModal =
    document.getElementById(
      "bookingModal"
    );

  const bookingForm =
    document.getElementById(
      "bookingForm"
    );

  const bookingStatus =
    document.getElementById(
      "bookingStatus"
    );


  if (!bookingModal || !bookingForm) {
    return;
  }


  const openBookingButtons =
    document.querySelectorAll(
      "[data-open-booking]"
    );

  const closeBookingButtons =
    document.querySelectorAll(
      "[data-close-booking]"
    );

  const dateInput =
    bookingForm.querySelector(
      'input[name="date"]'
    );


  /* =========================================================
     DATE LIMIT
     ========================================================= */

  function setMinimumDate() {

    if (!dateInput) return;

    const today =
      new Date().toISOString().split("T")[0];

    dateInput.min = today;
  }

  setMinimumDate();


  /* =========================================================
     OPEN BOOKING
     ========================================================= */

  function openBooking(event) {

    if (event) {
      event.preventDefault();
    }

    bookingModal.classList.add("open");

    bookingModal.setAttribute(
      "aria-hidden",
      "false"
    );

    body.classList.add("no-scroll");

    setTimeout(() => {

      const firstInput =
        bookingForm.querySelector(
          "input"
        );

      if (firstInput) {
        firstInput.focus();
      }

    }, 150);
  }


  /* =========================================================
     CLOSE BOOKING
     ========================================================= */

  function closeBooking() {

    bookingModal.classList.remove(
      "open"
    );

    bookingModal.setAttribute(
      "aria-hidden",
      "true"
    );

    body.classList.remove(
      "no-scroll"
    );
  }


  openBookingButtons.forEach((button) => {
    button.addEventListener(
      "click",
      openBooking
    );
  });


  closeBookingButtons.forEach((button) => {
    button.addEventListener(
      "click",
      closeBooking
    );
  });


  /* =========================================================
     ESCAPE KEY
     ========================================================= */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        bookingModal.classList.contains("open")
      ) {
        closeBooking();
      }

    }
  );


  /* =========================================================
     BOOKING FORM SUBMIT
     ========================================================= */

  bookingForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      if (bookingStatus) {

        bookingStatus.textContent = "";

        bookingStatus.className =
          "booking-status";
      }


      const formData =
        new FormData(
          bookingForm
        );

      const booking =
        Object.fromEntries(
          formData.entries()
        );


      /* Basic validation */

      if (
        !booking.name ||
        !booking.phone ||
        !booking.service ||
        !booking.date ||
        !booking.time
      ) {

        if (bookingStatus) {

          bookingStatus.textContent =
            "Please complete all required fields.";

          bookingStatus.className =
            "booking-status error";
        }

        return;
      }


      const submitButton =
        bookingForm.querySelector(
          'button[type="submit"]'
        );


      if (submitButton) {

        submitButton.disabled =
          true;

        const span =
          submitButton.querySelector(
            "span"
          );

        if (span) {
          span.textContent =
            "Sending request…";
        }
      }


      try {

        if (!API_BASE) {
          throw new Error(
            "Booking API is not configured."
          );
        }


        const response =
          await fetch(
            `${API_BASE}/bookings`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify(
                  booking
                )
            }
          );


        const result =
          await response
            .json()
            .catch(() => ({}));


        if (!response.ok) {

          throw new Error(
            result.message ||
            "Unable to send your request."
          );
        }


        /* Success */

        if (bookingStatus) {

          bookingStatus.textContent =
            "Your appointment request has been received. NOORÉ will contact you to confirm.";

          bookingStatus.className =
            "booking-status success";
        }


        bookingForm.reset();

        setMinimumDate();


      } catch (error) {

        console.error(
          "Booking error:",
          error
        );


        if (bookingStatus) {

          bookingStatus.textContent =
            error.message ||
            "Something went wrong. Please try again.";

          bookingStatus.className =
            "booking-status error";
        }

      } finally {

        if (submitButton) {

          submitButton.disabled =
            false;

          const span =
            submitButton.querySelector(
              "span"
            );

          if (span) {
            span.textContent =
              "Send appointment request";
          }
        }
      }

    }
  );


  /* =========================================================
     CONTACT LINKS
     ========================================================= */

  document
    .querySelectorAll(
      '.contact-info a[href="#"]'
    )
    .forEach((link) => {

      link.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
        }
      );

    });


  /* =========================================================
     NAV ACTIVE SECTION
     ========================================================= */

  const sections =
    document.querySelectorAll(
      "main section[id]"
    );

  const navigationLinks =
    document.querySelectorAll(
      ".nav-link"
    );


  if (
    sections.length &&
    navigationLinks.length &&
    "IntersectionObserver" in window
  ) {

    const sectionObserver =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                entry.isIntersecting
              ) {

                navigationLinks.forEach(
                  (link) => {

                    link.classList.remove(
                      "active"
                    );

                    const href =
                      link.getAttribute(
                        "href"
                      );

                    if (
                      href ===
                      `#${entry.target.id}`
                    ) {

                      link.classList.add(
                        "active"
                      );
                    }

                  }
                );
              }

            }
          );

        },
        {
          rootMargin:
            "-30% 0px -60% 0px"
        }
      );


    sections.forEach(
      (section) => {
        sectionObserver.observe(
          section
        );
      }
    );
  }


  /* =========================================================
     SMOOTH SCROLL
     ========================================================= */

  document
    .querySelectorAll(
      'a[href^="#"]:not([data-open-booking]):not([data-close-booking])'
    )
    .forEach((link) => {

      link.addEventListener(
        "click",
        (event) => {

          const targetId =
            link.getAttribute(
              "href"
            );

          if (
            !targetId ||
            targetId === "#"
          ) {
            return;
          }


          const target =
            document.querySelector(
              targetId
            );

          if (!target) return;


          event.preventDefault();


          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }
      );

    });


  /* =========================================================
     IMAGE LOAD FALLBACK
     ========================================================= */

  document
    .querySelectorAll("img")
    .forEach((image) => {

      image.addEventListener(
        "error",
        () => {

          image.style.background =
            "#cfc5bb";

          image.style.objectFit =
            "cover";

        }
      );

    });


  /* =========================================================
     CONSOLE INFO
     ========================================================= */

  console.log(
    "%c NOORÉ BEAUTY HOUSE ",
    "background:#10100f;color:#c7a28e;font-size:16px;padding:8px;"
  );

  console.log(
    "API:",
    API_BASE
  );

})();