import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/router";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="flex flex-wrap lg:flex-nowrap bg-slate-100">
          <Navbar />
          <main className="flex flex-col overflow-y-auto w-full max-w-full lg:h-full h-full">
            <AppRouter />
          </main>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
