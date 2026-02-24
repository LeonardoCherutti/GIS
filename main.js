// Main application script
document.addEventListener('DOMContentLoaded', function() {
    // Configuration object - easy to modify dashboard links
    const config = {        
        // Dashboard configuration - add/remove dashboards here
        dashboards: {
            'estudo-a': {
                title: 'Hospital Center Clínicas',
                url: 'https://app.powerbi.com/view?r=eyJrIjoiNjJhZjcyYjAtYzI4Ni00NDVmLWE3NmUtNDk1MjA4YTY4ZmVlIiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9' // Replace with actual Power BI URL
            },
            'estudo-b': {
                title: 'Hospital Municipal Ruth Cardoso',
                url: 'https://app.powerbi.com/view?r=eyJrIjoiMGE2NmJlNzctYWFmYy00MjhjLTgwNzAtZDdhNWM2YzZiMjEwIiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9' // Replace with actual Power BI URL
            },
            'estudo-c': {
                title: 'UPAs Florianópolis',
                url: 'https://app.powerbi.com/view?r=eyJrIjoiMjZlMWJiNGMtZDkyYi00YTQwLWIyYzgtZDFlZGQxOWY3MjgxIiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9&pageName=91184a9ff5a9166b63e0' // Replace with actual Power BI URL
            },
            'estudo-d': {
                title: 'Hospital Nsa. Sra. da Imaculada Conceição',
                url: 'https://app.powerbi.com/view?r=eyJrIjoiNDExNGVmOGUtY2FhYS00NWYyLTg4NTctODUyZGVlMDY4ZjIyIiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9' // Replace with actual Power BI URL
            },
            'estudo-e': {
                title: 'Hospital do Coração de Cariri',
                url: 'https://app.powerbi.com/view?r=eyJrIjoiNzdhZDIxYTQtN2M0My00MDA0LTg1OGEtZTFkMDMxYmYwMzM4IiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9' // Replace with actual Power BI URL
            },
            'estudo-f': {
                title: 'Maternidade Santo Antônio HMSA',
                url: 'https://app.powerbi.com/view?r=eyJrIjoiNjRmMDM0OTgtNmQ4ZS00YzRhLThjMDAtNzg0ODMwMjFlYjg0IiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9' // Replace with actual Power BI URL
            },
            'estudo-g': {
                title: 'Hospital do Idoso Zilda Arns',
                url: 'https://app.powerbi.com/view?r=eyJrIjoiYjdlN2UzNjQtZDRiYi00ZGM5LWE0MjItOWQyODg4NjhlMzNlIiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9' // Replace with actual Power BI URL
            },
            'estudo-h': {
                title: 'HPS Pref. Dr. Marcos Antonio Ronchetti',
                url: 'https://app.powerbi.com/view?r=eyJrIjoiYjEwYTA2M2YtOGZlNS00YmI3LTg3ZTQtNWYxY2FhNGUzY2UxIiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9' // Replace with actual Power BI URL
            },
            'estudo-i': {
                title: 'Hospital Nsa. Sra. Das Graças',
                url: 'https://app.powerbi.com/view?r=eyJrIjoiMjE5OWFjOGItMzU2Zi00MDNlLTg2YzMtZmEwZDdmYTQ2YjE0IiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9' // Replace with actual Power BI URL
            },
            'estudo-j': {
                title: 'Hospital Nsa. Sra. do Perpétuo Socorro',
                url: 'https://app.powerbi.com/view?r=eyJrIjoiMGEzNDI2ODItYTExYi00NWM1LWJmMzAtMjc2YzM1OWQ5NjRjIiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9' // Replace with actual Power BI URL
            },
            'estudo-k': {
                title: 'Hospital do Câncer de Londrina',
                url: 'https://app.powerbi.com/view?r=eyJrIjoiNjNjMzczYzItMjZlMC00MjliLTgzYTItNDUyZWI1MTFkZjQwIiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9' // Replace with actual Power BI URL
            },
            'estudo-l': {
                title: 'Hospital São Vicente de Paulo',
                url: 'https://app.powerbi.com/view?r=eyJrIjoiYWVjNjdlZDQtOTE3Yy00ZDNhLWE0MDQtNzNhZDcxOWRkOGEzIiwidCI6IjVhMmEwNzMxLTI1MmQtNGMwNy1hN2Y3LWJmNzUyNGM0NzEyZSJ9' // Replace with actual Power BI URL
            }
        }
    };
    
    // DOM Elements
    const loginView = document.getElementById('login-view');
    const dashboardSelectionView = document.getElementById('dashboard-selection-view');
    const dashboardView = document.getElementById('dashboard-view');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');
    const backBtn = document.getElementById('back-btn');
    const dashboardTitle = document.getElementById('dashboard-title');
    const powerbiIframe = document.getElementById('powerbi-iframe');
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    
    // Check if user is already logged in (simple session persistence)
    if (sessionStorage.getItem('loggedIn') === 'true') {
        showDashboardSelection();
    }
    
    // Login Form Submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
    
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
    
        try {
            const res = await fetch('https://backend-app-113139671688.southamerica-east1.run.app/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
        
            const data = await res.json();
        
            if (res.ok) {
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('loggedIn', 'true');
                showDashboardSelection();
                loginError.classList.add('hidden');
            } else {
                loginError.classList.remove('hidden');
            }
        } catch (err) {
            console.error('Erro ao autenticar', err);
            loginError.classList.remove('hidden');
        }
    });
    
    // Logout Button
    logoutBtn.addEventListener('click', function() {
        sessionStorage.removeItem('loggedIn');
        showLoginView();
    });
    
    // Back Button (from dashboard view to selection view)
    backBtn.addEventListener('click', function() {
        showDashboardSelection();
    });
    
    // Dashboard Card Click Handlers
    dashboardCards.forEach(card => {
        card.addEventListener('click', function() {
            const dashboardId = this.getAttribute('data-dashboard-id');
            showDashboard(dashboardId);
        });
    });
    
    // View Management Functions
    function showLoginView() {
        loginView.classList.remove('hidden');
        dashboardSelectionView.classList.add('hidden');
        dashboardView.classList.add('hidden');
        loginForm.reset();
    }
    
    function showDashboardSelection() {
        loginView.classList.add('hidden');
        dashboardSelectionView.classList.remove('hidden');
        dashboardView.classList.add('hidden');
    }
    
    function showDashboard(dashboardId) {
        // Check if dashboard exists in config
        if (config.dashboards[dashboardId]) {
            // Update title
            dashboardTitle.textContent = config.dashboards[dashboardId].title;
            
            // Set iframe source (replace with actual Power BI URL)
            powerbiIframe.src = config.dashboards[dashboardId].url;
            
            // Show dashboard view
            loginView.classList.add('hidden');
            dashboardSelectionView.classList.add('hidden');
            dashboardView.classList.remove('hidden');
        } else {
            console.error('Dashboard not found:', dashboardId);
            alert('Dashboard não encontrado.');
        }
    }

});



