interface AuthInterface {
  username: string;
  password: string;
}

interface AuthStoreInterface extends AuthInterface {
  id: number;
  email: string;
  fullname: string;
}

export type { AuthInterface, AuthStoreInterface };
