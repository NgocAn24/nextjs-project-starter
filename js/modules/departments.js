export class DepartmentManager {
    constructor() {
        this.departments = JSON.parse(localStorage.getItem('departments')) || [];
    }

    init(container) {
        this.container = container;
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="page-header">
                <h2>Quản lý khoa</h2>
                <button class="btn btn-primary" id="addDepartmentBtn">
                    <i class="fas fa-plus"></i> Thêm khoa mới
                </button>
            </div>

            <div class="content-body">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên đầy đủ</th>
                            <th>Tên viết tắt</th>
                            <th>Mô tả nhiệm vụ</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody id="departmentTableBody">
                        ${this.renderDepartmentRows()}
                    </tbody>
                </table>
            </div>

            <!-- Add/Edit Department Modal -->
            <div class="modal" id="departmentModal">
                <div class="modal-content">
                    <h3 id="modalTitle">Thêm khoa mới</h3>
                    <form id="departmentForm">
                        <div class="form-group">
                            <label for="fullName">Tên đầy đủ:</label>
                            <input type="text" id="fullName" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="shortName">Tên viết tắt:</label>
                            <input type="text" id="shortName" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="description">Mô tả nhiệm vụ:</label>
                            <textarea id="description" class="form-control" rows="4" required></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Lưu</button>
                            <button type="button" class="btn" onclick="this.closest('.modal').classList.remove('active')">Hủy</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    renderDepartmentRows() {
        return this.departments.map((dept, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${dept.fullName}</td>
                <td>${dept.shortName}</td>
                <td>${dept.description}</td>
                <td>
                    <button class="btn btn-edit" data-id="${dept.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-delete" data-id="${dept.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    attachEventListeners() {
        // Add new department button
        document.getElementById('addDepartmentBtn').addEventListener('click', () => {
            this.showModal();
        });

        // Form submission
        document.getElementById('departmentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveDepartment();
        });

        // Edit and Delete buttons
        document.getElementById('departmentTableBody').addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            const id = button.dataset.id;
            if (button.classList.contains('btn-edit')) {
                this.editDepartment(id);
            } else if (button.classList.contains('btn-delete')) {
                this.deleteDepartment(id);
            }
        });
    }

    showModal(department = null) {
        const modal = document.getElementById('departmentModal');
        const form = document.getElementById('departmentForm');
        const modalTitle = document.getElementById('modalTitle');

        if (department) {
            modalTitle.textContent = 'Sửa thông tin khoa';
            form.elements.fullName.value = department.fullName;
            form.elements.shortName.value = department.shortName;
            form.elements.description.value = department.description;
            form.dataset.id = department.id;
        } else {
            modalTitle.textContent = 'Thêm khoa mới';
            form.reset();
            delete form.dataset.id;
        }

        modal.classList.add('active');
    }

    saveDepartment() {
        const form = document.getElementById('departmentForm');
        const department = {
            id: form.dataset.id || Date.now().toString(),
            fullName: form.elements.fullName.value,
            shortName: form.elements.shortName.value,
            description: form.elements.description.value
        };

        if (form.dataset.id) {
            // Update existing department
            const index = this.departments.findIndex(d => d.id === form.dataset.id);
            this.departments[index] = department;
        } else {
            // Add new department
            this.departments.push(department);
        }

        // Save to localStorage
        localStorage.setItem('departments', JSON.stringify(this.departments));

        // Update UI
        document.getElementById('departmentModal').classList.remove('active');
        document.getElementById('departmentTableBody').innerHTML = this.renderDepartmentRows();
    }

    editDepartment(id) {
        const department = this.departments.find(d => d.id === id);
        if (department) {
            this.showModal(department);
        }
    }

    deleteDepartment(id) {
        if (confirm('Bạn có chắc chắn muốn xóa khoa này?')) {
            this.departments = this.departments.filter(d => d.id !== id);
            localStorage.setItem('departments', JSON.stringify(this.departments));
            document.getElementById('departmentTableBody').innerHTML = this.renderDepartmentRows();
        }
    }
}
