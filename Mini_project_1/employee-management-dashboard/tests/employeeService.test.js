const mockData = [
  { id: 1, firstName: 'Alice', lastName: 'Brown', email: 'alice@test.com', phone: '9876543210', department: 'Engineering', designation: 'Developer', salary: 800000, joinDate: '2022-01-15', status: 'Active' },
  { id: 2, firstName: 'Bob', lastName: 'Smith', email: 'bob@test.com', phone: '9123456789', department: 'Marketing', designation: 'Exec', salary: 600000, joinDate: '2021-06-01', status: 'Inactive' },
  { id: 3, firstName: 'Carol', lastName: 'Adams', email: 'carol@test.com', phone: '9988776655', department: 'Engineering', designation: 'QA', salary: 700000, joinDate: '2023-03-10', status: 'Active' },
  { id: 4, firstName: 'Dave', lastName: 'Zee', email: 'dave@test.com', phone: '9001122334', department: 'HR', designation: 'Manager', salary: 550000, joinDate: '2020-11-05', status: 'Active' }
];

let store = [];
let nextId = 5;

const storageService = {
  getAll: () => store.map(e => ({ ...e })),
  getById: (id) => { const e = store.find(x => x.id === id); return e ? { ...e } : null; },
  add: (emp) => { const n = { ...emp, id: nextId++ }; store.push(n); return { ...n }; },
  update: (id, data) => { const i = store.findIndex(e => e.id === id); if (i < 0) return null; store[i] = { ...store[i], ...data, id }; return { ...store[i] }; },
  remove: (id) => { const i = store.findIndex(e => e.id === id); if (i < 0) return false; store.splice(i, 1); return true; },
  nextId: () => nextId
};

const employeeService = {
  getAll: () => storageService.getAll(),
  getById: (id) => storageService.getById(id),
  add: (data) => storageService.add(data),
  update: (id, data) => storageService.update(id, data),
  remove: (id) => storageService.remove(id),
  search: (q) => {
    if (!q) return storageService.getAll();
    const ql = q.toLowerCase();
    return storageService.getAll().filter(e =>
      (e.firstName + ' ' + e.lastName).toLowerCase().includes(ql) || e.email.toLowerCase().includes(ql));
  },
  filterByDepartment: (dept) => {
    if (!dept || dept === 'all') return storageService.getAll();
    return storageService.getAll().filter(e => e.department === dept);
  },
  filterByStatus: (status) => {
    if (!status || status === 'all') return storageService.getAll();
    return storageService.getAll().filter(e => e.status === status);
  },
  applyFilters: (search, dept, status) => {
    let r = storageService.getAll();
    if (search) { const q = search.toLowerCase(); r = r.filter(e => (e.firstName+' '+e.lastName).toLowerCase().includes(q)||e.email.toLowerCase().includes(q)); }
    if (dept && dept !== 'all') r = r.filter(e => e.department === dept);
    if (status && status !== 'all') r = r.filter(e => e.status === status);
    return r;
  },
  sortBy: (employees, field, direction) => {
    return [...employees].sort((a, b) => {
      if (field === 'name') { const va = a.lastName.toLowerCase(), vb = b.lastName.toLowerCase(); return direction === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va); }
      if (field === 'salary') return direction === 'asc' ? a.salary - b.salary : b.salary - a.salary;
      if (field === 'joinDate') return direction === 'asc' ? new Date(a.joinDate) - new Date(b.joinDate) : new Date(b.joinDate) - new Date(a.joinDate);
      return 0;
    });
  }
};

beforeEach(() => {
  store = mockData.map(e => ({ ...e }));
  nextId = 5;
});

describe('employeeService — getAll', () => {
  test('returns all 4 employees', () => {
    expect(employeeService.getAll()).toHaveLength(4);
  });
  test('returns copies, not references', () => {
    const all = employeeService.getAll();
    all[0].firstName = 'MUTATED';
    expect(employeeService.getAll()[0].firstName).toBe('Alice');
  });
});

describe('employeeService — getById', () => {
  test('returns correct employee', () => {
    expect(employeeService.getById(2).email).toBe('bob@test.com');
  });
  test('returns null for non-existent id', () => {
    expect(employeeService.getById(999)).toBeNull();
  });
});

describe('employeeService — add', () => {
  test('adds new employee and auto-increments id', () => {
    const emp = employeeService.add({ firstName: 'Eve', lastName: 'Test', email: 'eve@test.com', phone: '9000000000', department: 'Finance', designation: 'Analyst', salary: 700000, joinDate: '2024-01-01', status: 'Active' });
    expect(emp.id).toBe(5);
    expect(employeeService.getAll()).toHaveLength(5);
  });
  test('second add increments id again', () => {
    employeeService.add({ firstName: 'F', lastName: 'G', email: 'f@g.com', phone: '9000000001', department: 'HR', designation: 'Exec', salary: 500000, joinDate: '2024-01-01', status: 'Active' });
    const emp2 = employeeService.add({ firstName: 'H', lastName: 'I', email: 'h@i.com', phone: '9000000002', department: 'HR', designation: 'Exec', salary: 500000, joinDate: '2024-01-01', status: 'Active' });
    expect(emp2.id).toBe(6);
  });
});

describe('employeeService — update', () => {
  test('updates salary of employee', () => {
    employeeService.update(1, { salary: 999999 });
    expect(employeeService.getById(1).salary).toBe(999999);
  });
  test('returns null for non-existent employee', () => {
    expect(employeeService.update(999, { salary: 1 })).toBeNull();
  });
  test('id is preserved after update', () => {
    employeeService.update(3, { firstName: 'Caroline' });
    expect(employeeService.getById(3).id).toBe(3);
  });
});

describe('employeeService — remove', () => {
  test('removes employee by id', () => {
    employeeService.remove(2);
    expect(employeeService.getAll()).toHaveLength(3);
    expect(employeeService.getById(2)).toBeNull();
  });
  test('returns false for non-existent id', () => {
    expect(employeeService.remove(999)).toBe(false);
  });
});

describe('employeeService — search', () => {
  test('finds by first name', () => {
    expect(employeeService.search('alice')).toHaveLength(1);
  });
  test('finds by email', () => {
    expect(employeeService.search('bob@test')).toHaveLength(1);
  });
  test('case-insensitive', () => {
    expect(employeeService.search('CAROL')).toHaveLength(1);
  });
  test('returns all when query empty', () => {
    expect(employeeService.search('')).toHaveLength(4);
  });
  test('returns empty when no match', () => {
    expect(employeeService.search('zzznotfound')).toHaveLength(0);
  });
});

describe('employeeService — filterByDepartment', () => {
  test('filters Engineering employees', () => {
    expect(employeeService.filterByDepartment('Engineering')).toHaveLength(2);
  });
  test('all returned when "all"', () => {
    expect(employeeService.filterByDepartment('all')).toHaveLength(4);
  });
});

describe('employeeService — filterByStatus', () => {
  test('filters Active employees', () => {
    expect(employeeService.filterByStatus('Active')).toHaveLength(3);
  });
  test('filters Inactive employees', () => {
    expect(employeeService.filterByStatus('Inactive')).toHaveLength(1);
  });
});

describe('employeeService — applyFilters', () => {
  test('search + department combined', () => {
    const result = employeeService.applyFilters('alice', 'Engineering', 'all');
    expect(result).toHaveLength(1);
    expect(result[0].email).toBe('alice@test.com');
  });
  test('no match returns empty', () => {
    expect(employeeService.applyFilters('alice', 'Marketing', 'all')).toHaveLength(0);
  });
  test('status filter works in combo', () => {
    expect(employeeService.applyFilters('', 'Engineering', 'Active')).toHaveLength(2);
  });
});

describe('employeeService — sortBy', () => {
  test('sorts by name A-Z', () => {
    const sorted = employeeService.sortBy(employeeService.getAll(), 'name', 'asc');
    expect(sorted[0].lastName).toBe('Adams');
  });
  test('sorts by name Z-A', () => {
    const sorted = employeeService.sortBy(employeeService.getAll(), 'name', 'desc');
    expect(sorted[0].lastName).toBe('Zee');
  });
  test('sorts salary low to high', () => {
    const sorted = employeeService.sortBy(employeeService.getAll(), 'salary', 'asc');
    expect(sorted[0].salary).toBe(550000);
  });
  test('sorts salary high to low', () => {
    const sorted = employeeService.sortBy(employeeService.getAll(), 'salary', 'desc');
    expect(sorted[0].salary).toBe(800000);
  });
  test('sorts joinDate oldest first', () => {
    const sorted = employeeService.sortBy(employeeService.getAll(), 'joinDate', 'asc');
    expect(sorted[0].joinDate).toBe('2020-11-05');
  });
  test('sorts joinDate newest first', () => {
    const sorted = employeeService.sortBy(employeeService.getAll(), 'joinDate', 'desc');
    expect(sorted[0].joinDate).toBe('2023-03-10');
  });
});