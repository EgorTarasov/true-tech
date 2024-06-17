import { Outlet, getRouterContext } from "@tanstack/react-router";
import { forwardRef, useContext, useRef } from "react";
import { useIsPresent, motion } from "framer-motion";
import { cloneDeep } from "lodash";

export const AnimatedOutlet = forwardRef<HTMLDivElement>((_, ref) => {
  const RouterContext = getRouterContext();

  const routerContext = useContext(RouterContext);

  const renderedContext = useRef(routerContext);

  const isPresent = useIsPresent();

  if (isPresent) {
    renderedContext.current = cloneDeep(routerContext);
  }

  const transitionProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <motion.div ref={ref} {...transitionProps} className="h-full flex">
      <RouterContext.Provider value={renderedContext.current}>
        <Outlet />
      </RouterContext.Provider>
    </motion.div>
  );
});
