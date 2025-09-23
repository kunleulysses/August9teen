/* eslint-disable @typescript-eslint/no-var-requires */
import { User, UserRole } from '../types/auth';

type OidcUserProfile = Record<string, unknown> & {
  sub?: string;
  email?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  realm_access?: { roles?: string[] };
  resource_access?: Record<string, { roles?: string[] }>;
  email_verified?: boolean;
};

type OidcUser = {
  profile: OidcUserProfile;
  access_token?: string;
  id_token?: string;
  expired?: boolean;
};

type UserManagerSettings = {
  authority: string;
  client_id: string;
  redirect_uri: string;
  post_logout_redirect_uri?: string;
  response_type?: string;
  scope?: string;
  automaticSilentRenew?: boolean;
  silent_redirect_uri?: string;
  includeIdTokenInSilentRenew?: boolean;
  accessTokenExpiringNotificationTimeInSeconds?: number;
  loadUserInfo?: boolean;
  userStore?: unknown;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
};

type OidcRuntimeModule = {
  UserManager: new (settings: UserManagerSettings) => {
    events: {
      addUserLoaded(cb: (user: OidcUser) => void): void;
      addUserUnloaded(cb: () => void): void;
      addAccessTokenExpired(cb: () => void): void;
      addAccessTokenExpiring(cb: () => void): void;
      addSilentRenewError(cb: (error: unknown) => void): void;
    };
    signinRedirect(args?: { extraQueryParams?: Record<string, string> }): Promise<void>;
    signinRedirectCallback(): Promise<OidcUser>;
    signinSilent(): Promise<OidcUser>;
    signinSilentCallback(): Promise<void>;
    signoutRedirect(args?: { extraQueryParams?: Record<string, string>; post_logout_redirect_uri?: string }): Promise<void>;
    signoutRedirectCallback(): Promise<void>;
    getUser(): Promise<OidcUser | null>;
    removeUser(): Promise<void>;
  };
  WebStorageStateStore: new (options: { store: any }) => unknown;
};

const isBrowserEnvironment = typeof window !== 'undefined';

let oidcRuntime: OidcRuntimeModule | null = null;
if (isBrowserEnvironment) {
  try {
    // eslint-disable-next-line global-require
    const mod = require('oidc-client-ts');
    oidcRuntime = {
      UserManager: mod.UserManager,
      WebStorageStateStore: mod.WebStorageStateStore,
    };
  } catch (err) {
    console.warn('[oidcService] oidc-client-ts module unavailable; running in no-op mode.');
  }
}

class OIDCService {
  private userManager: InstanceType<OidcRuntimeModule['UserManager']> | null = null;
  private settings: UserManagerSettings;

  constructor() {
    const keycloakUrl = process.env.REACT_APP_KEYCLOAK_URL || 'http://localhost:8082';
    const realm = process.env.REACT_APP_KEYCLOAK_REALM || 'featherweight';
    const clientId = process.env.REACT_APP_KEYCLOAK_CLIENT_ID || 'featherweight-frontend';

    this.settings = {
      authority: `${keycloakUrl}/realms/${realm}`,
      client_id: clientId,
      redirect_uri: isBrowserEnvironment ? `${window.location.origin}/auth/callback` : '',
      post_logout_redirect_uri: isBrowserEnvironment ? `${window.location.origin}/logout` : '',
      response_type: 'code',
      scope: 'openid profile email',
      automaticSilentRenew: true,
      silent_redirect_uri: isBrowserEnvironment ? `${window.location.origin}/auth/silent-callback` : '',
      includeIdTokenInSilentRenew: true,
      
      // Token management
      accessTokenExpiringNotificationTimeInSeconds: 300, // 5 minutes before expiry
      loadUserInfo: true,
      
      // Keycloak specific settings
      metadata: {
        issuer: `${keycloakUrl}/realms/${realm}`,
        authorization_endpoint: `${keycloakUrl}/realms/${realm}/protocol/openid-connect/auth`,
        token_endpoint: `${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`,
        userinfo_endpoint: `${keycloakUrl}/realms/${realm}/protocol/openid-connect/userinfo`,
        end_session_endpoint: `${keycloakUrl}/realms/${realm}/protocol/openid-connect/logout`,
        jwks_uri: `${keycloakUrl}/realms/${realm}/protocol/openid-connect/certs`,
      }
    };

    if (isBrowserEnvironment && oidcRuntime) {
      try {
        const { UserManager, WebStorageStateStore } = oidcRuntime;
        this.settings = {
          ...this.settings,
          userStore: new WebStorageStateStore({ store: window.sessionStorage }),
        };
        this.userManager = new UserManager(this.settings);
      } catch (err) {
        console.warn('[oidcService] Failed to initialize UserManager; falling back to no-op mode.', err);
        this.userManager = null;
      }
    }

    if (this.userManager) {
      // Set up event callbacks
      this.userManager.events.addUserLoaded((user: OidcUser) => {
        console.log('User loaded:', user);
      });

      this.userManager.events.addUserUnloaded(() => {
        console.log('User unloaded');
      });

      this.userManager.events.addAccessTokenExpired(() => {
        console.log('Access token expired');
      });

      this.userManager.events.addAccessTokenExpiring(() => {
        console.log('Access token expiring');
      });

      this.userManager.events.addSilentRenewError((error: unknown) => {
        console.error('Silent renew error:', error);
      });
    }
  }

  // Authentication methods
  async signinRedirect(extraQueryParams?: Record<string, string>): Promise<void> {
    try {
      if (!this.userManager) return;
      await this.userManager.signinRedirect({ extraQueryParams });
    } catch (error) {
      console.error('Signin redirect failed:', error);
      throw new Error('Failed to initiate login');
    }
  }

  async signinRedirectCallback(): Promise<OidcUser> {
    try {
      if (!this.userManager) {
        throw new Error('OIDC user manager not available');
      }
      const user = await this.userManager.signinRedirectCallback();
      return user;
    } catch (error) {
      console.error('Signin callback failed:', error);
      throw new Error('Login callback failed');
    }
  }

  async signinSilent(): Promise<OidcUser | null> {
    try {
      if (!this.userManager) {
        return null;
      }
      const user = await this.userManager.signinSilent();
      return user;
    } catch (error) {
      console.error('Silent signin failed:', error);
      return null;
    }
  }

  async signinSilentCallback(): Promise<void> {
    try {
      if (!this.userManager) return;
      await this.userManager.signinSilentCallback();
    } catch (error) {
      console.error('Silent signin callback failed:', error);
    }
  }

  async signoutRedirect(extraQueryParams?: Record<string, string>): Promise<void> {
    try {
      if (!this.userManager) return;
      await this.userManager.signoutRedirect({
        extraQueryParams,
        post_logout_redirect_uri: isBrowserEnvironment ? `${window.location.origin}/` : undefined,
      });
    } catch (error) {
      console.error('Signout redirect failed:', error);
      throw new Error('Failed to initiate logout');
    }
  }

  async signoutRedirectCallback(): Promise<void> {
    try {
      if (!this.userManager) return;
      await this.userManager.signoutRedirectCallback();
    } catch (error) {
      console.error('Signout callback failed:', error);
      throw new Error('Logout callback failed');
    }
  }

  async getUser(): Promise<OidcUser | null> {
    try {
      if (!this.userManager) return null;
      const user = await this.userManager.getUser();
      return user;
    } catch (error) {
      console.error('Get user failed:', error);
      return null;
    }
  }

  async removeUser(): Promise<void> {
    try {
      if (!this.userManager) return;
      await this.userManager.removeUser();
    } catch (error) {
      console.error('Remove user failed:', error);
    }
  }

  // Token methods
  async getAccessToken(): Promise<string | null> {
    const user = await this.getUser();
    return user?.access_token || null;
  }

  async getIdToken(): Promise<string | null> {
    const user = await this.getUser();
    return user?.id_token || null;
  }

  // User conversion
  convertOidcUserToAppUser(oidcUser: OidcUser): User {
    const profile = oidcUser.profile;
    
    // Extract role from Keycloak roles
    let role = UserRole.VIEWER;
    if ((profile as any).realm_access?.roles?.includes('admin')) {
      role = UserRole.ADMIN;
    } else if ((profile as any).realm_access?.roles?.includes('researcher')) {
      role = UserRole.RESEARCHER;
    } else if ((profile as any).realm_access?.roles?.includes('collaborator')) {
      role = UserRole.COLLABORATOR;
    }

    return {
      id: oidcUser.profile.sub || '',
      email: profile.email || profile.preferred_username || '',
      firstName: profile.given_name || profile.name?.split(' ')[0] || '',
      lastName: profile.family_name || profile.name?.split(' ').slice(1).join(' ') || '',
      role: role,
      isVerified: (profile as any).email_verified || false,
      createdAt: new Date(),
      lastLoginAt: new Date()
    };
  }

  // Keycloak specific methods
  async getUserRoles(): Promise<string[]> {
    const user = await this.getUser();
    return (user?.profile as any)?.realm_access?.roles || [];
  }

  async getResourceRoles(resource: string): Promise<string[]> {
    const user = await this.getUser();
    return (user?.profile as any)?.resource_access?.[resource]?.roles || [];
  }

  async hasRole(role: string): Promise<boolean> {
    const roles = await this.getUserRoles();
    return roles.includes(role);
  }

  async hasAnyRole(roles: string[]): Promise<boolean> {
    const userRoles = await this.getUserRoles();
    return roles.some(role => userRoles.includes(role));
  }

  async hasResourceRole(resource: string, role: string): Promise<boolean> {
    const roles = await this.getResourceRoles(resource);
    return roles.includes(role);
  }

  async getProjectRoles(projectId: string): Promise<string[]> {
    try {
      const token = await this.getAccessToken();
      if (!token) return [];
      
      // This would typically call a backend API to get project-specific roles
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Get project roles failed:', error);
      return [];
    }
  }

  // Utility methods
  isAuthenticated(): Promise<boolean> {
    return this.getUser().then(user => !!user && !user.expired);
  }

  getSettings(): UserManagerSettings {
    return this.settings;
  }

  getUserManager(): InstanceType<OidcRuntimeModule['UserManager']> | null {
    return this.userManager;
  }
}

export const oidcService = new OIDCService();
