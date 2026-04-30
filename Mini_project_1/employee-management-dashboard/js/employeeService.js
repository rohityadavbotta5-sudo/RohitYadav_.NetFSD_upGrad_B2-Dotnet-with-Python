const employeeService = (() => {

  async function request(url, options = {}) {
    const token = localStorage.getItem("token"); // 🔥 FIXED

    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {})
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.warn("🚨 No token found");
    }

    const res = await fetch(`${window.API_BASE_URL}${url}`, {
      ...options,
      headers
    });

    // 🔥 HANDLE AUTH ERRORS
    if (res.status === 401 || res.status === 403) {
      alert("Session expired. Please login again.");
      localStorage.clear();
      window.location.reload();
      return;
    }

    const contentType = res.headers.get("content-type");
    const data = contentType && contentType.includes("application/json")
      ? await res.json()
      : null;

    if (!res.ok) {
      throw new Error(data?.message || data?.error || "Request failed.");
    }

    return data;
  }

  function mapEmployee(dto) {
    return {
      id: dto.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      department: dto.department,
      designation: dto.designation,
      status: dto.status,
      salary: dto.salary,
      joinDate: dto.createdAt
    };
  }

  return {

    async getAll(page = 1, pageSize = 10, search = "", dept = "", status = "") {
      let query = `?page=${page}&pageSize=${pageSize}`;

      if (search) query += `&search=${encodeURIComponent(search)}`;
      if (dept && dept !== "all") query += `&department=${encodeURIComponent(dept)}`;
      if (status && status !== "all") query += `&status=${encodeURIComponent(status)}`;

      const data = await request(`/api/employees${query}`);

      return {
        items: (data?.items || []).map(mapEmployee),
        page: data?.page || 1,
        pageSize: data?.pageSize || pageSize,
        totalPages: data?.totalPages || 1,
        totalCount: data?.totalCount || 0
      };
    },

    async getById(id) {
      const data = await request(`/api/employees/${id}`);
      return mapEmployee(data);
    },

    async add(data) {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || null,
        department: data.department,
        designation: data.designation || null,
        status: data.status || "Active",
        salary: Number(data.salary)
      };

      const result = await request(`/api/employees`, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      return mapEmployee(result);
    },

    async update(id, data) {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || null,
        department: data.department,
        designation: data.designation || null,
        status: data.status || "Active",
        salary: Number(data.salary)
      };

      const result = await request(`/api/employees/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });

      return mapEmployee(result);
    },

    async remove(id) {
      await request(`/api/employees/${id}`, {
        method: "DELETE"
      });
      return true;
    }

  };
})();