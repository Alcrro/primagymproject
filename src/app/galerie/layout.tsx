import React from "react";

const layout = (props: {
  modal: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div>
      {props.children}
      {props.modal}
    </div>
  );
};

export default layout;
