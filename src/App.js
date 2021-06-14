import logo from './logo.svg';
import GlobalProvider from "./provider/GlobalProvider";
import AppRouter from "./router/Router";

export default function App() {
  return (
      <GlobalProvider>
        <AppRouter />
      </GlobalProvider>
  );
}


