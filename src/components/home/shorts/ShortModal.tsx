"use client";
import Modal from "../../../components/gallery/modal/Modal";
import React, { useEffect } from "react";
import ShortBody from "./ShortBody";
import { useContextApi } from "../../../context/contextAPI/ContextAPI";
import "./shortModal.scss";
export default function ShortModal() {
  const { activeModal, setActiveModal } = useContextApi();
  function activeModalHandler() {
    setActiveModal(false);
  }

  // if (activeModal) {
  //   useEffect(() => {
  //     let elem = document.querySelector<HTMLDivElement>(
  //       ".short-modal-progress"
  //     )!;
  //     let width = 1;
  //     let id = setInterval(frame, 30);
  //     setTimeout(() => {
  //       activeModalHandler();
  //     }, 3000);
  //     function frame() {
  //       if (width >= 100) {
  //         clearInterval(id);
  //       } else {
  //         width++;

  //         elem.style.backgroundColor = "green";
  //         elem.style.width = width + "%";
  //       }
  //     }
  //   }, []);
  // }

  return (
    <>
      {activeModal ? (
        <Modal className="short-modal">
          <ShortBody shortModal="short-modal-progress" />
        </Modal>
      ) : null}
    </>
  );
}
