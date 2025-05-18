export class StatisticsManager {
    constructor() {
        this.teachers = JSON.parse(localStorage.getItem('teachers')) || [];
        this.departments = JSON.parse(localStorage.getItem('departments')) || [];
        this.degrees = JSON.parse(localStorage.getItem('degrees')) || [];
    }

    init(container) {
        this.container = container;
        this.render();
        this.renderCharts();
    }

    render() {
        this.container.innerHTML = `
            <div class="page-header">
                <h2>Thống kê giáo viên</h2>
            </div>

            <div class="statistics-container">
                <div class="stats-cards">
                    <div class="stat-card">
                        <div class="stat-title">Tổng số giáo viên</div>
                        <div class="stat-value">${this.teachers.length}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-title">Số khoa</div>
                        <div class="stat-value">${this.departments.length}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-title">Số bằng cấp</div>
                        <div class="stat-value">${this.degrees.length}</div>
                    </div>
                </div>

                <div class="charts-container">
                    <div class="chart-section">
                        <h3>Thống kê theo khoa</h3>
                        <div class="chart" id="departmentChart">
                            ${this.renderDepartmentStats()}
                        </div>
                    </div>
                    
                    <div class="chart-section">
                        <h3>Thống kê theo bằng cấp</h3>
                        <div class="chart" id="degreeChart">
                            ${this.renderDegreeStats()}
                        </div>
                    </div>
                </div>

                <div class="detailed-stats">
                    <h3>Chi tiết theo khoa</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Khoa</th>
                                <th>Số lượng giáo viên</th>
                                <th>Tỷ lệ</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.renderDetailedDepartmentStats()}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Add additional styles for statistics page
        const style = document.createElement('style');
        style.textContent = `
            .statistics-container {
                padding: 20px;
            }

            .stats-cards {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }

            .stat-card {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                text-align: center;
            }

            .stat-title {
                font-size: 0.9rem;
                color: #666;
                margin-bottom: 10px;
            }

            .stat-value {
                font-size: 2rem;
                font-weight: bold;
                color: var(--primary-color);
            }

            .charts-container {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }

            .chart-section {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .chart-section h3 {
                margin-bottom: 15px;
                color: var(--primary-color);
            }

            .chart {
                height: 300px;
                overflow: auto;
            }

            .bar-chart {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .bar-item {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .bar-label {
                min-width: 120px;
            }

            .bar-container {
                flex-grow: 1;
                background: #f0f0f0;
                height: 24px;
                border-radius: 12px;
                overflow: hidden;
            }

            .bar {
                height: 100%;
                background: var(--accent-color);
                transition: width 0.3s ease;
            }

            .bar-value {
                min-width: 50px;
                text-align: right;
            }

            .detailed-stats {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .detailed-stats h3 {
                margin-bottom: 15px;
                color: var(--primary-color);
            }
        `;
        document.head.appendChild(style);
    }

    renderDepartmentStats() {
        const departmentCounts = this.getDepartmentCounts();
        const maxCount = Math.max(...Object.values(departmentCounts));

        return `
            <div class="bar-chart">
                ${Object.entries(departmentCounts).map(([deptId, count]) => {
                    const department = this.departments.find(d => d.id === deptId);
                    const percentage = (count / maxCount) * 100;
                    
                    return `
                        <div class="bar-item">
                            <div class="bar-label">${department ? department.shortName : 'N/A'}</div>
                            <div class="bar-container">
                                <div class="bar" style="width: ${percentage}%"></div>
                            </div>
                            <div class="bar-value">${count}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderDegreeStats() {
        const degreeCounts = this.getDegreeCounts();
        const maxCount = Math.max(...Object.values(degreeCounts));

        return `
            <div class="bar-chart">
                ${Object.entries(degreeCounts).map(([degreeId, count]) => {
                    const degree = this.degrees.find(d => d.id === degreeId);
                    const percentage = (count / maxCount) * 100;
                    
                    return `
                        <div class="bar-item">
                            <div class="bar-label">${degree ? degree.shortName : 'N/A'}</div>
                            <div class="bar-container">
                                <div class="bar" style="width: ${percentage}%"></div>
                            </div>
                            <div class="bar-value">${count}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderDetailedDepartmentStats() {
        const departmentCounts = this.getDepartmentCounts();
        const totalTeachers = this.teachers.length;

        return Object.entries(departmentCounts).map(([deptId, count]) => {
            const department = this.departments.find(d => d.id === deptId);
            const percentage = ((count / totalTeachers) * 100).toFixed(1);
            
            return `
                <tr>
                    <td>${department ? department.fullName : 'N/A'}</td>
                    <td>${count}</td>
                    <td>${percentage}%</td>
                </tr>
            `;
        }).join('');
    }

    getDepartmentCounts() {
        return this.teachers.reduce((acc, teacher) => {
            acc[teacher.departmentId] = (acc[teacher.departmentId] || 0) + 1;
            return acc;
        }, {});
    }

    getDegreeCounts() {
        return this.teachers.reduce((acc, teacher) => {
            acc[teacher.degreeId] = (acc[teacher.degreeId] || 0) + 1;
            return acc;
        }, {});
    }
}
