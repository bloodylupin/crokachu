import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Mint from "./pages/Mint";
import Royalties from "./pages/Royalties";
import Collection from "./pages/Collection";
import Memory from "./pages/Memory";

type Route = {
  path: string;
  name: string;
  element: JSX.Element;
};

type Routes = Route[];

export const routes: Routes = [
  {
    path: "/",
    name: "Home",
    element: <Home />,
  },
  {
    path: "/mint",
    name: "Mint",
    element: <Mint />,
  },
  {
    path: "/royalties",
    name: "Royalties",
    element: <Royalties />,
  },
  {
    path: "/collection",
    name: "Collection",
    element: <Collection />,
  },
  {
    path: "/memory",
    name: "Memory",
    element: <Memory />,
  },
];

import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";

import { CrokachuProvider } from "./contexts/CrokachuContext";

const getLibrary = (
  provider:
    | ethers.providers.ExternalProvider
    | ethers.providers.JsonRpcFetchFunc
) => new ethers.providers.Web3Provider(provider);

function App(): JSX.Element {
  return (
    <div className="App font-pressStart text-white">
      <Web3ReactProvider getLibrary={getLibrary}>
        <CrokachuProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                {[...routes].map(({ path, element }) => (
                  <Route path={path} element={element} key={path} />
                ))}
              </Routes>
            </Layout>
          </BrowserRouter>
        </CrokachuProvider>
      </Web3ReactProvider>
    </div>
  );
}

export default App;
