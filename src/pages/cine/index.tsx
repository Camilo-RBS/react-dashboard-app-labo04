import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RoutesEnum } from '@/enum/routes..app'

export default function CinePage() {
  const navigate = useNavigate()
  useEffect(() => {
    navigate(RoutesEnum.CINE_CATALOGO, { replace: true })
  }, [navigate])
  return null
}
