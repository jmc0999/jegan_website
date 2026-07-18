document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. MOBILE NAV MENU TOGGLE
  // ==========================================
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-active');
      const icon = menuToggle.querySelector('i');
      if (navMenu.classList.contains('mobile-active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    // Close menu when navigation items are clicked on mobile
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navMenu.classList.remove('mobile-active');
        icon = menuToggle.querySelector('i');
        icon.className = 'fa-solid fa-bars';
      });
    });
  }

  // ==========================================
  // 2. HERO BACKGROUND CANVAS (PARTICLE NETWORK)
  // ==========================================
  const canvas = document.getElementById('network-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let particleCount = 60;
    let maxDistance = 120;
    
    // Set proper canvas dimensions
    function resizeCanvas() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      if (window.innerWidth < 768) {
        particleCount = 30;
        maxDistance = 80;
      } else {
        particleCount = 70;
        maxDistance = 130;
      }
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Particle Class definition
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(139, 92, 246, 0.4)'; // Cyan or Purple
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }
    
    // Initialize particle array
    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }
    initParticles();
    
    // Draw lines connecting particles
    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }
    
    // Animation loop
    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      drawConnections();
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ==========================================
  // 3. TYPEWRITER EFFECT
  // ==========================================
  const typewriter = document.getElementById('typewriter');
  if (typewriter) {
    const words = JSON.parse(typewriter.getAttribute('data-words'));
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 100;
    
    function type() {
      const currentWord = words[wordIdx];
      
      if (isDeleting) {
        typewriter.textContent = currentWord.substring(0, charIdx - 1);
        charIdx--;
        typeSpeed = 50; // speed up deleting
      } else {
        typewriter.textContent = currentWord.substring(0, charIdx + 1);
        charIdx++;
        typeSpeed = 100;
      }
      
      if (!isDeleting && charIdx === currentWord.length) {
        isDeleting = true;
        typeSpeed = 2000; // pause at full word
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        typeSpeed = 300; // pause before typing next
      }
      
      setTimeout(type, typeSpeed);
    }
    
    // Start typewriter loop
    setTimeout(type, 1000);
  }

  // ==========================================
  // 4. INTERACTIVE TERMINAL
  // ==========================================
  const terminalInput = document.getElementById('terminal-input');
  const terminalScreen = document.getElementById('terminal-screen');
  const inputRow = document.getElementById('terminal-input-row');
  
  if (terminalInput && terminalScreen && inputRow) {
    
    // Focus terminal input when clicking anywhere inside the terminal body
    terminalScreen.addEventListener('click', () => {
      terminalInput.focus();
    });
    
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const command = terminalInput.value.trim();
        const cleanCommand = command.toLowerCase();
        
        // Append current input line to history
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `<span class="terminal-user">guest</span><span class="terminal-host">@jegan-infra</span>:<span class="terminal-path">~</span>$ <span class="terminal-cmd">${escapeHTML(command)}</span>`;
        
        const output = document.createElement('div');
        output.className = 'terminal-output';
        
        // Command Parser
        if (cleanCommand === 'help') {
          output.innerHTML = `
            Available Commands:<br>
            - <span style="color: var(--accent-cyan)">help</span>: Show this help dialog<br>
            - <span style="color: var(--accent-cyan)">clear</span>: Clear terminal console buffer<br>
            - <span style="color: var(--accent-cyan)">neofetch</span>: Display profile info summary<br>
            - <span style="color: var(--accent-cyan)">skills</span>: List technical stacks catalog<br>
            - <span style="color: var(--accent-cyan)">projects</span>: Showcase key project deployments<br>
            - <span style="color: var(--accent-cyan)">status</span>: Read simulated system and cluster telemetry<br>
            - <span style="color: var(--accent-cyan)">ping [host]</span>: Send simulated ICMP requests<br>
            - <span style="color: var(--accent-cyan)">contact</span>: Display connection protocols (links)
          `;
          line.appendChild(output);
          terminalScreen.insertBefore(line, inputRow);
        } 
        else if (cleanCommand === 'clear') {
          // Clear all except input row
          const lines = terminalScreen.querySelectorAll('.terminal-line');
          lines.forEach(l => l.remove());
        } 
        else if (cleanCommand === 'neofetch') {
          output.innerHTML = `
            <span style="color: var(--accent-purple); font-weight: bold;">JEGAN</span>@infrastructure-core<br>
            -------------------------<br>
            OS: Ubuntu 22.04.3 LTS x86_64<br>
            Kernel: Linux 5.15.0-88-generic<br>
            Uptime: 247 days, 14 hours, 32 mins<br>
            Shell: bash 5.1.16<br>
            Roles: Network Adm / DevOps / SysAdmin<br>
            Interests: IaC, CI/CD, SDN, Server Hardening
          `;
          line.appendChild(output);
          terminalScreen.insertBefore(line, inputRow);
        } 
        else if (cleanCommand === 'skills') {
          output.innerHTML = `
            Technical Inventory:<br>
            * <span style="color: var(--accent-cyan)">DevOps</span>: Kubernetes, Docker, AWS Cloud, Terraform, Ansible, Git, ArgoCD<br>
            * <span style="color: var(--accent-emerald)">Networking</span>: Cisco IOS, Routing (OSPF, BGP), VPNs, WireShark, Palo Alto Firewalls<br>
            * <span style="color: var(--accent-purple)">Systems</span>: Linux System Administration, Prometheus, Nginx, Scripting (Python, Bash)
          `;
          line.appendChild(output);
          terminalScreen.insertBefore(line, inputRow);
        } 
        else if (cleanCommand === 'projects') {
          output.innerHTML = `
            Selected Work Deployments:<br>
            1. <span style="color: var(--accent-cyan)">HA Cloud Migration</span>: AWS EKS, Terraform, multi-region auto-scaling system.<br>
            2. <span style="color: var(--accent-emerald)">Zero-Trust Security Consolidation</span>: IPsec tunnels, OSPF routing configurations.<br>
            3. <span style="color: var(--accent-purple)">Server Hardening Automation</span>: CIS benchmarking Ansible roles for 200+ servers.<br>
            4. <span style="color: var(--accent-cyan)">Self-Healing GitOps Pipeline</span>: Continuous synchronization on K8s clusters via ArgoCD.
          `;
          line.appendChild(output);
          terminalScreen.insertBefore(line, inputRow);
        } 
        else if (cleanCommand === 'status') {
          output.innerHTML = `
            Cluster Telemetry Report:<br>
            - Kubernetes Master Node: <span style="color: var(--accent-emerald)">ACTIVE [Ready]</span> Uptime: 99.99%<br>
            - Worker nodes (k8s-01, k8s-02): <span style="color: var(--accent-emerald)">ONLINE [2/2 Ready]</span><br>
            - BGP Peering Session ISP-A: <span style="color: var(--accent-emerald)">ESTABLISHED</span><br>
            - DB Replication lag: 0.12 ms (In Sync)<br>
            - Server Load average: [0.45, 0.32, 0.18]
          `;
          line.appendChild(output);
          terminalScreen.insertBefore(line, inputRow);
        } 
        else if (cleanCommand.startsWith('ping')) {
          const parts = command.split(' ');
          const host = parts.length > 1 ? parts[1] : 'jegan.dev';
          output.innerHTML = `PING ${escapeHTML(host)} (104.24.12.18) 56(84) bytes of data.`;
          line.appendChild(output);
          terminalScreen.insertBefore(line, inputRow);
          
          // Disable input temporarily during ping loops
          terminalInput.disabled = true;
          let pingCount = 0;
          
          const interval = setInterval(() => {
            pingCount++;
            const pingLine = document.createElement('div');
            pingLine.className = 'terminal-output';
            const ms = (Math.random() * 8 + 10).toFixed(1);
            pingLine.innerHTML = `64 bytes from 104.24.12.18: icmp_seq=${pingCount} ttl=56 time=${ms} ms`;
            
            // Append line directly to screen
            terminalScreen.insertBefore(pingLine, inputRow);
            terminalScreen.scrollTop = terminalScreen.scrollHeight;
            
            if (pingCount >= 4) {
              clearInterval(interval);
              const summaryLine = document.createElement('div');
              summaryLine.className = 'terminal-output';
              summaryLine.innerHTML = `--- ${escapeHTML(host)} ping statistics ---<br>4 packets transmitted, 4 received, 0% packet loss, time 3004ms`;
              terminalScreen.insertBefore(summaryLine, inputRow);
              
              // Enable input again
              terminalInput.disabled = false;
              terminalInput.focus();
              terminalScreen.scrollTop = terminalScreen.scrollHeight;
            }
          }, 600);
        } 
        else if (cleanCommand === 'contact') {
          output.innerHTML = `
            Connection links open:<br>
            - Email: <a href="mailto:jegan@infrastructure.dev" style="color: var(--accent-cyan); text-decoration: underline;">jegan@infrastructure.dev</a><br>
            - Github: <a href="https://github.com" target="_blank" style="color: var(--accent-cyan); text-decoration: underline;">github.com/jegan-infra</a><br>
            - LinkedIn: <a href="https://linkedin.com" target="_blank" style="color: var(--accent-cyan); text-decoration: underline;">linkedin.com/in/jegan-infra</a>
          `;
          line.appendChild(output);
          terminalScreen.insertBefore(line, inputRow);
        } 
        else if (cleanCommand === '') {
          // Just empty prompt press
          terminalScreen.insertBefore(line, inputRow);
        } 
        else {
          output.innerHTML = `bash: command not found: ${escapeHTML(command)}. Type <span style="color: var(--accent-cyan)">help</span> to see available commands.`;
          line.appendChild(output);
          terminalScreen.insertBefore(line, inputRow);
        }
        
        // Clear input and scroll down
        terminalInput.value = '';
        terminalScreen.scrollTop = terminalScreen.scrollHeight;
      }
    });
  }

  // Simple HTML sanitizer helper for terminal input
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // ==========================================
  // 5. NOC DASHBOARD METRICS AND TELEMETRY
  // ==========================================
  const cpuMetric = document.getElementById('cpu-metric');
  const cpuFill = document.getElementById('cpu-fill');
  const ramMetric = document.getElementById('ram-metric');
  const ramFill = document.getElementById('ram-fill');
  const bandwidthMetric = document.getElementById('bandwidth-metric');
  const bandwidthFill = document.getElementById('bandwidth-fill');
  
  if (cpuMetric && cpuFill && ramMetric && ramFill && bandwidthMetric && bandwidthFill) {
    
    function updateMetrics() {
      // Simulate slight realistic movements
      const cpu = Math.floor(Math.random() * 25) + 30; // 30% - 55%
      const ram = Math.floor(Math.random() * 10) + 62; // 62% - 72%
      const bw = (Math.random() * 0.8 + 2.1).toFixed(2); // 2.1Gb/s - 2.9Gb/s
      
      cpuMetric.textContent = `${cpu}%`;
      cpuFill.style.width = `${cpu}%`;
      
      ramMetric.textContent = `${ram}%`;
      ramFill.style.width = `${ram}%`;
      
      bandwidthMetric.textContent = `${bw} Gb/s`;
      
      // bandwidth capacity max is 10Gb/s in local routing cards
      const bwPercentage = (parseFloat(bw) / 10.0) * 100;
      bandwidthFill.style.width = `${bwPercentage}%`;
    }
    
    // Initial run and repeat
    updateMetrics();
    setInterval(updateMetrics, 2000);
  }

  // ==========================================
  // 6. NOC TELEMETRY GRAPHICS (CANVAS DRAWING)
  // ==========================================
  const chartCanvas = document.getElementById('telemetry-chart');
  if (chartCanvas) {
    const ctx = chartCanvas.getContext('2d');
    let points = [];
    const maxPoints = 30;
    
    // Set appropriate dimension parameters
    function resizeChart() {
      chartCanvas.width = chartCanvas.parentElement.offsetWidth;
      chartCanvas.height = chartCanvas.parentElement.offsetHeight;
    }
    window.addEventListener('resize', resizeChart);
    resizeChart();
    
    // Pre-populate with values
    for (let i = 0; i < maxPoints; i++) {
      points.push(Math.random() * 40 + 30); // Values between 30 and 70
    }
    
    function drawChart() {
      ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
      
      // Update values queue
      points.shift();
      points.push(Math.random() * 35 + Math.sin(Date.now() / 1000) * 15 + 40); // realistic waves
      
      const widthStep = chartCanvas.width / (maxPoints - 1);
      const height = chartCanvas.height;
      
      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        const y = (height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(chartCanvas.width, y);
        ctx.stroke();
      }
      
      // Draw filled area gradient
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let i = 0; i < points.length; i++) {
        // scale height to fit container nicely (max point is 100)
        const yVal = height - (points[i] / 100) * (height - 20);
        ctx.lineTo(i * widthStep, yVal);
      }
      ctx.lineTo(chartCanvas.width, height);
      ctx.closePath();
      
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(6, 182, 212, 0.25)'); // Cyan
      gradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw line
      ctx.beginPath();
      ctx.moveTo(0, height - (points[0] / 100) * (height - 20));
      for (let i = 1; i < points.length; i++) {
        const yVal = height - (points[i] / 100) * (height - 20);
        ctx.lineTo(i * widthStep, yVal);
      }
      ctx.strokeStyle = 'rgba(6, 182, 212, 1)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      
      // Draw glow dot at the last point
      const lastX = chartCanvas.width;
      const lastY = height - (points[points.length - 1] / 100) * (height - 20);
      ctx.beginPath();
      ctx.arc(lastX - 2, lastY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#06b6d4';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#06b6d4';
      ctx.fill();
      ctx.shadowBlur = 0; // reset shadow configurations
    }
    
    // Run loop
    setInterval(drawChart, 150);
  }

  // ==========================================
  // 7. INFRASTRUCTURE MONITORING SYSLOG FEEDS
  // ==========================================
  const syslogConsole = document.getElementById('log-console-screen');
  
  if (syslogConsole) {
    const mockLogs = [
      { level: 'info', msg: 'System kernel 5.15.0-88-generic initializing...' },
      { level: 'success', msg: 'Core API container health check passed [200 OK]' },
      { level: 'info', msg: 'Routing policy tables flushed. Reloading OSPF maps.' },
      { level: 'success', msg: 'BGP path updates received from upstream peer AS65001' },
      { level: 'warn', msg: 'High disk operations detected on replica backup array' },
      { level: 'success', msg: 'Cron replication completed database sync in 0.05s' },
      { level: 'info', msg: 'Pulling docker image redis:7.0-alpine... Cache found.' },
      { level: 'success', msg: 'ArgoCD auto-synced deployment [app: web-gateway-7d3c]' },
      { level: 'error', msg: 'Port scan detected from IP 198.51.100.42. IP dropped by iptables.' },
      { level: 'info', msg: 'Renewing SSL certs via Let\'s Encrypt client... Done.' }
    ];
    
    // Add initial logs
    for (let i = 0; i < 6; i++) {
      appendLog(mockLogs[i]);
    }
    
    function appendLog(log) {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      
      const logRow = document.createElement('div');
      logRow.className = 'log-entry';
      
      logRow.innerHTML = `
        <span class="log-time">[${timeStr}]</span>
        <span class="log-level ${log.level}">${log.level.toUpperCase()}</span>
        <span class="log-msg">${log.msg}</span>
      `;
      
      syslogConsole.appendChild(logRow);
      syslogConsole.scrollTop = syslogConsole.scrollHeight;
      
      // Maintain maximum of 40 lines in console to prevent browser lag
      while (syslogConsole.childNodes.length > 40) {
        syslogConsole.removeChild(syslogConsole.firstChild);
      }
    }
    
    // Periodically feed random logs
    function feedRandomLogs() {
      const randomLog = mockLogs[Math.floor(Math.random() * mockLogs.length)];
      appendLog(randomLog);
      
      // Randomize log intervals between 2 and 6 seconds
      setTimeout(feedRandomLogs, Math.random() * 4000 + 2000);
    }
    
    setTimeout(feedRandomLogs, 3000);
  }

  // ==========================================
  // 8. SKILLS SEARCH & CATEGORY FILTERING
  // ==========================================
  const skillSearchInput = document.getElementById('skills-search');
  const skillCards = document.querySelectorAll('.skill-card');
  const filterButtons = document.querySelectorAll('.skills-tab-btn');
  
  // Set proficiency heights when section enters viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fillBars = entry.target.querySelectorAll('.skill-proficiency-fill');
        fillBars.forEach(fill => {
          const pct = fill.getAttribute('data-percent');
          fill.style.width = pct;
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    observer.observe(skillsSection);
  }
  
  function performFiltering() {
    const query = skillSearchInput.value.toLowerCase().trim();
    const activeFilterBtn = document.querySelector('.skills-tab-btn.active');
    const category = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
    
    skillCards.forEach(card => {
      const name = card.querySelector('.skill-name').textContent.toLowerCase();
      const cardCategory = card.getAttribute('data-category');
      
      const matchesSearch = name.includes(query);
      const matchesCategory = category === 'all' || cardCategory === category;
      
      if (matchesSearch && matchesCategory) {
        card.style.display = 'flex';
        // Grow skill bar instantly on match display
        const fill = card.querySelector('.skill-proficiency-fill');
        fill.style.width = fill.getAttribute('data-percent');
      } else {
        card.style.display = 'none';
      }
    });
  }
  
  if (skillSearchInput) {
    skillSearchInput.addEventListener('input', performFiltering);
  }
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      performFiltering();
    });
  });

  // ==========================================
  // 9. CONTACT FORM SIMULATION (PACKET SENDING)
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const contactSubmitBtn = document.getElementById('contact-submit-btn');
  const pingConsoleResult = document.getElementById('ping-console-result');
  
  if (contactForm && contactSubmitBtn && pingConsoleResult) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Change submit button to loading state
      const originalText = contactSubmitBtn.innerHTML;
      contactSubmitBtn.disabled = true;
      contactSubmitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Initializing socket connection...`;
      
      // Make result block visible with initial ping lines
      pingConsoleResult.style.display = 'block';
      pingConsoleResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      
      const lines = pingConsoleResult.querySelectorAll('.form-ping-line');
      lines.forEach(l => l.style.display = 'none'); // Hide lines initially
      
      // Simulate ping progression steps
      setTimeout(() => {
        lines[0].style.display = 'block'; // PING text
      }, 500);
      
      setTimeout(() => {
        lines[1].style.display = 'block'; // icmp seq 1
      }, 1000);
      
      setTimeout(() => {
        lines[2].style.display = 'block'; // icmp seq 2
      }, 1500);
      
      setTimeout(() => {
        lines[3].style.display = 'block'; // SUCCESS message
        
        // Reset submit button
        contactSubmitBtn.disabled = false;
        contactSubmitBtn.innerHTML = originalText;
        
        // Clear form values
        document.getElementById('contact-name').value = '';
        document.getElementById('contact-email').value = '';
        document.getElementById('contact-subject').value = '';
        document.getElementById('contact-message').value = '';
      }, 2200);
    });
  }
  
  // Highlight active nav item on scroll
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-item');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 120) {
        current = section.getAttribute('id');
      }
    });
    
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });

});
