    document.addEventListener("DOMContentLoaded", () => {
        const el = document.getElementById("hero-title");
        const slogans = [
            "GAME ON. GRAB YOUR SLICE."
        ];

        let i = 0;
        let j = 0;
        let deleting = false;

        function cur() {
            const curr = slogans[i];
            const vis = curr.slice(0, j);
            el.textContent = vis;

            if (!deleting && j < curr.length) {
                j++;
                setTimeout(cur, 65);
            }
            else if (deleting && j > 0) {
                j--;
                setTimeout(cur, 45);
            }
            else {
                deleting = !deleting;
                if (!deleting) {
                    i = (i + 1) % slogans.length;
                }
                setTimeout(cur, deleting ? 1400 : 800);
            }
        }
        cur();
        
    });
    