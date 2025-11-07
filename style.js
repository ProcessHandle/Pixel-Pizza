    document.addEventListener("DOMContentLoaded", () => {
        const el = document.getElementById("hero-title")
        const text = el.textContent.trim()
        let i = 0
        let deleting = false

        function cur() {
            let visible = text.slice(0, i)
            let blanks = " ".repeat(text.length - i)
            el.textContent = visible + blanks

            if (!deleting) {
                i++
                if (i === text.length) {
                    deleting = true
                    setTimeout(cur, 1500)
                    return
                }
            } else {
                i--
                if (i === 0) {
                    deleting = false
                    setTimeout(cur, 600)
                    return
                }
            }

            setTimeout(cur, deleting ? 45 : 65)
        }

        cur()
    });