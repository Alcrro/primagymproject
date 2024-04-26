import React from "react";

const layout = (props: {
  modal: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div>
      {props.modal}
      {props.children}
    </div>
  );
};

export default layout;
