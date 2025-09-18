export type NavigationType = {
  SplashScreen: undefined;
  SendOtp: undefined;
  VerifyOtp: { mobile_number: string };
  CreateNewUser: undefined;
  NetworkIssueScreen: undefined;

  //   Drawer Navigations

  HomeStack: undefined;
  Home: undefined;
  ExploreMoreAnalytics: undefined;
  DetailScreen: {
    data: {
      channel: string;
      image_url: string;
      meter_reading: string;
      outlet: string;
      region: string;
      serial_number: string;
      status: boolean;
      verify_time: string;
      timestamp: string;
    };
  };
  ViewAllHistory: undefined;
  Settings: undefined;
  AboutScreen: undefined;
  SubmitionPreview: {
    url: string;
    serial_number: string;
    meter_reading: string;
    outlet: string;
    verify_time?: string | null;
    status?: boolean;
    timestamp: string;
  };
  OcrScreen: undefined;
  ProfileScreen: undefined;
};
