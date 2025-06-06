// types/router.d.ts
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    // Autenticación básica
    requiresAuth?: boolean
    guest?: boolean

    // Roles de usuario
    requiresRole?: string[]

    // ✅ NUEVA: Verificar que tenga business asignado
    requiresBusiness?: boolean

    // UI/Layout
    hideHeaderFooter?: boolean
    hideHeader?: boolean
    hideFooter?: boolean

    // SEO/Meta
    title?: string
    description?: string
    keywords?: string

    // Otras propiedades personalizadas que puedas tener
    layout?: string
    permissions?: string[]
    breadcrumb?: string
  }
}
