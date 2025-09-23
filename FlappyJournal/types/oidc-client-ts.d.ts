declare module 'oidc-client-ts' {
  export interface UserProfile {
    sub?: string;
    email?: string;
    preferred_username?: string;
    given_name?: string;
    family_name?: string;
    name?: string;
    [key: string]: unknown;
  }

  export interface User {
    profile: UserProfile;
    access_token?: string;
    id_token?: string;
    expired?: boolean;
  }

  export interface UserManagerSettings {
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
    userStore?: WebStorageStateStore;
    metadata?: Record<string, unknown>;
    [key: string]: unknown;
  }

  export class WebStorageStateStore {
    constructor(options: { store: Storage });
  }

  export interface UserManagerEvents {
    addUserLoaded(callback: (user: User) => void): void;
    addUserUnloaded(callback: () => void): void;
    addAccessTokenExpired(callback: () => void): void;
    addAccessTokenExpiring(callback: () => void): void;
    addSilentRenewError(callback: (error: unknown) => void): void;
  }

  export class UserManager {
    constructor(settings: UserManagerSettings);
    readonly events: UserManagerEvents;
    signinRedirect(args?: { extraQueryParams?: Record<string, string> }): Promise<void>;
    signinRedirectCallback(): Promise<User>;
    signinSilent(): Promise<User>;
    signinSilentCallback(): Promise<void>;
    signoutRedirect(args?: { extraQueryParams?: Record<string, string>; post_logout_redirect_uri?: string }): Promise<void>;
    signoutRedirectCallback(): Promise<void>;
    getUser(): Promise<User | null>;
    removeUser(): Promise<void>;
  }
}
