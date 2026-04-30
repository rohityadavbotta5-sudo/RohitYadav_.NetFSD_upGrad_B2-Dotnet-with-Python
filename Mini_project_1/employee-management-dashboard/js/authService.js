const authService = (() => {

  return {

    async login(username, password) {
      try {
        const res = await fetch(`${window.API_BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          return { success: false, error: data.message || "Invalid credentials." };
        }

        // 🔥 IMPORTANT FIX
        localStorage.setItem("token", data.token);
        localStorage.setItem("currentUser", data.username);

        console.log("TOKEN STORED:", data.token); // debug

        return { success: true, data };

      } catch (error) {
        return { success: false, error: "Network error." };
      }
    },

    logout() {
      localStorage.clear();
    },

    isLoggedIn() {
      return !!localStorage.getItem("token");
    },

    getToken() {
      return localStorage.getItem("token");
    },

    getCurrentUser() {
      return localStorage.getItem("currentUser");
    }

  };

})();