import React from "react";

import Header from "~/components/regions/header";
import Body from "~/components/regions/body";
import Footer from "~/components/regions/footer";
import Toast from "~/components/regions/toast";

import TopBar from "~/components/layout/top-bar";
import BottomBar from "~/components/layout/bottom-bar";
import Controls from "~/components/layout/controls";

import Home from "~/components/views/home";
import Search from "~/components/views/search";
import Create from "~/components/views/create";
import CreateProvider from "~/components/views/create/context";
import Report from "~/components/views/report";
import MapProvider from "~/components/layout/map/context";
import Reports from "~/components/layout/reports";
import Map from "~/components/layout/map";

export default function Index() {
  return (
    <MapProvider>
      <Home />
      <Search />
      <Report />
      <CreateProvider>
        <Create />
      </CreateProvider>
      <div className="layer z-10">
        <Map className="absolute inset-0">
          <Reports />
        </Map>
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