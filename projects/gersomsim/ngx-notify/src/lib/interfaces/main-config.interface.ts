import { AnimationType, NotifyPosition } from "../types"

export interface NgxNotifyConfig {
 timer?: number
 toast: {
  position?: NotifyPosition
  closeButton?: boolean
  icon?: boolean
  animation?: AnimationType
 }
 // Configuración de botones de confirmación
  successColor?: string
  errorColor?: string
  warningColor?: string
  infoColor?: string
  mainBgColor?: string
  mainTextColor?: string
 confirmBtnColor?: string
 confirmBtnTextColor?: string
 cancelBtnColor?: string
 cancelBtnTextColor?: string
 // Configuración de colores
 
}