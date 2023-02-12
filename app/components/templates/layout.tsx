import type { ReactNode } from "react";
import React from "react";

import MapProvider from "~/components/layout/map/context";
import Map from "~/components/layout/map";
import TopBar from "~/components/layout/top-bar";
import Header from "~/components/regions/header";
import Toast from "~/components/regions/toast";
import Controls from "~/components/layout/controls";
import Body from "~/components/regions/body";
import Footer from "~/components/regions/footer";
import BottomBar from "~/components/layout/bottom-bar";

interface Props {
  children: ReactNode;
}

export function Layout({ children }: Props) {
  return (
    <MapProvider>
      {/*<Home />*/}
      {/*<Search />*/}
      {/*<Report />*/}
      {/*<CreateProvider>*/}
      {/*  <Create />*/}
      {/*</CreateProvider>*/}
      {children}
      <div className="layer z-10">
        <Map className="absolute inset-0">{/*<Reports />*/}</Map>
      </div>
      <div className="layer pointer-events-none z-20">
        <div className="clamp mx-auto flex h-full flex-col drop-shadow-lg">
          <TopBar />
          <Header.Container />
          <div className="flex flex-grow justify-between overflow-hidden py-4 transition-all">
            <Toast.Container />
            <Controls />
          </div>
          <Body.Container />
          <Footer.Container />
          <BottomBar />
        </div>
      </div>
    </MapProvider>
  );
}