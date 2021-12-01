import {GlobalProvider} from "./provider/GlobalProvider";
import AppRouter from "./router/Router";
import {Helmet, HelmetProvider } from "react-helmet-async";

export default function App() {
  return (
      <GlobalProvider>
          <HelmetProvider>
              <Helmet>
                  <title>DividendTracer</title>
              </Helmet>
              <AppRouter />
          </HelmetProvider>
      </GlobalProvider>
  );
}


