let adminsStore = [];

const storageService = {
  getAllAdmins: () => adminsStore.map(a => ({ ...a })),
  addAdmin: (admin) => adminsStore.push({ ...admin }),
  findAdmin: (username) => { const a = adminsStore.find(x => x.username === username); return a ? { ...a } : null; }
};

const authService = (() => {
  let _isLoggedIn = false;
  let _currentUser = null;
  return {
    signup(username, password) {
      if (storageService.findAdmin(username)) return { success: false, error: 'Username already exists.' };
      storageService.addAdmin({ username, password });
      return { success: true };
    },
    login(username, password) {
      const admin = storageService.findAdmin(username);
      if (!admin || admin.password !== password) return { success: false, error: 'Invalid credentials.' };
      _isLoggedIn = true; _currentUser = username;
      return { success: true };
    },
    logout() { _isLoggedIn = false; _currentUser = null; },
    isLoggedIn() { return _isLoggedIn; },
    getCurrentUser() { return _currentUser; }
  };
})();

beforeEach(() => {
  adminsStore = [{ username: 'admin', password: 'admin123' }];
  authService.logout();
});

describe('authService — signup', () => {
  test('creates a new admin successfully', () => {
    const r = authService.signup('newuser', 'password1');
    expect(r.success).toBe(true);
  });
  test('rejects duplicate username', () => {
    const r = authService.signup('admin', 'anypass');
    expect(r.success).toBe(false);
    expect(r.error).toMatch(/already exists/i);
  });
  test('new admin can then login', () => {
    authService.signup('testadmin', 'mypassword');
    const r = authService.login('testadmin', 'mypassword');
    expect(r.success).toBe(true);
  });
});

describe('authService — login', () => {
  test('logs in with correct credentials', () => {
    const r = authService.login('admin', 'admin123');
    expect(r.success).toBe(true);
  });
  test('rejects wrong password', () => {
    const r = authService.login('admin', 'wrongpass');
    expect(r.success).toBe(false);
    expect(r.error).toMatch(/invalid/i);
  });
  test('rejects unknown username', () => {
    const r = authService.login('nobody', 'admin123');
    expect(r.success).toBe(false);
  });
  test('does not reveal which field was wrong', () => {
    const r = authService.login('admin', 'bad');
    expect(r.error).not.toMatch(/password/i);
    expect(r.error).not.toMatch(/username/i);
  });
});

describe('authService — session state', () => {
  test('isLoggedIn is false initially', () => {
    expect(authService.isLoggedIn()).toBe(false);
  });
  test('isLoggedIn is true after login', () => {
    authService.login('admin', 'admin123');
    expect(authService.isLoggedIn()).toBe(true);
  });
  test('getCurrentUser returns username after login', () => {
    authService.login('admin', 'admin123');
    expect(authService.getCurrentUser()).toBe('admin');
  });
  test('isLoggedIn is false after logout', () => {
    authService.login('admin', 'admin123');
    authService.logout();
    expect(authService.isLoggedIn()).toBe(false);
  });
  test('getCurrentUser is null after logout', () => {
    authService.login('admin', 'admin123');
    authService.logout();
    expect(authService.getCurrentUser()).toBeNull();
  });
});