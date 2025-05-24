import React, { ReactNode } from "react";
import { Header } from "./_components/header";

const PublicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <Header />
      {children}
    </main>
  );
};

export default PublicLayout;
