export class DegreeManager {
    constructor() {
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
                <h2>Quản lý danh mục bằng cấp</h2>
                <button class="btn btn-primary" id="addDegreeBtn">
                    <i class="fas fa-plus"></i> Thêm bằng cấp mới
                </button>
            </div>

            <div class="content-body">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên đầy đủ</th>
                            <th>Tên viết tắt</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody id="degreeTableBody">
                        ${this.renderDegreeRows()}
                    </tbody>
                </table>
            </div>

            <!-- Add/Edit Degree Modal -->
            <div class="modal" id="degreeModal">
                <div class="modal-content">
                    <h3 id="modalTitle">Thêm bằng cấp mới</h3>
                    <form id="degreeForm">
                        <div class="form-group">
                            <label for="fullName">Tên đầy đủ:</label>
                            <input type="text" id="fullName" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="shortName">Tên viết tắt:</label>
                            <input type="text" id="shortName" class="form-control" required>
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

    renderDegreeRows() {
        return this.degrees.map((degree, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${degree.fullName}</td>
                <td>${degree.shortName}</td>
                <td>
                    <button class="btn btn-edit" data-id="${degree.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-delete" data-id="${degree.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    attachEventListeners() {
        // Add new degree button
        document.getElementById('addDegreeBtn').addEventListener('click', () => {
            this.showModal();
        });

        // Form submission
        document.getElementById('degreeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveDegree();
        });

        // Edit and Delete buttons
        document.getElementById('degreeTableBody').addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            const id = button.dataset.id;
            if (button.classList.contains('btn-edit')) {
                this.editDegree(id);
            } else if (button.classList.contains('btn-delete')) {
                this.deleteDegree(id);
            }
        });
    }

    showModal(degree = null) {
        const modal = document.getElementById('degreeModal');
        const form = document.getElementById('degreeForm');
        const modalTitle = document.getElementById('modalTitle');

        if (degree) {
            modalTitle.textContent = 'Sửa bằng cấp';
            form.elements.fullName.value = degree.fullName;
            form.elements.shortName.value = degree.shortName;
            form.dataset.id = degree.id;
        } else {
            modalTitle.textContent = 'Thêm bằng cấp mới';
            form.reset();
            delete form.dataset.id;
        }

        modal.classList.add('active');
    }

    saveDegree() {
        const form = document.getElementById('degreeForm');
        const degree = {
            id: form.dataset.id || Date.now().toString(),
            fullName: form.elements.fullName.value,
            shortName: form.elements.shortName.value
        };

        if (form.dataset.id) {
            // Update existing degree
            const index = this.degrees.findIndex(d => d.id === form.dataset.id);
            this.degrees[index] = degree;
        } else {
            // Add new degree
            this.degrees.push(degree);
        }

        // Save to localStorage
        localStorage.setItem('degrees', JSON.stringify(this.degrees));

        // Update UI
        document.getElementById('degreeModal').classList.remove('active');
        document.getElementById('degreeTableBody').innerHTML = this.renderDegreeRows();
    }

    editDegree(id) {
        const degree = this.degrees.find(d => d.id === id);
        if (degree) {
            this.showModal(degree);
        }
    }

    deleteDegree(id) {
        if (confirm('Bạn có chắc chắn muốn xóa bằng cấp này?')) {
            this.degrees = this.degrees.filter(d => d.id !== id);
            localStorage.setItem('degrees', JSON.stringify(this.degrees));
            document.getElementById('degreeTableBody').innerHTML = this.renderDegreeRows();
        }
    }
}
