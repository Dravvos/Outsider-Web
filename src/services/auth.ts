import { UserManager, type UserManagerSettings, User } from 'oidc-client-ts';
const settings: UserManagerSettings = {
  authority: import.meta.env.VITE_API_IdentityServer,
  client_id: 'vue-client',
  redirect_uri: import.meta.env.VITE_redirect_uri,
  response_type: 'code',
  scope: 'openid profile Outsider',
  post_logout_redirect_uri: import.meta.env.post_logout_redirect_uri
};

const userManager = new UserManager(settings);

export const login = () => userManager.signinRedirect();
export const signUp = () => window.location.href = import.meta.env.VITE_SignUpURL;
export const logout = () => userManager.signoutRedirect();
export const getUser = (): Promise<User | null> => userManager.getUser();
export const handleCallback = (): Promise<User> => userManager.signinRedirectCallback();
export const getAccessToken = (): Promise<string> => userManager.getUser().then((data: any) => { return data?.access_token })

export default userManager;
