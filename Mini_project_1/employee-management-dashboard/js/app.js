$(document).ready(function () {

  let currentSearch = '';
  let currentDept = 'all';
  let currentStatus = 'all';

  let currentEmployees = [];
  let currentPage = 1;
  let totalPages = 1;

  // =============================
  // 🔐 VIEW MANAGEMENT
  // =============================
  function showView(view) {
    $('#loginView, #appView').hide();

    if (view === 'login') {
      $('#loginView').show();
    } else {
      $('#appView').show();
    }
  }

  // =============================
  // 🔥 DASHBOARD (FINAL FIX)
  // =============================
  async function refreshDashboard() {
    try {
      const res = await employeeService.getAll(1, 1000);
      const all = res.items || [];

      // 🔢 Cards
      const total = all.length;
      const active = all.filter(e => e.status === 'Active').length;
      const inactive = all.filter(e => e.status === 'Inactive').length;
      const departments = new Set(
        all.map(e => e.department?.trim() || "Unknown")
      ).size;

      $('#cardTotal').text(total);
      $('#cardActive').text(active);
      $('#cardInactive').text(inactive);
      $('#cardDepts').text(departments);

      // =============================
      // 📊 Department Breakdown (FIXED)
      // =============================
      const deptCounts = {};

      all.forEach(e => {
        const dept = e.department?.trim() || "Unknown"; // 🔥 FIX
        deptCounts[dept] = (deptCounts[dept] || 0) + 1;
      });

      const deptBody = $('#departmentTableBody');
      deptBody.empty();

      if (Object.keys(deptCounts).length === 0) {
        deptBody.append(`
          <tr>
            <td colspan="4" class="text-center">No department data available</td>
          </tr>
        `);
      } else {
        Object.entries(deptCounts).forEach(([dept, count]) => {

          const percent = total > 0
            ? Math.round((count / total) * 100)
            : 0;

          deptBody.append(`
            <tr>
              <td>${dept}</td>
              <td>${count}</td>
              <td>
                <div class="progress">
                  <div class="progress-bar" style="width:${percent}%"></div>
                </div>
              </td>
              <td>${percent}%</td>
            </tr>
          `);
        });
      }

      // =============================
      // 🕒 Recent Employees
      // =============================
      const recent = [...all]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);

      const recentContainer = $('#recentEmployeesList');
      recentContainer.empty();

      recent.forEach(e => {
        recentContainer.append(`
          <div class="d-flex justify-content-between border-bottom py-2">
            <div>
              <strong>${e.firstName} ${e.lastName}</strong><br/>
              <small>${e.department || "Unknown"}</small>
            </div>
            <div>
              <span class="badge bg-${e.status === 'Active' ? 'success' : 'danger'}">
                ${e.status}
              </span>
            </div>
          </div>
        `);
      });

    } catch (err) {
      console.error("Dashboard error:", err);
    }
  }

  // =============================
  // 🔥 SECTION CONTROL
  // =============================
  function showSection(section) {
    $('#dashboardSection, #employeesSection').hide();

    if (section === 'dashboard') {
      $('#dashboardSection').show();
      refreshDashboard();
    } else if (section === 'employees') {
      $('#employeesSection').show();
      loadEmployees(1);
    }
  }

  // =============================
  // 🔥 LOAD EMPLOYEES
  // =============================
  async function loadEmployees(page = 1) {
    try {
      const res = await employeeService.getAll(
        page,
        10,
        currentSearch,
        currentDept,
        currentStatus
      );

      currentEmployees = res.items || [];
      currentPage = res.page || 1;
      totalPages = res.totalPages || 1;
 $('#employeeCountLabel').text(
  `Showing ${currentEmployees.length} of ${res.totalCount} employees`
);
      uiService.renderEmployeeTable(currentEmployees);
      uiService.updateEmployeeCount(currentEmployees.length, currentEmployees.length);

      renderPagination();
     

    } catch (err) {
      console.error(err);
      alert("Failed to load employees");
    }
  }

  // =============================
  // 🔥 PAGINATION
  // =============================
  function renderPagination() {
    const container = $('#paginationContainer');
    container.empty();

    if (totalPages <= 1) return;

    let html = '';

    html += `<button ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">Prev</button>`;

    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }

    html += `<button ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">Next</button>`;

    container.html(html);
  }

  $(document).on('click', '#paginationContainer button', function () {
    const page = $(this).data('page');
    if (page) loadEmployees(page);
  });

  // =============================
  // 🔍 FILTERS
  // =============================
  $('#searchInput').on('input', function () {
    currentSearch = $(this).val();
    loadEmployees(1);
  });

  $('#deptFilter').on('change', function () {
    currentDept = $(this).val();
    loadEmployees(1);
  });

  $('.status-filter-btn').on('click', function () {
    $('.status-filter-btn').removeClass('active');
    $(this).addClass('active');

    currentStatus = $(this).data('status');
    loadEmployees(1);
  });

  // =============================
  // 🔐 LOGIN
  // =============================
  $('#loginForm').on('submit', async function (e) {
    e.preventDefault();

    const username = $('#loginUsername').val().trim();
    const password = $('#loginPassword').val();

    const result = await authService.login(username, password);

    if (result.success) {
      showView('app');
      showSection('dashboard');
    } else {
      alert(result.error || "Login failed");
    }
  });

  // =============================
  // 🔐 LOGOUT
  // =============================
  $('#logoutBtn').on('click', function () {
    authService.logout();
    showView('login');
  });

  // =============================
  // 🔥 NAVIGATION
  // =============================
  $('#navDashboard').on('click', function (e) {
    e.preventDefault();
    showSection('dashboard');
  });

  $('#navEmployees').on('click', function (e) {
    e.preventDefault();
    showSection('employees');
  });

  // =============================
  // 🔥 INITIAL LOAD
  // =============================
  if (authService.isLoggedIn()) {
    showView('app');
    showSection('dashboard');
  } else {
    showView('login');
  }
  // =============================
// ➕ ADD EMPLOYEE (FINAL FIX)
// =============================
// =============================
// 🪟 OPEN ADD EMPLOYEE MODAL
// =============================
$(document).on('click', '.openAddModal', function () {

  // Reset form
  $('#employeeForm')[0].reset();

  // Clear hidden id (important for edit vs add)
  $('#editEmployeeId').val('');

  // Set title
  $('#modalTitle').text('Add Employee');

  // Show modal
  const modal = new bootstrap.Modal(
    document.getElementById('addEditEmployeeModal')
  );

  modal.show();
});
$('#employeeForm').on('submit', async function (e) {
  e.preventDefault();

  const data = {
    firstName: $('#empFirstName').val()?.trim(),
    lastName: $('#empLastName').val()?.trim(),
    email: $('#empEmail').val()?.trim(),
    phone: $('#empPhone').val()?.trim(),
    department: $('#empDepartment').val(),
    designation: $('#empDesignation').val()?.trim(),
    status: $('#empStatus').val(),
    salary: $('#empSalary').val()
  };

  // ✅ VALIDATION
  if (!data.firstName) return alert("First name required");
  if (!data.lastName) return alert("Last name required");
  if (!data.email) return alert("Email required");
  if (!data.department) return alert("Department required");
  if (!data.designation) return alert("Designation required");
  if (!data.salary || isNaN(Number(data.salary))) return alert("Valid salary required");

  if (!data.status) data.status = "Active";

  data.salary = Number(data.salary);

  try {
    await employeeService.add(data);

    alert("✅ Employee added successfully");

    // Reset form
    $('#employeeForm')[0].reset();

    // Close modal
    const modal = bootstrap.Modal.getInstance(
      document.getElementById('addEditEmployeeModal')
    );
    if (modal) modal.hide();

    // Refresh employees
    loadEmployees(currentPage);

    // Refresh dashboard
    refreshDashboard();

  } catch (err) {
    console.error("Add Employee Error:", err);
    alert(err.message || "Failed to add employee");
  }
});
 $(document).on('click', '.btn-view', async function () {
  const id = $(this).data('id');

  try {
    const e = await employeeService.getById(id);

    $('#viewModalName').text(`${e.firstName} ${e.lastName}`);
    $('#viewModalEmail').text(e.email);
    $('#viewModalPhone').text(e.phone || '-');
    $('#viewModalDept').text(e.department || '-');
    $('#viewModalDesignation').text(e.designation || '-');
    $('#viewModalSalary').text(e.salary);
    $('#viewModalJoinDate').text(e.joinDate?.split('T')[0]);
    $('#viewModalStatus').text(e.status);

    new bootstrap.Modal(document.getElementById('viewEmployeeModal')).show();
  } catch {
    alert("View failed");
  }
});
$(document).on('click', '.btn-edit', async function () {
  const id = $(this).data('id');

  try {
    const e = await employeeService.getById(id);

    $('#editEmployeeId').val(e.id);
    $('#empFirstName').val(e.firstName);
    $('#empLastName').val(e.lastName);
    $('#empEmail').val(e.email);
    $('#empPhone').val(e.phone);
    $('#empDepartment').val(e.department);
    $('#empDesignation').val(e.designation);
    $('#empSalary').val(e.salary);
    $('#empStatus').val(e.status);

    $('#modalTitle').text("Edit Employee");

    new bootstrap.Modal(document.getElementById('addEditEmployeeModal')).show();
  } catch {
    alert("Edit failed");
  }
});
let deleteId = null;

$(document).on('click', '.btn-delete', function () {
  deleteId = $(this).data('id');
  new bootstrap.Modal(document.getElementById('deleteConfirmModal')).show();
});

$('#confirmDeleteBtn').on('click', async function () {
  try {
    await employeeService.remove(deleteId);

    bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal')).hide();

    loadEmployees(currentPage);
    refreshDashboard();
  } catch {
    alert("Delete failed");
  }
});
async function loadEmployees(page = 1) {
  const res = await employeeService.getAll(
    page,
    10,
    currentSearch,
    currentDept,
    currentStatus
  );

  currentEmployees = res.items;
  currentPage = res.page;
  totalPages = res.totalPages;

  uiService.renderEmployeeTable(currentEmployees);

  renderPagination();
}
function renderPagination() {
  const container = $('#paginationContainer');
  container.empty();

  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    container.append(`
      <button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">
        ${i}
      </button>
    `);
  }
}
$(document).on('click', '.page-btn', function () {
  const page = $(this).data('page');
  loadEmployees(page);
});




});