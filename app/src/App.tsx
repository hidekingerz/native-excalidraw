import { useState } from "react";
import { Excalidraw, MainMenu, WelcomeScreen, serializeAsJSON, exportToBlob, exportToSvg } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI, ExcalidrawProps } from '@excalidraw/excalidraw/types/types'
import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile, writeFile } from "@tauri-apps/plugin-fs";

function App() {

  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const [viedModeEnabled] = useState<boolean>(false);
  const [gridModeEnabled] = useState<boolean>(false);
  const [theme] = useState<ExcalidrawProps['theme']>('light');

  return (
    <div style={{ height: '97vh' }}>
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        viewModeEnabled={viedModeEnabled}
        gridModeEnabled={gridModeEnabled}
        theme={theme}
      >
        <MainMenu>
          <MainMenu.Item onSelect={async () => {
            if (!excalidrawAPI) return;

            const path = await save({ defaultPath: "image.excalidraw" });
            if (!path) return;

            console.log('save');

            const file = serializeAsJSON(excalidrawAPI.getSceneElements(), excalidrawAPI.getAppState(), excalidrawAPI.getFiles(), "local");
            await writeTextFile(path, file);
          }}>
            Save..
          </MainMenu.Item>
          <MainMenu.Item onSelect={async () => {
            if (!excalidrawAPI) return;

            const path = await save({ defaultPath: "image.png" });
            if (!path) return;

            const blob = await exportToBlob({
              elements: excalidrawAPI.getSceneElements(),
              mimeType: "image/png",
              appState: excalidrawAPI.getAppState(),
              files: excalidrawAPI.getFiles()
            });
            const arrayBuffer = await blob.arrayBuffer();
            await writeFile(path, new Uint8Array(arrayBuffer));
          }}>
            Export to png...
          </MainMenu.Item>
          <MainMenu.Item onSelect={async () => {
            if (!excalidrawAPI) return;

            const path = await save({ defaultPath: "image.svg" });
            if (!path) return;

            const svg = await exportToSvg({
              elements: excalidrawAPI?.getSceneElements(),
              appState: excalidrawAPI.getAppState(),
              files: excalidrawAPI?.getFiles()
            });
            await writeTextFile(path, svg.outerHTML);
          }}>Export to svg...</MainMenu.Item>

          <MainMenu.DefaultItems.LoadScene />
          <MainMenu.DefaultItems.ClearCanvas />
          <MainMenu.DefaultItems.ToggleTheme />
          <MainMenu.DefaultItems.Help />
        </MainMenu>
        <WelcomeScreen />
      </Excalidraw>
    </div >
  )

}

export default App;
