export default interface Adaptor<AuthenticationData, FetchData, StatusData> {
  authenticate: (params: AuthenticationData) => Promise<any>;
  getData: (params: FetchData) => Promise<any>;
  onProgress: (callback: (StatusData) => void) => void;
  stop: () => void
};