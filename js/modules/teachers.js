export class TeacherManager {
    constructor() {
        this.teachers = JSON.parse(localStorage.getItem('teachers')) || [];
        this.departments = JSON.parse(localStorage.getItem('departments')) || [];
        this.degrees = JSON.parse(localStorage.getItem('degrees')) || [];
    }

    init(container) {
        this.container = container;
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="page-header">
                <h2>Quản lý giáo viên</h2>
                <button class="btn btn-primary" id="addTeacherBtn">
                    <i class="fas fa-plus"></i> Thêm giáo viên mới
                </button>
            </div>

            <div class="content-body">
                <div class="filters">
                    <div class="form-group">
                        <input type="text" id="searchTeacher" class="form-control" placeholder="Tìm kiếm giáo viên...">
                    </div>
                    <div class="form-group">
                        <select id="departmentFilter" class="form-control">
                            <option value="">Tất cả khoa</option>
                            ${this.renderDepartmentOptions()}
                        </select>
                    </div>
                </div>

                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Mã số</th>
                            <th>Họ tên</th>
                            <th>Ngày sinh</th>
                            <th>Điện thoại</th>
                            <th>Email</th>
                            <th>Khoa</th>
                            <th>Bằng cấp</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody id="teacherTableBody">
                        ${this.renderTeacherRows()}
                    </tbody>
                </table>
            </div>

            <!-- Add/Edit Teacher Modal -->
            <div class="modal" id="teacherModal">
                <div class="modal-content">
                    <h3 id="modalTitle">Thêm giáo viên mới</h3>
                    <form id="teacherForm">
                        <div class="form-group">
                            <label for="teacherId">Mã số:</label>
                            <input type="text" id="teacherId" class="form-control" required>
                            <button type="button" id="generateId" class="btn">Tạo mã tự động</button>
                        </div>
                        <div class="form-group">
                            <label for="fullName">Họ tên:</label>
                            <input type="text" id="fullName" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="birthDate">Ngày sinh:</label>
                            <input type="date" id="birthDate" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="phone">Điện thoại:</label>
                            <input type="tel" id="phone" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email:</label>
                            <input type="email" id="email" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="department">Khoa:</label>
                            <select id="department" class="form-control" required>
                                <option value="">Chọn khoa</option>
                                ${this.renderDepartmentOptions()}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="degree">Bằng cấp:</label>
                            <select id="degree" class="form-control" required>
                                <option value="">Chọn bằng cấp</option>
                                ${this.renderDegreeOptions()}
                            </select>
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

    renderTeacherRows() {
        return this.teachers.map(teacher => {
            const department = this.departments.find(d => d.id === teacher.departmentId);
            const degree = this.degrees.find(d => d.id === teacher.degreeId);
            
            return `
                <tr>
                    <td>${teacher.id}</td>
                    <td>${teacher.fullName}</td>
                    <td>${new Date(teacher.birthDate).toLocaleDateString('vi-VN')}</td>
                    <td>${teacher.phone}</td>
                    <td>${teacher.email}</td>
                    <td>${department ? department.shortName : ''}</td>
                    <td>${degree ? degree.shortName : ''}</td>
                    <td>
                        <button class="btn btn-edit" data-id="${teacher.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-delete" data-id="${teacher.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    renderDepartmentOptions() {
        return this.departments.map(dept => 
            `<option value="${dept.id}">${dept.fullName}</option>`
        ).join('');
    }

    renderDegreeOptions() {
        return this.degrees.map(degree => 
            `<option value="${degree.id}">${degree.fullName}</option>`
        ).join('');
    }

    attachEventListeners() {
        // Add new teacher button
        document.getElementById('addTeacherBtn').addEventListener('click', () => {
            this.showModal();
        });

        // Generate ID button
        document.getElementById('generateId').addEventListener('click', () => {
            const teacherId = document.getElementById('teacherId');
            teacherId.value = this.generateTeacherId();
        });

        // Form submission
        document.getElementById('teacherForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTeacher();
        });

        // Search functionality
        document.getElementById('searchTeacher').addEventListener('input', (e) => {
            this.filterTeachers();
        });

        // Department filter
        document.getElementById('departmentFilter').addEventListener('change', () => {
            this.filterTeachers();
        });

        // Edit and Delete buttons
        document.getElementById('teacherTableBody').addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            const id = button.dataset.id;
            if (button.classList.contains('btn-edit')) {
                this.editTeacher(id);
            } else if (button.classList.contains('btn-delete')) {
                this.deleteTeacher(id);
            }
        });
    }

    generateTeacherId() {
        const prefix = 'GV';
        const timestamp = Date.now().toString().slice(-4);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}${timestamp}${random}`;
    }

    showModal(teacher = null) {
        const modal = document.getElementById('teacherModal');
        const form = document.getElementById('teacherForm');
        const modalTitle = document.getElementById('modalTitle');

        if (teacher) {
            modalTitle.textContent = 'Sửa thông tin giáo viên';
            form.elements.teacherId.value = teacher.id;
            form.elements.fullName.value = teacher.fullName;
            form.elements.birthDate.value = teacher.birthDate;
            form.elements.phone.value = teacher.phone;
            form.elements.email.value = teacher.email;
            form.elements.department.value = teacher.departmentId;
            form.elements.degree.value = teacher.degreeId;
            form.dataset.id = teacher.id;
        } else {
            modalTitle.textContent = 'Thêm giáo viên mới';
            form.reset();
            delete form.dataset.id;
        }

        modal.classList.add('active');
    }

    saveTeacher() {
        const form = document.getElementById('teacherForm');
        const teacher = {
            id: form.elements.teacherId.value,
            fullName: form.elements.fullName.value,
            birthDate: form.elements.birthDate.value,
            phone: form.elements.phone.value,
            email: form.elements.email.value,
            departmentId: form.elements.department.value,
            degreeId: form.elements.degree.value
        };

        if (form.dataset.id) {
            // Update existing teacher
            const index = this.teachers.findIndex(t => t.id === form.dataset.id);
            this.teachers[index] = teacher;
        } else {
            // Add new teacher
            this.teachers.push(teacher);
        }

        // Save to localStorage
        localStorage.setItem('teachers', JSON.stringify(this.teachers));

        // Update UI
        document.getElementById('teacherModal').classList.remove('active');
        document.getElementById('teacherTableBody').innerHTML = this.renderTeacherRows();
    }

    editTeacher(id) {
        const teacher = this.teachers.find(t => t.id === id);
        if (teacher) {
            this.showModal(teacher);
        }
    }

    deleteTeacher(id) {
        if (confirm('Bạn có chắc chắn muốn xóa giáo viên này?')) {
            this.teachers = this.teachers.filter(t => t.id !== id);
            localStorage.setItem('teachers', JSON.stringify(this.teachers));
            document.getElementById('teacherTableBody').innerHTML = this.renderTeacherRows();
        }
    }

    filterTeachers() {
        const searchTerm = document.getElementById('searchTeacher').value.toLowerCase();
        const departmentId = document.getElementById('departmentFilter').value;

        const filteredTeachers = this.teachers.filter(teacher => {
            const matchesSearch = 
                teacher.fullName.toLowerCase().includes(searchTerm) ||
                teacher.id.toLowerCase().includes(searchTerm) ||
                teacher.email.toLowerCase().includes(searchTerm);

            const matchesDepartment = !departmentId || teacher.departmentId === departmentId;

            return matchesSearch && matchesDepartment;
        });

        const tbody = document.getElementById('teacherTableBody');
        tbody.innerHTML = filteredTeachers.map(teacher => {
            const department = this.departments.find(d => d.id === teacher.departmentId);
            const degree = this.degrees.find(d => d.id === teacher.degreeId);
            
            return `
                <tr>
                    <td>${teacher.id}</td>
                    <td>${teacher.fullName}</td>
                    <td>${new Date(teacher.birthDate).toLocaleDateString('vi-VN')}</td>
                    <td>${teacher.phone}</td>
                    <td>${teacher.email}</td>
                    <td>${department ? department.shortName : ''}</td>
                    <td>${degree ? degree.shortName : ''}</td>
                    <td>
                        <button class="btn btn-edit" data-id="${teacher.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-delete" data-id="${teacher.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }
}
