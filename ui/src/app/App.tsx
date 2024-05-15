import "./index.scss";
import "./transitions.scss";
import "@/assets/fonts/style.css";
import "regenerator-runtime/runtime";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { RoutesStore } from "./routes";
import { useEffect, useLayoutEffect, useMemo } from "react";
import { SkipToContent } from "@/components/SkipToContent";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation/Navigation";
import { AuthService } from "../stores/auth.store";
import { Loading } from "@/components/loading/Loading";
import { toast } from "sonner";
import { SpeechRecognitionAction } from "@/components/buttons/SpeechRecognitionAction";

const NotFound = () => {
  return (
    <div className="appear flex delay-1000 flex-col items-center justify-center h-full">
      <h1 className="text-4xl">404</h1>
      <h2 className="text-2xl">Страница не найдена</h2>
    </div>
  );
};

const App = observer(() => {
  const location = useLocation();
  const routeFallback = useMemo(() => {
    if (AuthService.item.state === "anonymous") {
      return <Navigate to="/login" />;
    }

    return <NotFound />;
  }, [AuthService.item.state]);

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    const currentRoute = RoutesStore.routes.find((v) => v.path === location.pathname);
    if (currentRoute) {
      document.title = currentRoute.title;
    }
  }, [location.pathname]);

  if (AuthService.item.state === "loading") {
    return <Loading />;
  }

  return (
    <div className="flex flex-col text-text-primary sm:bg-bg-desktop h-full">
      <SkipToContent />
      <Navigation />
      <main
        id="content"
        tabIndex={-1}
        className={"bg-bg2 w-full h-full overflow-x-hidden text-black"}>
        <SwitchTransition>
          <CSSTransition key={location.pathname} classNames="fade" timeout={150} unmountOnExit>
            <Routes location={location}>
              {RoutesStore.routes.map((route, index) => (
                <Route key={index} path={route.path} element={<route.component />} />
              ))}
              <Route path="*" element={routeFallback} />
            </Routes>
          </CSSTransition>
        </SwitchTransition>
      </main>
      <Footer />
    </div>
  );
});

export default App;
