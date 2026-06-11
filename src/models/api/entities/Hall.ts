import BaseEntity from '../core/_BaseEntity'

export default interface Hall extends BaseEntity {
  name: string
  capacity?: number
}
