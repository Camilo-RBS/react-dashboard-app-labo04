import {
  Users,
  Key,
  LayoutDashboard,
  Film,
  Tv,
  Clapperboard,
} from 'lucide-react'
import React from 'react'
import type { LucideProps } from 'lucide-react'
import type { MenuItem, SubMenuItem } from '@/models/app/menu'
import { roles } from '@/enum/role'
import { RoutesEnum } from '@/enum/routes..app'

export const createIcon = (IconComponent: React.ComponentType<LucideProps>) =>
  React.createElement(IconComponent)

export const menu: MenuItem[] = [
  {
    key: RoutesEnum.DASHBOARD,
    icon: createIcon(LayoutDashboard),
    label: 'Dashboard',
    authorized: [roles.all],
    view: true,
    children: [],
  },
  {
    key: RoutesEnum.ROLES,
    icon: createIcon(Users),
    label: 'Roles',
    authorized: [roles.all],
    view: true,
    children: [],
  },
  {
    key: RoutesEnum.PERMISSIONS,
    icon: createIcon(Key),
    label: 'Permisos',
    authorized: [roles.all],
    view: true,
    children: [],
  },
  {
    key: RoutesEnum.CINE,
    icon: createIcon(Film),
    label: 'Cine',
    authorized: [roles.all],
    view: true,
    children: [
      {
        key: RoutesEnum.CINE_CATALOGO,
        label: 'Catálogo',
        icon: createIcon(Clapperboard),
        authorized: [roles.all],
        view: true,
      } as SubMenuItem,
      {
        key: RoutesEnum.CINE_PELICULAS,
        label: 'Películas',
        icon: createIcon(Film),
        authorized: [roles.all],
        view: true,
      } as SubMenuItem,
      {
        key: RoutesEnum.CINE_SALAS,
        label: 'Salas',
        icon: createIcon(Tv),
        authorized: [roles.all],
        view: true,
      } as SubMenuItem,
    ],
  },
]

export function selectItemMenu(route: string): MenuItem | undefined {
  const data = menu.find((item) => route.startsWith(item.key))
  return data
}

export function selectSubItemMenu(route: string): SubMenuItem | undefined {
  const item = selectItemMenu(route)
  const data = (item?.children || []).find((item) => item.key === route)
  return data
}
