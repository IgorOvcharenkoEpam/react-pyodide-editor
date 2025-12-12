import { loadPyodide, type PyodideInterface } from 'pyodide';

import pyodideConfig from 'src/config/pyodide-config.ts';
import preload_python_packages from "src/data/preload_packages.json";

const useEditorExecute = () => {
  const consoleOutput: string[] = [];

  const stdout = (msg: string) => {
    consoleOutput.push(msg);
    console.log(msg);
  };

  const pyodideLoader = async (): Promise<PyodideInterface> => {
    const pyodide_version = pyodideConfig.version;

    console.log(`Found Pyodide version: ${pyodide_version}`);

    return loadPyodide({
      indexURL: `https://cdn.jsdelivr.net/pyodide/v${pyodide_version}/full/`,
      stdout: stdout,
      stderr: stdout,
      packages: preload_python_packages,
      checkAPIVersion: true,
    });
  };

  const executeCode = async (pyodide: PyodideInterface, code: string): Promise<string[]> => {
    consoleOutput.splice(0, consoleOutput.length);

    try {
      const dict = pyodide.globals.get('dict');
      const globals = dict();

      await pyodide.loadPackagesFromImports(code);
      await pyodide.runPythonAsync(code, { globals, locals: globals });

      globals.destroy();
      dict.destroy();
    } catch (error: any) {
      stdout(error.stack);
    } finally {
      stdout(`\n[Editor (Pyodide: v${pyodide.version}): ${new Date().toLocaleString('en-us')}]`);
    }

    return consoleOutput;
  };

  return {
    pyodideLoader,
    executeCode,
  }
};

export default useEditorExecute;
