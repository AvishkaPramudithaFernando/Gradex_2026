(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isSmallDevice = window.matchMedia("(max-width: 768px)").matches;
  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const linkedinUrl = "https://www.linkedin.com/in/avishka-pramuditha-warnakulasuriya-fernando-122b38282";
  let pageVisible = !document.hidden;

  document.addEventListener("visibilitychange", () => {
    pageVisible = !document.hidden;
  });

  qsa("[data-logo]").forEach((lockup) => {
    const img = qs("img", lockup);
    const src = lockup.dataset.logo;
    if (!img || !src) return;
    const probe = new Image();
    probe.onload = () => {
      img.src = src;
      lockup.classList.add("logo-loaded");
    };
    probe.src = src;
  });

  const scrollProgress = qs("#scrollProgress");
  const backHome = qs("#backHome");
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;
    const hero = qs("#hero");
    const heroBottom = hero ? hero.offsetTop + hero.offsetHeight - 80 : 520;
    backHome.hidden = window.scrollY < heroBottom && !document.body.classList.contains("demo-running");
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  function scrollToId(id) {
    const target = qs(id);
    if (target) target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  }

  const menuToggle = qs("#menuToggle");
  const navLinks = qs("#navLinks");
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  qsa(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  const identityBlock = qs(".identity-block");
  const identityToggle = qs("#identityToggle");
  identityToggle.addEventListener("click", () => {
    const isOpen = identityBlock.classList.toggle("open");
    identityToggle.setAttribute("aria-expanded", String(isOpen));
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  qsa(".reveal").forEach((el) => revealObserver.observe(el));

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const duration = prefersReducedMotion ? 1 : 1100;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased).toLocaleString();
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.55 });
  qsa("[data-count]").forEach((el) => counterObserver.observe(el));

  const pipelineDetail = qs("#pipelineDetail");
  const pipelineButtons = qsa("#pipelineSteps button");
  function activatePipeline(button) {
    pipelineButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    pipelineDetail.textContent = button.dataset.detail;
  }
  pipelineButtons.forEach((button) => {
    button.addEventListener("mouseenter", () => activatePipeline(button));
    button.addEventListener("focus", () => activatePipeline(button));
    button.addEventListener("click", () => activatePipeline(button));
  });

  const modelMetrics = {
    m1: [
      ["Accuracy", 0.9875],
      ["Precision", 0.9762],
      ["Recall", 1.0000],
      ["F1-score", 0.9880],
      ["ROC-AUC", 0.9997]
    ],
    m2: [
      ["Accuracy", 1.0000],
      ["Precision", 1.0000],
      ["Recall", 1.0000],
      ["F1-score", 1.0000],
      ["ROC-AUC", 1.0000]
    ]
  };
  qsa(".metric-bars").forEach((container) => {
    const rows = modelMetrics[container.dataset.model] || [];
    container.innerHTML = rows.map(([label, value]) => `
      <div class="bar-row">
        <span>${label}</span>
        <span class="bar-track"><span class="bar-fill" style="width:${value * 100}%"></span></span>
        <strong>${value.toFixed(4)}</strong>
      </div>
    `).join("");
  });

  qsa(".tilt").forEach((card) => {
    if (prefersReducedMotion || isSmallDevice) return;
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateX(${y * -5}deg) rotateY(${x * 7}deg) translateY(-3px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  function drawDatasetChart() {
    const canvas = qs("#datasetChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const normal = 543;
    const ulcer = 512;
    const total = normal + ulcer;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = 128;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 34;
    ctx.lineCap = "round";
    let start = -Math.PI / 2;
    [
      { value: normal, color: "#67d9ff" },
      { value: ulcer, color: "#e51b3f" }
    ].forEach((segment) => {
      const end = start + (segment.value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.strokeStyle = segment.color;
      ctx.arc(cx, cy, radius, start, end);
      ctx.stroke();
      start = end;
    });
    ctx.fillStyle = "#f7fbff";
    ctx.font = "700 34px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("1,055", cx, cy - 4);
    ctx.fillStyle = "#b9c8da";
    ctx.font = "18px Times New Roman, serif";
    ctx.fillText("RGB patches", cx, cy + 28);
    ctx.font = "700 15px Inter, sans-serif";
    ctx.fillStyle = "#67d9ff";
    ctx.fillText("543 Normal", cx, 36);
    ctx.fillStyle = "#e51b3f";
    ctx.fillText("512 Ulcer", cx, canvas.height - 24);
  }
  drawDatasetChart();
  window.addEventListener("resize", drawDatasetChart);

  function drawRoc(canvas, mode) {
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    let progress = prefersReducedMotion ? 1 : 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(247,251,255,0.18)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i += 1) {
        const x = 42 + i * 82;
        const y = 20 + i * 42;
        ctx.beginPath(); ctx.moveTo(x, 20); ctx.lineTo(x, 196); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(42, y); ctx.lineTo(380, y); ctx.stroke();
      }
      ctx.strokeStyle = "rgba(185,200,218,0.5)";
      ctx.beginPath(); ctx.moveTo(42, 196); ctx.lineTo(380, 20); ctx.stroke();
      ctx.strokeStyle = mode === "ideal" ? "#e51b3f" : "#67d9ff";
      ctx.lineWidth = 5;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.moveTo(42, 196);
      const p1 = Math.min(progress * 2, 1);
      ctx.lineTo(42, 196 - 176 * p1);
      if (progress > 0.5) {
        const p2 = (progress - 0.5) * 2;
        ctx.lineTo(42 + 338 * p2, 20);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#f7fbff";
      ctx.font = "700 16px Inter, sans-serif";
      ctx.fillText(mode === "ideal" ? "AUC 1.0000" : "AUC 0.9998", 290, 48);
      if (mode === "ideal" && progress >= 1) {
        ctx.fillStyle = "#e51b3f";
        ctx.font = "800 18px Inter, sans-serif";
        ctx.fillText("F1 collapse at threshold", 118, 126);
      }
    };
    const animate = () => {
      if (!pageVisible) {
        requestAnimationFrame(animate);
        return;
      }
      progress = Math.min(progress + 0.018, 1);
      render();
      if (progress < 1) requestAnimationFrame(animate);
    };
    render();
    if (!prefersReducedMotion) animate();
  }

  const rocObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      drawRoc(entry.target, entry.target.dataset.roc);
      rocObserver.unobserve(entry.target);
    });
  }, { threshold: 0.35 });
  qsa(".roc-canvas").forEach((canvas) => rocObserver.observe(canvas));

  function particleBackground() {
    const canvas = qs("#particleCanvas");
    const ctx = canvas.getContext("2d");
    let particles = [];
    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      const count = window.innerWidth < 520 ? 26 : window.innerWidth < 900 ? 44 : 78;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.34,
        vy: (Math.random() - 0.5) * 0.34,
        r: Math.random() * 1.6 + 0.7
      }));
    };
    resize();
    const step = () => {
      if (pageVisible) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        particles.forEach((p, index) => {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
          if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;
          ctx.beginPath();
          ctx.fillStyle = index % 3 === 0 ? "rgba(229,27,63,0.76)" : "rgba(103,217,255,0.68)";
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          for (let j = index + 1; j < particles.length; j += 1) {
            const q = particles[j];
            const dist = Math.hypot(p.x - q.x, p.y - q.y);
            if (dist < 108) {
              ctx.strokeStyle = `rgba(185,200,218,${(1 - dist / 108) * 0.14})`;
              ctx.lineWidth = 1;
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
            }
          }
        });
      }
      requestAnimationFrame(step);
    };
    window.addEventListener("resize", resize);
    step();
  }
  if (!prefersReducedMotion) particleBackground();

  const galleryItems = [
    ["Cover", "Quantum Medical AI", ["assets/project-cover.png", "assets/project-cover.PNG"]],
    ["Dataset", "Dataset and class balance", ["assets/dfu-dataset.png"]],
    ["Pipeline", "End-to-end model workflow", ["assets/hybrid-pipeline.png"]],
    ["Models 1–3", "Model comparison and metrics", ["assets/models-1-to-3.png"]],
    ["AUC vs F1", "Key evaluation finding", ["assets/auc-vs-f1-insight.png"]],
    ["Gradex Poster", "Full project poster", ["assets/main-banner-poster.png"]]
  ];

  function resolveImage(paths) {
    return new Promise((resolve) => {
      let index = 0;
      const tryNext = () => {
        if (index >= paths.length) {
          resolve(null);
          return;
        }
        const src = paths[index];
        index += 1;
        const probe = new Image();
        probe.onload = () => resolve(src);
        probe.onerror = tryNext;
        probe.src = src;
      };
      tryNext();
    });
  }

  async function buildGallery() {
    const grid = qs("#galleryGrid");
    if (!grid) return;
    const resolved = await Promise.all(galleryItems.map(async ([title, caption, paths]) => ({
      title,
      caption,
      src: await resolveImage(paths),
      requested: paths[0]
    })));
    grid.innerHTML = resolved.map((item, index) => `
      <article class="gallery-card">
        <button type="button" data-gallery-index="${index}" ${item.src ? "" : "disabled"} aria-label="${item.src ? `Open ${item.title}` : `${item.title} asset not added yet`}">
          <div class="gallery-media">
            ${item.src ? `<img src="${item.src}" alt="${item.title}: ${item.caption}" loading="lazy">` : `<span class="asset-note">${item.requested} asset not added yet</span>`}
          </div>
          <div class="gallery-copy">
            <h3>${item.title}</h3>
            <p>${item.caption}</p>
          </div>
        </button>
      </article>
    `).join("");

    const lightbox = qs("#lightbox");
    const lightboxImage = qs("#lightboxImage");
    const lightboxCaption = qs("#lightboxCaption");
    qsa("[data-gallery-index]", grid).forEach((button) => {
      button.addEventListener("click", () => {
        const item = resolved[Number(button.dataset.galleryIndex)];
        if (!item.src) return;
        lightboxImage.src = item.src;
        lightboxImage.alt = `${item.title}: ${item.caption}`;
        lightboxCaption.textContent = `${item.title} · ${item.caption}`;
        if (typeof lightbox.showModal === "function") lightbox.showModal();
      });
    });
  }
  buildGallery();

  const lightbox = qs("#lightbox");
  qs("#lightboxClose").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  const labModal = qs("#labModal");
  const openLabView = qs("#openLabView");
  const closeLabView = qs("#closeLabView");
  const labModalContent = qs("#labModalContent");
  const heroLabDashboard = qs(".hero-stage .lab-dashboard");
  if (labModal && openLabView && closeLabView && labModalContent && heroLabDashboard) {
    labModalContent.append(heroLabDashboard.cloneNode(true));
    const closeLabModal = () => {
      if (typeof labModal.close === "function") labModal.close();
      openLabView.focus();
    };
    openLabView.addEventListener("click", () => {
      if (typeof labModal.showModal === "function") labModal.showModal();
    });
    closeLabView.addEventListener("click", closeLabModal);
    labModal.addEventListener("click", (event) => {
      if (event.target === labModal) closeLabModal();
    });
    labModal.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeLabModal();
    });
  }

  function initQuantumCore3D() {
    const canvas = qs("#quantumCoreCanvas");
    const section = qs("#quantum-core");
    if (!canvas || !section || !window.THREE) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 1.1, 7.6);

    const ambient = new THREE.AmbientLight(0x99bbff, 0.7);
    scene.add(ambient);
    const blueLight = new THREE.PointLight(0x67d9ff, 2.2, 20);
    blueLight.position.set(3.4, 2.2, 2.6);
    scene.add(blueLight);
    const redLight = new THREE.PointLight(0xe51b3f, 1.6, 18);
    redLight.position.set(-3.1, -0.8, 2.8);
    scene.add(redLight);

    const core = new THREE.Group();
    scene.add(core);

    const shell = new THREE.Mesh(
      new THREE.BoxGeometry(2.7, 1.85, 2.7),
      new THREE.MeshPhysicalMaterial({
        color: 0x0b2342,
        roughness: 0.2,
        metalness: 0.7,
        transmission: 0.24,
        transparent: true,
        opacity: 0.9,
        emissive: 0x102b50,
        emissiveIntensity: 0.42
      })
    );
    core.add(shell);

    const inner = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.82, 0.22, 170, 24),
      new THREE.MeshStandardMaterial({
        color: 0x67d9ff,
        emissive: 0x2255aa,
        emissiveIntensity: 0.52,
        metalness: 0.72,
        roughness: 0.2
      })
    );
    core.add(inner);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.3, 0.05, 20, 120),
      new THREE.MeshStandardMaterial({
        color: 0xe51b3f,
        emissive: 0x8a1328,
        emissiveIntensity: 0.45,
        metalness: 0.65,
        roughness: 0.28
      })
    );
    ring.rotation.x = Math.PI / 2.7;
    scene.add(ring);

    const qubitGroup = new THREE.Group();
    for (let index = 0; index < 4; index += 1) {
      const bit = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 20, 20),
        new THREE.MeshStandardMaterial({
          color: index % 2 ? 0x67d9ff : 0xe51b3f,
          emissive: index % 2 ? 0x2a6bd8 : 0x7a1327,
          emissiveIntensity: 0.65
        })
      );
      bit.position.set(-1.1 + index * 0.74, 1.28, index % 2 ? -0.7 : 0.7);
      qubitGroup.add(bit);
    }
    scene.add(qubitGroup);

    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 2.3, 3.2),
      new THREE.MeshStandardMaterial({
        color: 0x67d9ff,
        wireframe: true,
        transparent: true,
        opacity: 0.22
      })
    );
    core.add(frame);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      renderer.setSize(rect.width, rect.height, false);
    };
    resize();
    window.addEventListener("resize", resize);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.innerWidth <= 640;
    let rafId = 0;
    const animate = () => {
      if (!pageVisible) {
        rafId = requestAnimationFrame(animate);
        return;
      }
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const progress = 1 - Math.min(Math.max(rect.bottom / (rect.height + viewport), 0), 1);
      const targetY = progress * Math.PI * 1.35;
      const targetX = 0.18 + progress * 0.4;

      if (reducedMotion) {
        core.rotation.y = 0.55;
        core.rotation.x = 0.28;
        ring.rotation.z = 0.15;
        inner.rotation.y += 0.003;
      } else {
        core.rotation.y += (targetY - core.rotation.y) * 0.1;
        core.rotation.x += (targetX - core.rotation.x) * 0.08;
        inner.rotation.x += 0.008;
        inner.rotation.y += 0.012;
        ring.rotation.z += 0.005;
        qubitGroup.rotation.y += 0.01;
      }
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener("beforeunload", () => cancelAnimationFrame(rafId));
  }
  initQuantumCore3D();

  const demoOverlay = qs("#demoOverlay");
  const demoTitle = qs("#demoTitle");
  const demoCaption = qs("#demoCaption");
  const demoProgress = qs("#demoProgress");
  const demoSteps = [
    ["#pipeline", "DFU Image", "RGB image patch from the dataset enters the binary classification workflow."],
    ["#pipeline", "Preprocessing", "The image is resized to 224 × 224 and normalised for model input."],
    ["#pipeline", "ResNet18 / ResNet50 Feature Extraction", "Classical convolutional networks extract deep visual representations."],
    ["#pipeline", "Feature Projection", "CNN features are compressed to a quantum-compatible vector."],
    ["#pipeline", "4-Qubit Angle Embedding", "Classical values are mapped into qubit rotations."],
    ["#pipeline", "Variational Quantum Circuit", "A trainable circuit transforms the encoded features in simulation."],
    ["#pipeline", "Pauli-Z Measurement", "Pauli-Z expectation values are measured as quantum features."],
    ["#pipeline", "Classification: Normal vs Ulcer", "The classification head produces the binary research output."],
    ["#results", "Multi-metric Evaluation", "Accuracy, precision, recall, F1-score, ROC-AUC and confusion matrices are interpreted together."],
    ["#insight", "AUC vs F1 Insight", "Perfect separation ≠ reliable prediction."]
  ];
  let demoIndex = 0;
  let demoTimer = null;
  let demoPaused = false;
  const demoInterval = 7200;

  function clearDemoHighlights() {
    pipelineButtons.forEach((button) => button.classList.remove("demo-active"));
    qsa(".flow-demo div").forEach((item) => item.classList.remove("demo-active"));
  }

  function setDemoStep(index) {
    demoIndex = index;
    const [target, title, caption] = demoSteps[demoIndex];
    demoTitle.textContent = title;
    demoCaption.textContent = caption;
    demoProgress.style.width = `${((demoIndex + 1) / demoSteps.length) * 100}%`;
    scrollToId(target);
    clearDemoHighlights();
    if (target === "#pipeline") {
      const pipelineButton = pipelineButtons[Math.min(demoIndex, pipelineButtons.length - 1)];
      if (pipelineButton) {
        pipelineButton.classList.add("demo-active");
        activatePipeline(pipelineButton);
        pipelineButton.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "nearest", inline: "center" });
      }
      const flowItems = qsa(".flow-demo div");
      if (demoIndex <= 3 && flowItems[0]) flowItems[0].classList.add("demo-active");
      if (demoIndex >= 4 && demoIndex <= 6 && flowItems[1]) flowItems[1].classList.add("demo-active");
      if (demoIndex >= 7 && flowItems[2]) flowItems[2].classList.add("demo-active");
    }
  }

  function scheduleDemo() {
    clearTimeout(demoTimer);
    if (demoPaused) return;
    demoTimer = setTimeout(() => {
      if (demoIndex >= demoSteps.length - 1) {
        stopDemo(false);
        return;
      }
      setDemoStep(demoIndex + 1);
      scheduleDemo();
    }, demoInterval);
  }

  function startDemo(fromStart) {
    document.body.classList.add("demo-running");
    demoOverlay.hidden = false;
    backHome.hidden = false;
    qs("#presentationBtn").classList.add("running");
    qs("#presentationBtn").textContent = "Stop Demo";
    demoPaused = false;
    if (fromStart) demoIndex = 0;
    setDemoStep(demoIndex);
    scheduleDemo();
    updateProgress();
  }

  function stopDemo(goHome) {
    clearTimeout(demoTimer);
    demoTimer = null;
    demoPaused = false;
    document.body.classList.remove("demo-running");
    demoOverlay.hidden = true;
    qs("#presentationBtn").classList.remove("running");
    qs("#presentationBtn").textContent = "Demo Mode";
    clearDemoHighlights();
    if (goHome) scrollToId("#hero");
    updateProgress();
  }

  qs("#watchDemo").addEventListener("click", () => startDemo(true));
  qs("#presentationBtn").addEventListener("click", () => {
    if (document.body.classList.contains("demo-running")) stopDemo(true);
    else startDemo(true);
  });
  qs("#pauseDemo").addEventListener("click", () => {
    demoPaused = true;
    clearTimeout(demoTimer);
  });
  qs("#resumeDemo").addEventListener("click", () => {
    if (!document.body.classList.contains("demo-running")) return;
    demoPaused = false;
    scheduleDemo();
  });
  qs("#restartDemo").addEventListener("click", () => startDemo(true));
  qs("#exitDemo").addEventListener("click", () => stopDemo(true));
  backHome.addEventListener("click", () => stopDemo(true));

  qsa(`a[href="${linkedinUrl}"]`).forEach((link) => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });
}());
