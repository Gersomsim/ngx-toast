import { AnimationType, NotifyPosition } from "../types"

export interface NgxNotifyConfig {
 timer?: number
 toastPosition?: NotifyPosition
 toastBtnClose?: boolean
 toastIcon?: boolean
 toastAnimation?: AnimationType
 // Configuración de botones de confirmación
 toastColors: {
  successColor?: string
  errorColor?: string
  warningColor?: string
  infoColor?: string
}
  mainBgColor?: string
  mainTextColor?: string
 confirmBtnColor?: string
 confirmBtnTextColor?: string
 cancelBtnColor?: string
 cancelBtnTextColor?: string
 // Configuración de colores
 
}