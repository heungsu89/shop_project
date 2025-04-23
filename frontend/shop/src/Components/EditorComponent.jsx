import React, { useRef, useEffect } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';


const EditorComponent = ({ value, onChange }) => {
  const editorRef = useRef();

  // 부모로부터 받은 값 반영
  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current.getInstance();
      const currentMarkdown = editor.getMarkdown();
      if (currentMarkdown !== value) {
        editor.setMarkdown(value);
      }
    }
  }, [value]);

  const handleChange = () => {
    const content = editorRef.current.getInstance().getHTML();
    onChange(content); // 상태 업데이트
  };

  return (
    <div className="editorWrap">
      <Editor
        initialValue="" // 항상 비워둠
        previewStyle="vertical"
        height="400px"
        initialEditType="wysiwyg"
        useCommandShortcut={true}
        onChange={handleChange}
        ref={editorRef}
        hideModeSwitch={true}
      />
    </div>
  );
};

export default EditorComponent;