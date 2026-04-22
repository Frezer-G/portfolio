const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");
const reveals = document.querySelectorAll(".reveal");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

document.getElementById("year").textContent = new Date().getFullYear();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.15 }
);

reveals.forEach((el) => observer.observe(el));

const setActiveNav = () => {
  let currentId = "";

  sections.forEach((section) => {
    const top = window.scrollY;
    const offset = section.offsetTop - 140;
    const height = section.offsetHeight;

    if (top >= offset && top < offset + height) {
      currentId = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("active", isActive);
  });
};

window.addEventListener("scroll", setActiveNav);
setActiveNav();

const showFieldError = (field, message) => {
  const fieldWrap = field.closest(".field");
  const errorText = fieldWrap.querySelector(".error-text");
  fieldWrap.classList.add("invalid");
  errorText.textContent = message;
};

const clearFieldError = (field) => {
  const fieldWrap = field.closest(".field");
  const errorText = fieldWrap.querySelector(".error-text");
  fieldWrap.classList.remove("invalid");
  errorText.textContent = "";
};

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

if (contactForm) {
  contactForm.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", () => {
      clearFieldError(field);
      if (formStatus.classList.contains("error")) {
        formStatus.textContent = "";
        formStatus.className = "form-status";
      }
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const subjectField = document.getElementById("subject");
    const messageField = document.getElementById("message");

    [nameField, emailField, subjectField, messageField].forEach(clearFieldError);
    formStatus.textContent = "";
    formStatus.className = "form-status";

    let hasError = false;

    if (!nameField.value.trim()) {
      showFieldError(nameField, "Please enter your name.");
      hasError = true;
    }

    if (!emailField.value.trim()) {
      showFieldError(emailField, "Please enter your email.");
      hasError = true;
    } else if (!isValidEmail(emailField.value.trim())) {
      showFieldError(emailField, "Please enter a valid email.");
      hasError = true;
    }

    if (!subjectField.value.trim()) {
      showFieldError(subjectField, "Please enter a subject.");
      hasError = true;
    }

    if (!messageField.value.trim()) {
      showFieldError(messageField, "Please write your message.");
      hasError = true;
    }

    if (hasError) {
      formStatus.textContent = "Please fix the highlighted fields.";
      formStatus.classList.add("error");
      return;
    }

    formStatus.textContent = "Thanks, your message is ready to send.";
    formStatus.classList.add("success");
    contactForm.reset();
  });
}
