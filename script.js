        // ASCII Canvas Logic
        const pre = document.getElementById('ascii-canvas');
        let A = 0, B = 0, C = 0;

        function getCanvasSize() {
            return window.innerWidth < 640 ? { w: 45, h: 22 } : { w: 80, h: 24 };
        }

        let { w: width, h: height } = getCanvasSize();
        let zBuffer = new Float32Array(width * height);
        let buffer = new Uint8Array(width * height);

        window.addEventListener('resize', () => {
            const size = getCanvasSize();
            width = size.w; height = size.h;
            zBuffer = new Float32Array(width * height);
            buffer = new Uint8Array(width * height);
        });


        function calculateSurface(cubeX, cubeY, cubeZ, ch) {
            let x = (cubeX * Math.cos(B) * Math.cos(C)) + (cubeY * (Math.sin(A) * Math.sin(B) * Math.cos(C) - Math.cos(A) * Math.sin(C))) + (cubeZ * (Math.cos(A) * Math.sin(B) * Math.cos(C) + Math.sin(A) * Math.sin(C)));
            let y = (cubeX * Math.cos(B) * Math.sin(C)) + (cubeY * (Math.sin(A) * Math.sin(B) * Math.sin(C) + Math.cos(A) * Math.cos(C))) + (cubeZ * (Math.cos(A) * Math.sin(B) * Math.sin(C) - Math.sin(A) * Math.cos(C)));
            let z = (-cubeX * Math.sin(B)) + (cubeY * Math.sin(A) * Math.cos(B)) + (cubeZ * Math.cos(A) * Math.cos(B)) + 100;

            let ooz = 1 / z;
            const scale = window.innerWidth < 640 ? 25 : 40;
            let xp = Math.floor(width / 2 + scale * ooz * x * 2);
            let yp = Math.floor(height / 2 + scale * ooz * y);

            let idx = xp + yp * width;
            if (idx >= 0 && idx < width * height && ooz > zBuffer[idx]) {
                zBuffer[idx] = ooz; buffer[idx] = ch;
            }
        }

        function render() {
            zBuffer.fill(0);
            buffer.fill(32);
            const size = window.innerWidth < 640 ? 10 : 12;
            for(let x=-size; x<size; x+=0.8) {
                for(let y=-size; y<size; y+=0.8) {
                    calculateSurface(x, y, size, 64);
                    calculateSurface(x, y, -size, 35);
                    calculateSurface(size, y, x, 36);
                    calculateSurface(-size, y, x, 43);
                }
            }
            let output = "";
            for(let i=0; i<width*height; i++) {
                output += String.fromCharCode(buffer[i]);
                if(i % width === width - 1) output += "\n";
            }
            pre.innerHTML = output;
            A += 0.02; B += 0.02; C += 0.01;
            requestAnimationFrame(render);
        }

        // --- Burger Menu Interaction ---
        const burgerBtn = document.getElementById('burger-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileLinks = document.querySelectorAll('.mobile-link');

        function toggleMenu() {
            const isOpen = mobileMenu.classList.toggle('open');
            burgerBtn.classList.toggle('menu-open');
            // Prevent scrolling when menu is open
            document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        }

        burgerBtn.onclick = toggleMenu;

        mobileLinks.forEach(link => {
            link.onclick = () => {
                toggleMenu();
            };
        });

        // --- Terminal Interaction Logic ---
        const termBtn = document.getElementById('open-terminal');
        const termWin = document.getElementById('contact-terminal');
        const termClose = document.getElementById('close-terminal');
        const termContent = document.getElementById('terminal-content');
        const termInputLine = document.getElementById('terminal-input-line');
        const termInput = document.getElementById('term-user-input');

        const channels = {
            '1': { name: 'EMAIL', url: 'mailto:ramadanzah205@gmail.com' },
            '2': { name: 'GITHUB', url: 'https://github.com/Ramadanzah-dev' },
            '3': { name: 'WHATSAPP', url: 'https://wa.me/625117726607' }
        };

        async function addLine(text, color = "text-slate-300", delay = 100) {
            const p = document.createElement('p');
            p.className = color + " mb-1";
            p.innerHTML = text;
            termContent.appendChild(p);
            termWin.querySelector('.terminal-body').scrollTop = termWin.querySelector('.terminal-body').scrollHeight;
            if (delay > 0) await new Promise(r => setTimeout(r, delay));
            return p;
        }

        async function startTerminal() {
            termContent.innerHTML = "";
            termInputLine.style.display = "none";
            
            await addLine("$ initializing contact_protocol...", "text-slate-500", 400);
            
            // 1. Animasi Progress Bar (0% - 100%)
            const loadingLine = await addLine("LOADING modules <span class='spinner'></span> [          ] 0%", "text-emerald-500", 0);
            for (let i = 1; i <= 10; i++) {
                await new Promise(r => setTimeout(r, 100));
                const dots = "#".repeat(i).padEnd(10, " ");
                loadingLine.innerHTML = `LOADING modules <span class='spinner'></span> [${dots}] ${i * 10}%`;
            }

            // 2. ANIMASI TITIK-TITIK PADA SCRIPT
            const scriptLine = await addLine("RUNNING ask_project.sh", "text-blue-400", 0);
            for (let i = 0; i < 6; i++) { // Mengulang animasi titik 6 kali
                await new Promise(r => setTimeout(r, 300));
                let dots = ".".repeat(i % 4); // Akan menghasilkan "", ".", "..", "..."
                scriptLine.innerHTML = `RUNNING ask_project.sh${dots}`;
            }
            // Set teks permanen setelah animasi selesai
            scriptLine.innerHTML = `RUNNING ask_project.sh...`;

            // 3. Tampilkan DONE
            await addLine("DONE. Remote link system active.", "text-emerald-400", 300);
            
            // ... sisa kode menu (CHOOSE CHANNEL dll) ...
            await addLine("<br>--- CHOOSE CHANNEL ---", "text-white", 0);
            await addLine("[1] EMAIL_INVITE", "text-amber-400", 100);
            await addLine("[2] GITHUB_REPO", "text-amber-400", 100);
            await addLine("[3] WHATSAPP_DIRECT", "text-amber-400", 100);
            await addLine("<br>Input selection (1-3):", "text-slate-400", 0);
            
            termInputLine.style.display = "flex";
            termInput.value = "";
            termInput.focus();
        }

        termInput.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
                const val = termInput.value.trim();
                termInputLine.style.display = "none";
                
                if (channels[val]) {
                    const choice = channels[val];
                    await addLine(`$ select --option ${val}`, "text-emerald-500", 200);
                    await addLine(`REDIRECTING TO ${choice.name} <span class='spinner'></span>`, "text-blue-400", 1000);
                    await addLine("Connection secure. Opening...", "text-emerald-500", 300);
                    
                    window.open(choice.url, '_blank');
                    
                    setTimeout(() => {
                        addLine("<br>System standby. Close or try again.", "text-slate-500", 0);
                        termInputLine.style.display = "flex";
                        termInput.value = "";
                        termInput.focus();
                    }, 1000);
                } else {
                    await addLine(`$ ERROR: Command '${val}' not found.`, "text-red-500", 200);
                    termInputLine.style.display = "flex";
                    termInput.value = "";
                    termInput.focus();
                }
            }
        });

        termBtn.onclick = () => {
            termBtn.style.display = "none";
            termWin.classList.add('active');
            startTerminal();
        };

        termClose.onclick = () => {
            termWin.classList.remove('active');
            setTimeout(() => {
                termBtn.style.display = "block";
            }, 300);
        };

        termWin.querySelector('.terminal-body').onclick = () => {
            if (termInputLine.style.display !== "none") termInput.focus();
        };

        window.onload = () => {
            render();
        };

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                if (this.getAttribute('target') === '_blank' || this.classList.contains('mobile-link')) return;
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if(target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // --- Loading Screen Logic ---
    window.addEventListener('load', () => {
    const loader = document.getElementById('loading-screen');
    const percText = document.getElementById('load-perc');
    let progress = 0;

    // Simulasi loading progress agar terasa "analog"
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 1;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Beri jeda sebentar setelah 100% sebelum hilang
            setTimeout(() => {
                loader.classList.add('fade-out');
            }, 500);
        }
        percText.innerText = `${progress}%`;
    }, 50);
});