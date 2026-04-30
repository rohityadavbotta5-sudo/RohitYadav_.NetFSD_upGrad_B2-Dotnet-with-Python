const storageService = (() => {
  return {
    setToken(token) {
      localStorage.setItem("token", token);
    },

    getToken() {
      return localStorage.getItem("token");
    },

    removeToken() {
      localStorage.removeItem("token");
    },

    setCurrentUser(username) {
      localStorage.setItem("currentUser", username);
    },

    getCurrentUser() {
      return localStorage.getItem("currentUser");
    },

    removeCurrentUser() {
      localStorage.removeItem("currentUser");
    },

    clearAuth() {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
    }
  };
})();