import BaseEntity from '../core/_BaseEntity'

export default interface Movie extends BaseEntity {
  title: string
  description?: string
  duration?: number
  genre?: string
}
