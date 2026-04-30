const mockEmployees = [
  { id: 1, firstName: 'A', lastName: 'A', email: 'a@t.com', phone: '9000000001', department: 'Engineering', designation: 'Dev', salary: 800000, joinDate: '2022-01-01', status: 'Active' },
  { id: 2, firstName: 'B', lastName: 'B', email: 'b@t.com', phone: '9000000002', department: 'Marketing', designation: 'Exec', salary: 600000, joinDate: '2021-06-01', status: 'Active' },
  { id: 3, firstName: 'C', lastName: 'C', email: 'c@t.com', phone: '9000000003', department: 'Engineering', designation: 'QA', salary: 700000, joinDate: '2023-03-10', status: 'Inactive' },
  { id: 4, firstName: 'D', lastName: 'D', email: 'd@t.com', phone: '9000000004', department: 'HR', designation: 'Manager', salary: 550000, joinDate: '2020-11-05', status: 'Active' },
  { id: 5, firstName: 'E', lastName: 'E', email: 'e@t.com', phone: '9000000005', department: 'Finance', designation: 'Analyst', salary: 720000, joinDate: '2019-08-15', status: 'Inactive' },
  { id: 6, firstName: 'F', lastName: 'F', email: 'f@t.com', phone: '9000000006', department: 'Operations', designation: 'Coordinator', salary: 540000, joinDate: '2024-02-20', status: 'Active' }
];

const employeeService = {
  getAll: () => mockEmployees.map(e => ({ ...e }))
};

const dashboardService = {
  getSummary() {
    const all = employeeService.getAll();
    return {
      total: all.length,
      active: all.filter(e => e.status === 'Active').length,
      inactive: all.filter(e => e.status === 'Inactive').length,
      departments: new Set(all.map(e => e.department)).size
    };
  },
  getDepartmentBreakdown() {
    const all = employeeService.getAll();
    const counts = {};
    all.forEach(e => { counts[e.department] = (counts[e.department] || 0) + 1; });
    return Object.entries(counts).map(([dept, count]) => ({
      department: dept,
      count,
      percentage: Math.round((count / all.length) * 100)
    })).sort((a, b) => b.count - a.count);
  },
  getRecentEmployees(n = 5) {
    return employeeService.getAll().sort((a, b) => b.id - a.id).slice(0, n);
  }
};

describe('dashboardService — getSummary', () => {
  test('returns correct total', () => {
    expect(dashboardService.getSummary().total).toBe(6);
  });
  test('returns correct active count', () => {
    expect(dashboardService.getSummary().active).toBe(4);
  });
  test('returns correct inactive count', () => {
    expect(dashboardService.getSummary().inactive).toBe(2);
  });
  test('returns correct department count', () => {
    expect(dashboardService.getSummary().departments).toBe(5);
  });
  test('active + inactive equals total', () => {
    const s = dashboardService.getSummary();
    expect(s.active + s.inactive).toBe(s.total);
  });
});

describe('dashboardService — getDepartmentBreakdown', () => {
  test('returns correct number of departments', () => {
    expect(dashboardService.getDepartmentBreakdown()).toHaveLength(5);
  });
  test('Engineering has count of 2', () => {
    const eng = dashboardService.getDepartmentBreakdown().find(d => d.department === 'Engineering');
    expect(eng.count).toBe(2);
  });
  test('all departments have percentage > 0', () => {
    dashboardService.getDepartmentBreakdown().forEach(d => {
      expect(d.percentage).toBeGreaterThan(0);
    });
  });
  test('percentages are approximately correct (Engineering ~33%)', () => {
    const eng = dashboardService.getDepartmentBreakdown().find(d => d.department === 'Engineering');
    expect(eng.percentage).toBe(33);
  });
  test('sorted descending by count', () => {
    const breakdown = dashboardService.getDepartmentBreakdown();
    for (let i = 0; i < breakdown.length - 1; i++) {
      expect(breakdown[i].count).toBeGreaterThanOrEqual(breakdown[i + 1].count);
    }
  });
});

describe('dashboardService — getRecentEmployees', () => {
  test('returns last 5 by default', () => {
    expect(dashboardService.getRecentEmployees()).toHaveLength(5);
  });
  test('returns correct last-n when n specified', () => {
    expect(dashboardService.getRecentEmployees(3)).toHaveLength(3);
  });
  test('first item has highest id', () => {
    const recent = dashboardService.getRecentEmployees(5);
    expect(recent[0].id).toBe(6);
  });
  test('ordered by id descending', () => {
    const recent = dashboardService.getRecentEmployees(5);
    for (let i = 0; i < recent.length - 1; i++) {
      expect(recent[i].id).toBeGreaterThan(recent[i + 1].id);
    }
  });
});