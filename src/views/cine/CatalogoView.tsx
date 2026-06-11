import {
  Button,
  DatePicker,
  Form,
  InputNumber,
  Modal,
  Space,
  Table,
  message,
} from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import dayjs from 'dayjs'
import { useState } from 'react'
import type CineFunction from '@/models/api/entities/CineFunction'
import type Movie from '@/models/api/entities/Movie'
import type Hall from '@/models/api/entities/Hall'
import { queryKeys } from '@/lib/queryClient'
import { cineFunctionService, movieService, hallService } from '@/services/api'
import { useFindAll } from '@/hooks/core/useFindAll'
import useCrud from '@/hooks/core/useCrud'
import SelectApi from '@/components/core/SelectApi'

export default function CatalogoView() {
  const [params, setParams] = useState<Record<string, unknown>>({
    page: 0,
    size: 10,
  })
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<CineFunction | null>(null)
  const [form] = Form.useForm()

  const { data: response, isLoading } = useFindAll<CineFunction>({
    queryKey: queryKeys.cineFunctions,
    service: cineFunctionService,
    queryParams: params,
  })

  const crud = useCrud<CineFunction>({
    service: cineFunctionService,
    queryKey: queryKeys.cineFunctions,
  })

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setParams((prev) => ({
      ...prev,
      page: (pagination.current ?? 1) - 1,
      size: pagination.pageSize ?? prev.size,
    }))
  }

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    setOpen(true)
  }

  const openEdit = (item: CineFunction) => {
    setEditing(item)
    form.setFieldsValue({
      movie: item.movie,
      hall: item.hall,
      startTime: item.startTime ? dayjs(item.startTime) : null,
      price: item.price,
    })
    setOpen(true)
  }

  const handleDelete = async (id?: string | number) => {
    if (!id) return
    await crud.remove({ id })
    message.success('Función eliminada')
  }

  const handleOk = async () => {
    const values = await form.validateFields()
    const payload: Partial<CineFunction> = {
      movieId: values.movie?.id,
      hallId: values.hall?.id,
      startTime: values.startTime
        ? dayjs(values.startTime).format('YYYY-MM-DDTHH:mm:ss')
        : undefined,
      price: values.price,
    }

    try {
      if (editing) {
        await crud.update({ id: editing.id!, payload })
        message.success('Función actualizada')
      } else {
        await crud.create({ payload: payload as CineFunction })
        message.success('Función creada')
      }
      setOpen(false)
      form.resetFields()
    } catch {
      message.error('Error al guardar la función')
    }
  }

  const columns: ColumnsType<CineFunction> = [
    { title: 'ID', dataIndex: 'id', key: 'id', align: 'center', width: 60 },
    {
      title: 'Película',
      key: 'movie',
      align: 'center',
      render: (_, r) => r.movie?.title ?? '-',
    },
    {
      title: 'Sala',
      key: 'hall',
      align: 'center',
      render: (_, r) => r.hall?.name ?? '-',
    },
    {
      title: 'Inicio',
      dataIndex: 'startTime',
      key: 'startTime',
      align: 'center',
      render: (v) => (v ? dayjs(v).format('DD/MM/YYYY HH:mm') : '-'),
    },
    {
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: (v) => (v != null ? `$${Number(v).toFixed(2)}` : '-'),
    },
    {
      title: 'Acciones',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openEdit(record)}>
            Editar
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Eliminar
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <Button type="primary" onClick={openCreate}>
          Nueva función
        </Button>
      </div>

      <Table<CineFunction>
        columns={columns}
        dataSource={response?.data}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: (response?.pagination.page ?? 0) + 1,
          pageSize: response?.pagination.pageSize,
          total: response?.pagination.total ?? 0,
          showSizeChanger: true,
          position: ['bottomCenter'],
        }}
        onChange={handleTableChange}
      />

      <Modal
        title={editing ? 'Editar función' : 'Nueva función'}
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        okText="Guardar"
        cancelText="Cancelar"
        confirmLoading={crud.isCreating || crud.isUpdating}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="movie"
            label="Película"
            rules={[{ required: true, message: 'Selecciona una película' }]}
          >
            <SelectApi<Movie>
              service={movieService}
              queryKey={queryKeys.movies}
              placeholder="Selecciona una película"
              renderOption={(item) => item.title ?? String(item.id)}
            />
          </Form.Item>

          <Form.Item
            name="hall"
            label="Sala"
            rules={[{ required: true, message: 'Selecciona una sala' }]}
          >
            <SelectApi<Hall>
              service={hallService}
              queryKey={queryKeys.halls}
              placeholder="Selecciona una sala"
              renderOption={(item) => item.name ?? String(item.id)}
            />
          </Form.Item>

          <Form.Item
            name="startTime"
            label="Fecha y hora de inicio"
            rules={[{ required: true, message: 'Ingresa la fecha y hora' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            name="price"
            label="Precio"
            rules={[{ required: true, message: 'Ingresa el precio' }]}
          >
            <InputNumber min={0.01} step={0.5} className="w-full" prefix="$" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
