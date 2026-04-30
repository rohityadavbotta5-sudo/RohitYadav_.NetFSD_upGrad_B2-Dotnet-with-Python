const uiService = (() => {
  const DEPT_COLORS = {
    'Engineering': 'dept-engineering',
    'Marketing': 'dept-marketing',
    'HR': 'dept-hr',
    'Finance': 'dept-finance',
    'Operations': 'dept-operations'
  };

  function getInitials(firstName, lastName) {
    return ((firstName || "").charAt(0) + (lastName || "").charAt(0)).toUpperCase();
  }

  function formatSalary(salary) {
    return '₹' + Number(salary || 0).toLocaleString('en-IN');
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function avatarColor(name) {
    const colors = ['#3B82F6','#8B5CF6','#10B981','#F59E0B','#EF4444','#06B6D4','#EC4899','#6366F1'];
    let hash = 0;
    for (let i = 0; i < (name || "").length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }

  return {
    renderEmployeeTable(employees) {
      const tbody = $('#employeeTableBody');
      tbody.empty();

      if (!employees || employees.length === 0) {
        tbody.html(`<tr><td colspan="9" class="text-center py-5 text-muted empty-state">
          <i class="bi bi-search fs-3 d-block mb-2"></i>No employees found matching your criteria.
        </td></tr>`);
        return;
      }

      employees.forEach((emp, idx) => {
        const initials = getInitials(emp.firstName, emp.lastName);
        const bgColor = avatarColor(emp.firstName + emp.lastName);
        const statusClass = emp.status === 'Active' ? 'status-active' : 'status-inactive';
        const deptClass = DEPT_COLORS[emp.department] || 'dept-operations';

        const row = `
          <tr class="${idx % 2 === 0 ? '' : 'table-row-alt'}">
            <td class="fw-semibold text-muted">#${emp.id}</td>
            <td>
              <div class="d-flex align-items-center gap-2">
                <div class="emp-avatar" style="background:${bgColor}">${initials}</div>
                <span class="fw-semibold">${emp.firstName} ${emp.lastName}</span>
              </div>
            </td>
            <td class="text-muted small">${emp.email}</td>
            <td><span class="dept-badge ${deptClass}">${emp.department || ''}</span></td>
            <td class="text-muted">${emp.designation || ''}</td>
            <td class="fw-semibold">${formatSalary(emp.salary)}</td>
            <td class="text-muted">${formatDate(emp.joinDate)}</td>
            <td><span class="status-badge ${statusClass}">${emp.status}</span></td>
            <td>
              <div class="d-flex gap-1">
                <button class="btn-action btn-view" title="View" data-id="${emp.id}"><i class="bi bi-eye"></i></button>
                <button class="btn-action btn-edit" title="Edit" data-id="${emp.id}"><i class="bi bi-pencil"></i></button>
                <button class="btn-action btn-delete" title="Delete" data-id="${emp.id}"><i class="bi bi-trash"></i></button>
              </div>
            </td>
          </tr>`;
        tbody.append(row);
      });
    },

    renderDashboardCards(summary) {
      $('#cardTotal').text(summary.totalEmployees ?? summary.total ?? 0);
      $('#cardActive').text(summary.activeCount ?? summary.active ?? 0);
      $('#cardInactive').text(summary.inactiveCount ?? summary.inactive ?? 0);
      $('#cardDepts').text(summary.totalDepartments ?? summary.departments ?? 0);
    },

    renderDepartmentBreakdown(data) {
      const tbody = $('#deptBreakdownBody');
      tbody.empty();

      (data || []).forEach(d => {
        const deptClass = DEPT_COLORS[d.department] || 'dept-operations';
        tbody.append(`
          <tr>
            <td><span class="dept-badge ${deptClass}">${d.department}</span></td>
            <td class="fw-semibold">${d.count}</td>
            <td style="width:200px">
              <div class="dept-bar-track">
                <div class="dept-bar-fill ${deptClass}-bar" style="width:${d.percentage}%"></div>
              </div>
            </td>
            <td class="text-muted">${d.percentage}%</td>
          </tr>`);
      });
    },

    renderRecentEmployees(employees) {
      const list = $('#recentEmployeesList');
      list.empty();

      (employees || []).forEach(emp => {
        const initials = getInitials(emp.firstName, emp.lastName);
        const bgColor = avatarColor(emp.firstName + emp.lastName);
        const statusClass = emp.status === 'Active' ? 'status-active' : 'status-inactive';
        const deptClass = DEPT_COLORS[emp.department] || 'dept-operations';

        list.append(`
          <div class="recent-emp-item d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-2">
              <div class="emp-avatar emp-avatar-sm" style="background:${bgColor}">${initials}</div>
              <div>
                <div class="fw-semibold small">${emp.firstName} ${emp.lastName}</div>
                <div class="text-muted" style="font-size:0.75rem">${emp.designation || ''}</div>
              </div>
            </div>
            <div class="d-flex gap-1 align-items-center">
              <span class="dept-badge ${deptClass}">${emp.department || ''}</span>
              <span class="status-badge ${statusClass}">${emp.status}</span>
            </div>
          </div>`);
      });
    },

    showViewModal(employee) {
      const initials = getInitials(employee.firstName, employee.lastName);
      const bgColor = avatarColor(employee.firstName + employee.lastName);
      const statusClass = employee.status === 'Active' ? 'status-active' : 'status-inactive';
      const deptClass = DEPT_COLORS[employee.department] || 'dept-operations';

      $('#viewModalAvatar').css('background', bgColor).text(initials);
      $('#viewModalName').text(employee.firstName + ' ' + employee.lastName);
      $('#viewModalDept').attr('class', 'dept-badge ' + deptClass).text(employee.department || '');
      $('#viewModalEmail').text(employee.email || '');
      $('#viewModalPhone').text(employee.phone || '');
      $('#viewModalDesignation').text(employee.designation || '');
      $('#viewModalSalary').text(formatSalary(employee.salary));
      $('#viewModalJoinDate').text(formatDate(employee.joinDate));
      $('#viewModalStatus').attr('class', 'status-badge ' + statusClass).text(employee.status || '');

      const modal = new bootstrap.Modal(document.getElementById('viewEmployeeModal'));
      modal.show();
    },

    showAddEditModal(employee = null) {
      this.clearForm();
      if (employee) {
        $('#modalTitle').text('Edit Employee');
        $('#employeeFormSubmitBtn').text('Update Employee');
        $('#editEmployeeId').val(employee.id);
        $('#empFirstName').val(employee.firstName);
        $('#empLastName').val(employee.lastName);
        $('#empEmail').val(employee.email);
        $('#empPhone').val(employee.phone);
        $('#empDepartment').val(employee.department);
        $('#empDesignation').val(employee.designation);
        $('#empSalary').val(employee.salary);
        $('#empJoinDate').val(employee.joinDate);
        $('#empStatus').val(employee.status);
      } else {
        $('#modalTitle').text('Add Employee');
        $('#employeeFormSubmitBtn').text('Save Employee');
        $('#editEmployeeId').val('');
      }

      const modal = new bootstrap.Modal(document.getElementById('addEditEmployeeModal'));
      modal.show();
    },

    showDeleteModal(employee) {
      $('#deleteEmployeeName').text(employee.firstName + ' ' + employee.lastName);
      $('#confirmDeleteBtn').attr('data-id', employee.id);
      const modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
      modal.show();
    },

    showToast(message, type = 'success') {
      const icon = type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill';
      const bgClass = type === 'success' ? 'toast-success' : 'toast-error';
      const toast = $(`
        <div class="toast-item ${bgClass} d-flex align-items-center gap-2">
          <i class="bi ${icon}"></i>
          <span>${message}</span>
        </div>`);
      $('#toastContainer').append(toast);
      setTimeout(() => toast.addClass('show'), 10);
      setTimeout(() => {
        toast.removeClass('show');
        setTimeout(() => toast.remove(), 400);
      }, 3500);
    },

    showInlineErrors(errors, prefix = '') {
      Object.keys(errors).forEach(field => {
        const id = prefix + field.charAt(0).toUpperCase() + field.slice(1) + 'Error';
        $(`#${id}`).text(errors[field]).show();
        $(`#${prefix}${field.charAt(0).toUpperCase() + field.slice(1)}, #${prefix}${field}`).addClass('is-invalid');
      });
    },

    clearForm() {
      $('#employeeForm')[0].reset();
      $('#editEmployeeId').val('');
      $('.field-error').text('').hide();
      $('.form-control, .form-select').removeClass('is-invalid');
    },

    clearAuthErrors() {
      $('#loginView .field-error, #signupView .field-error').text('').hide();
      $('#loginGeneralError').hide();
      $('#loginView .form-control, #signupView .form-control').removeClass('is-invalid');
    },

    updateEmployeeCount(count, total) {
      $('#employeeCountLabel').text(`Showing ${count} of ${total} employees`);
    },

    async refreshDashboard() {
  const summary = await dashboardService.getSummary();
  this.renderDashboardCards(summary);

  const breakdown = await dashboardService.getDepartmentBreakdown();
  this.renderDepartmentBreakdown(breakdown);

  const recent = await dashboardService.getRecentEmployees(5);
  this.renderRecentEmployees(recent);
}
  };
})();