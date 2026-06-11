import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Table,
  message,
} from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { useState } from 'react'
import type Movie from '@/models/api/entities/Movie'
import { queryKeys } from '@/lib/queryClient'
import { movieService } from '@/services/api'
import { useFindAll } from '@/hooks/core/useFindAll'
import useCrud from '@/hooks/core/useCrud'

export default function PeliculasView() {
  const [params, setParams] = useState<Record<string, unknown>>({
    page: 0,
    size: 10,
  })
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Movie | null>(null)
  const [form] = Form.useForm()

  const { data: response, isLoading } = useFindAll<Movie>({
    queryKey: queryKeys.movies,
    service: movieService,
    queryParams: params,
  })

  const crud = useCrud<Movie>({
    service: movieService,
    queryKey: queryKeys.movies,
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

  const openEdit = (item: Movie) => {
    setEditing(item)
    form.setFieldsValue(item)
    setOpen(true)
  }

  const handleDelete = async (id?: string | number) => {
    if (!id) return
    await crud.remove({ id })
    message.success('Película eliminada')
  }

  const handleOk = async () => {
    const values = await form.validateFields()
    try {
      if (editing) {
        await crud.update({ id: editing.id!, payload: values })
        message.success('Película actualizada')
      } else {
        await crud.create({ payload: values as Movie })
        message.success('Película creada')
      }
      setOpen(false)
      form.resetFields()
    } catch {
      message.error('Error al guardar la película')
    }
  }

  const columns: ColumnsType<Movie> = [
    { title: 'ID', dataIndex: 'id', key: 'id', align: 'center', width: 60 },
    { title: 'Título', dataIndex: 'title', key: 'title', align: 'center' },
    { title: 'Género', dataIndex: 'genre', key: 'genre', align: 'center' },
    {
      title: 'Duración (min)',
      dataIndex: 'duration',
      key: 'duration',
      align: 'center',
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
          Nueva película
        </Button>
      </div>

      <Table<Movie>
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
        title={editing ? 'Editar película' : 'Nueva película'}
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
            name="title"
            label="Título"
            rules={[{ required: true, message: 'Ingresa el título' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="genre" label="Género">
            <Input />
          </Form.Item>
          <Form.Item name="duration" label="Duración (minutos)">
            <InputNumber min={1} className="w-full" />
          </Form.Item>
          <Form.Item name="description" label="Descripción">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
