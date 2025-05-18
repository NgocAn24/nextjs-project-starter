// Import modules
import { DegreeManager } from './modules/degrees.js';
import { DepartmentManager } from './modules/departments.js';
import { TeacherManager } from './modules/teachers.js';
import { StatisticsManager } from './modules/statistics.js';

class Dashboard {
    constructor() {
        this.currentPage = 'degrees';
        this.modules = {
            degrees: new DegreeManager(),
            departments: new DepartmentManager(),
            teachers: new TeacherManager(),
            statistics: new StatisticsManager()
        };
        
        this.init();
    }

    init() {
        // Initialize navigation
        this.initNavigation();
        
        // Load default page
        this.loadPage('degrees');
    }

    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.loadPage(page);
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    loadPage(page) {
        const contentArea = document.getElementById('main-content');
        this.currentPage = page;
        
        // Clear current content
        contentArea.innerHTML = '';
        
        // Load new content
        if (this.modules[page]) {
            this.modules[page].init(contentArea);
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});
