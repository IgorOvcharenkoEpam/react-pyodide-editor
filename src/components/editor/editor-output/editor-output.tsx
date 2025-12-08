import './editor-output.scss';

type EditorOutputProps = {
  output?: string[];
}

const EditorOutput = ({ output = [] }: EditorOutputProps) => (
  <div className='editor-output-wrapper'>{output.join('\n')}</div>
);

export default EditorOutput;
