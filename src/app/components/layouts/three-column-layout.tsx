import React, { ReactNode } from "react";
import LeftSidebar from "../left-sidebar";
import Providers from "../providers";
import RightSidebar from "../right-sidebar";

interface ThreeColumnLayoutProps {
  children: ReactNode;
}

const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({ children }) => {
  return (
    <Providers>
      <main className="max-w-[1400px] mx-auto space-y-5 min-h-screen">
        <div className="flex flex-col lg:flex-row min-h-screen w-full">
          <div className="lg:w-1/5 lg:sticky lg:top-[64px] lg:h-[calc(100vh-64px)]">
            <div className="p-4 max-h-screen overflow-y-auto">
              <LeftSidebar />
            </div>
          </div>
          <div className="flex-1 p-4">
            {children}
          </div>
          <div className="lg:w-1/5 lg:sticky lg:top-[64px] lg:h-[calc(100vh-64px)]">
            <div className="p-4 max-h-screen overflow-y-auto">
              <RightSidebar />
            </div>
          </div>
        </div>
      </main>
    </Providers>
  );
};

export default ThreeColumnLayout;