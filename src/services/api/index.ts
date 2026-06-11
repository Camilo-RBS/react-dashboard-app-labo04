import Role from '@/models/api/entities/Role'
import Permissions from '@/models/api/entities/Permissions'
import Movie from '@/models/api/entities/Movie'
import Hall from '@/models/api/entities/Hall'
import CineFunction from '@/models/api/entities/CineFunction'
import Service from '../core/Service'
import UserService from './custom/UserService'

//custom
export const userService = new UserService()

//core
export const roleService = new Service<Role>({ endpoint: 'roles' })
export const permissionService = new Service<Permissions>({
  endpoint: 'permissions',
})

//cine
export const movieService = new Service<Movie>({ endpoint: 'cine/peliculas' })
export const hallService = new Service<Hall>({ endpoint: 'cine/salas' })
export const cineFunctionService = new Service<CineFunction>({
  endpoint: 'cine/catalogo',
})
