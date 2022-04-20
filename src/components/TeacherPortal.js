import React from 'react';

export const TeacherPortal = () => {
  /* useEffect(() => {
    Array.from(document.getElementsByTagName('iframe')).forEach(iframe => {
      iframe.contentWindow.addEventListener(
        'load',
        () => {
          const doc = iframe.contentWindow.document;
          iframe.height = doc.body.scrollHeight;
        },
        true
      );
      iframe.contentWindow.addEventListener(
        'resize',
        () => {
          iframe.height = iframe.contentWindow.document.body.scrollHeight + 40;
        },
        true
      );
    });
  }, []); */
  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}
    >
      <iframe
        src="https://playpowerlabs.shinyapps.io/teacher_portal/"
        width="100vw"
        height="100vh"
        style={{
          overflow: 'hidden',
          minHeight: '99vh',
          maxHeight: '100vh',
          width: '100vw',
          border: 'none'
        }}
      />
    </div>
  );
};

export default TeacherPortal;
