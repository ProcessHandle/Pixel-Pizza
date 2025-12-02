document.addEventListener("SalesDataLoaded", () => {
    window.salesData = {}

    menuItems.forEach(item => {
        window.salesData[item.title] = item.sales || 0
    });

    updSalesUI()
});

function updSalesUI() {
    clrSalesGrid()
    updSalesKPI()
    mkSalesChart()
    mkSalesGrid()
}

function clrSalesGrid() {
    let grid = document.getElementById("sales-item-grid")
    if (grid) grid.innerHTML = ""
}

function updSalesKPI() {
    if (!window.salesData) return;

    let entries = Object.entries(salesData)
    if (entries.length === 0) return;

    let total = entries.reduce((acc, x) => acc + x[1], 0) // Calculate the sum of all sales 
    let top = [...entries].sort((a, b) => b[1] - a[1])[0] // Sort into arrays highest to lowest
    let low = [...entries].sort((a, b) => a[1] - b[1])[0] // ^^^ Same but in reverse order 

    document.getElementById("kpi-total").textContent = total
    document.getElementById("kpi-top").textContent = top[0]
    document.getElementById("kpi-low").textContent = low[0]

    document.getElementById("kpi-top").previousElementSibling.textContent = `Top Item · ${top[1]} Sold`

    document.getElementById("kpi-low").previousElementSibling.textContent = `Least Popular · ${low[1]} Sold`
}

let salesChart

function mkSalesChart() {
    if (!window.salesData) return;

    let ctx = document.getElementById('sales-doughnut')
    if (!ctx) return;

    if (salesChart) {
        salesChart.destroy();
    }

    salesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(salesData),
            datasets: [{
                data: Object.values(salesData),
                backgroundColor: [
                    '#FF6D00',
                    '#FFAB40',
                    '#FF46A2',
                    '#00B8D4',
                    '#FFD740',
                    '#FF8A80',
                    '#EA80FC',
                    '#80D8FF'
                ],
                hoverOffset: 12
            }]
        },
        options: {
            cutout: '50%',
            plugins: {
                legend: { labels: { color: "#fff" } }
            }
        }
    });
}

function mkSalesGrid() {
    if (!window.salesData) return;

    Object.entries(salesData).forEach(([name, count]) => {
        saleItemCard(name, count)
    });
}

function saleItemCard(name, count) {
    let el = document.createElement("div")
    el.classList.add("sales-item-card")

    el.innerHTML = `
        <img src="https://www.nicepng.com/png/full/340-3400354_pizza-pixel-pixels-pixeles-tumblr-food-pixel-pizza.png">
        <div class="sales-item-name">${name}</div>
        <div class="sales-item-count">${count} Sold</div>
    `;

    document.getElementById("sales-item-grid").appendChild(el)
}
