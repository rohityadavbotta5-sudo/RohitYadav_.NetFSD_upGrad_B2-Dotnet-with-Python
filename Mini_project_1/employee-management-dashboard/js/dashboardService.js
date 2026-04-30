const dashboardService = (() => {
  return {

    // =============================
    // SUMMARY
    // =============================
    async getSummary() {
      const res = await employeeService.getAll(1, 1000);
      const all = res.items || [];

      return {
        total: all.length,
        active: all.filter(e => e.status === 'Active').length,
        inactive: all.filter(e => e.status === 'Inactive').length,
        departments: new Set(
          all.map(e => e.department?.trim() || "Unknown")
        ).size
      };
    },

    // =============================
    // DEPARTMENT BREAKDOWN
    // =============================
    async getDepartmentBreakdown() {
      const res = await employeeService.getAll(1, 1000);
      const all = res.items || [];

      const deptCounts = {};

      all.forEach(e => {
        const dept = e.department?.trim() || "Unknown";
        deptCounts[dept] = (deptCounts[dept] || 0) + 1;
      });

      return Object.entries(deptCounts).map(([dept, count]) => ({
        department: dept,
        count,
        percentage: all.length
          ? Math.round((count / all.length) * 100)
          : 0
      }));
    },

    // =============================
    // RECENT EMPLOYEES
    // =============================
    async getRecentEmployees(n = 5) {
      const res = await employeeService.getAll(1, 1000);
      const all = res.items || [];

      return all
        .sort((a, b) => b.id - a.id)
        .slice(0, n);
    }

  };
})();