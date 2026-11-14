import api from "./api.js";

const STORAGE_KEY_USER = "postpilot_user";
const STORAGE_KEY_TOKEN = "postpilot_auth_token";

const DEFAULT_USER = {
  id: "usr-div-01",
  name: "Rajesh Kumar, IPoS",
  role: "Divisional Officer",
  designation: "Senior Superintendent of Post Offices (SSPO)",
  division: "New Delhi South Division",
  circle: "Delhi Circle",
  email: "rajesh.kumar.ipos@indiapost.gov.in",
  avatarUrl: null,
  employeeId: "DOP-DL-2014-0892",
  department: "Department of Posts, Ministry of Communications",
  lastLogin: new Date().toISOString()
};

const isBrowser = typeof localStorage !== "undefined" && typeof localStorage.getItem === "function";

export const authService = {
  getCurrentUser() {
    try {
      if (isBrowser) {
        const stored = localStorage.getItem(STORAGE_KEY_USER);
        if (stored) {
          return JSON.parse(stored);
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_USER;
  },

  async login(credentials) {
    // Check if backend provides an auth endpoint
    try {
      const res = await api.post("/auth/login", credentials);
      if (res.data?.token) {
        if (isBrowser) {
          localStorage.setItem(STORAGE_KEY_TOKEN, res.data.token);
          if (res.data.user) {
            localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(res.data.user));
            return res.data.user;
          }
        }
      }
    } catch {
      // Backend auth not yet implemented by Member 1 -> standard demo login
    }

    // Role-based simulation
    const roleMapping = {
      "divisional_officer": {
        role: "Divisional Officer",
        name: "Rajesh Kumar, IPoS",
        designation: "Senior Superintendent of Post Offices (SSPO)"
      },
      "superintendent": {
        role: "Assistant Superintendent",
        name: "Pooja Sharma",
        designation: "Assistant Superintendent of Post Offices (ASPO)"
      },
      "inspector": {
        role: "Inspector of Posts",
        name: "Vikram Malhotra",
        designation: "Inspector Posts (IP - South Sub-Div)"
      }
    };

    const selectedRole = roleMapping[credentials.role] || roleMapping["divisional_officer"];

    const user = {
      ...DEFAULT_USER,
      name: credentials.username ? `${credentials.username}` : selectedRole.name,
      role: selectedRole.role,
      designation: selectedRole.designation,
      lastLogin: new Date().toISOString()
    };

    if (isBrowser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEY_TOKEN, "demo_jwt_token_postpilot_disu_2026");
    }
    return user;
  },

  logout() {
    if (isBrowser) {
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_TOKEN);
    }
  },

  updateProfile(profileData) {
    const current = this.getCurrentUser();
    const updated = { ...current, ...profileData };
    if (isBrowser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
    }
    return updated;
  }
};
