"use client"

import { useState } from "react"
import AiIntakeModal from "./AiIntakeModal"
import IntakeForm from "./IntakeForm"

interface IAiIntakeModalWrapperProps {
  hasAI: boolean
}

export default function AiIntakeModalWrapper({ hasAI }: IAiIntakeModalWrapperProps) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return hasAI
    ? <AiIntakeModal onClose={() => setVisible(false)} />
    : <IntakeForm onClose={() => setVisible(false)} />
}
