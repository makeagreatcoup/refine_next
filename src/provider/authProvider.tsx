import { AuthBindings } from "@refinedev/core";

const mockUsers = [{ email: "john@mail.com" }, { email: "jane@mail.com" }];

type AuthActionResponse = {
  success: boolean;
  redirectTo?: string;
  error?: Error;
  [key: string]: unknown;
};

type CheckResponse = {
  authenticated: boolean;
  redirectTo?: string;
  logout?: boolean;
  error?: Error;
};

type OnErrorResponse = {
  redirectTo?: string;
  logout?: boolean;
  error?: Error;
};
export const authProvider: AuthBindings = {
    login: async ({ email, password }): Promise<AuthActionResponse>  => {
        // Suppose we actually send a request to the back end here.
        const user = mockUsers.find((item) => item.email === email);

        if (user) {
            localStorage.setItem("auth", JSON.stringify(user));
            return {
                success: true,
                redirectTo: "/",
            };
        }

        return {
            success: false,
            error: {
                message: "Login Error",
                name: "Invalid email or password",
            },
        };
    },
    logout: async (): Promise<AuthActionResponse>   => {
      localStorage.removeItem("auth");
      return {
          success: true,
          redirectTo: "/login",
      };
    },
    register: async ({ email }) => {
      const user = mockUsers.find((user) => user.email === email);

      if (user) {
          return {
              success: false,
              error: {
                  name: "Register Error",
                  message: "User already exists",
              },
          };
      }

      mockUsers.push({ email });

      return {
          success: true,
          redirectTo: "/login",
      };
  },
  forgotPassword: async ({ email }) => {
    // send password reset link to the user's email address here

    // if request is successful
    return {
        success: true,
        redirectTo: "/login",
    };

    // if request is not successful
    return {
        success: false,
        error: {
            name: "Forgot Password Error",
            message: "Email address does not exist",
        },
    };
},
updatePassword: async ({ password }) => {
  // update the user's password here

  // if request is successful
  return {
      success: true,
      redirectTo: "/login",
  };

  // if request is not successful
  return {
      success: false,
      error: {
          name: "Forgot Password Error",
          message: "Email address does not exist",
      },
  };
},
    onError: async (error):Promise<OnErrorResponse>  => {
      if (error.status === 401 || error.status === 403) {
          return {
              logout: true,
              redirectTo: "/login",
              error,
          };
      }

      return {};
    },
    // ---
    check: async (): Promise<CheckResponse>  => {
      const user = localStorage.getItem("auth");

      if (user) {
          return {
              authenticated: true,
          };
      }

      return {
          authenticated: false,
          logout: true,
          redirectTo: "/login",
          error: {
              message: "Check failed",
              name: "Unauthorized",
          },
      };
  },
  getPermissions: async () => {
    return null;
  },
  getIdentity: async (data) => {
    if (data?.user) {
      const { user } = data;
      return {
        name: user.name,
        avatar: user.image,
      };
    }

    return null;
  },
};