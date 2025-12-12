import { useCallback, useEffect, useState } from 'react';
import type { PyodideInterface } from 'pyodide';

import './App.scss'
import EditorInput from 'src/components/editor/editor-input';
import EditorOutput from 'src/components/editor/editor-output';
import useEditorExecute from 'src/hooks/use-editor-execute';

function App() {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [executing, setExecuting] = useState<boolean>(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [editorCode, setEditorCode] = useState<string>('// Yor code here');

  const { pyodideLoader, executeCode } = useEditorExecute();

  const executeHandler = useCallback(async () => {
    console.log('111 pyodide', pyodide, 'executing', executing);
    if (!pyodide || executing) return;

    setExecuting(true);
    setConsoleOutput([]);
    setConsoleOutput(await executeCode(pyodide, editorCode));
    setExecuting(false);
  }, []);

  useEffect(() => {
    if (!pyodide) pyodideLoader().then((loaded: any) => setPyodide(loaded));
  });

  return (
    <>
      <h1>Editor</h1>
      <button
        onClick={executeHandler}
        disabled={!pyodide || executing}
      >
        {
          !pyodide ? "Loading..." : (executing ? "Executing..." : "Execute")
        }
      </button>
      <div className='global-wrapper'>
        <EditorInput editorCode={editorCode} setEditorCode={setEditorCode} />
        <EditorOutput output={consoleOutput} />
      </div>
    </>
  )
}

export default App;
