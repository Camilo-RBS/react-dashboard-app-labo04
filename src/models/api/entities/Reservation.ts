import BaseEntity from '../core/_BaseEntity'
import type CineFunction from './CineFunction'
import type User from './User'

export default interface Reservation extends BaseEntity {
  user?: User
  function?: CineFunction
  functionId?: number
  seats?: number
  totalPrice?: number
  createdAt?: string
}
