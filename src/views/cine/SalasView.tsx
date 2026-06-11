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
import type Hall from '@/models/api/entities/Hall'
import { queryKeys } from '@/lib/queryClient'
import { hallService } from '@/services/api'
import { useFindAll } from '@/hooks/core/useFindAll'
import useCrud from '@/hooks/core/useCrud'

export default function SalasView() {
  const [params, setParams] = useState<Record<string, unknown>>({
    page: 0,
    size: 10,
  })
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Hall | null>(null)
  const [form] = Form.useForm()

  const { data: response, isLoading } = useFindAll<Hall>({
    queryKey: queryKeys.halls,
    service: hallService,
    queryParams: params,
  })

  const crud = useCrud<Hall>({
    service: hallService,
    queryKey: queryKeys.halls,
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

  const openEdit = (item: Hall) => {
    setEditing(item)
    form.setFieldsValue(item)
    setOpen(true)
  }

  const handleDelete = async (id?: string | number) => {
    if (!id) return
    await crud.remove({ id })
    message.success('Sala eliminada')
  }

  const handleOk = async () => {
    const values = await form.validateFields()
    try {
      if (editing) {
        await crud.update({ id: editing.id!, payload: values })
        message.success('Sala actualizada')
      } else {
        await crud.create({ payload: values as Hall })
        message.success('Sala creada')
      }
      setOpen(false)
      form.resetFields()
    } catch {
      message.error('Error al guardar la sala')
    }
  }

  const columns: ColumnsType<Hall> = [
    { title: 'ID', dataIndex: 'id', key: 'id', align: 'center', width: 60 },
    { title: 'Nombre', dataIndex: 'name', key: 'name', align: 'center' },
    {
      title: 'Capacidad',
      dataIndex: 'capacity',
      key: 'capacity',
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
          Nueva sala
        </Button>
      </div>

      <Table<Hall>
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
        title={editing ? 'Editar sala' : 'Nueva sala'}
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
            name="name"
            label="Nombre"
            rules={[{ required: true, message: 'Ingresa el nombre' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="capacity" label="Capacidad">
            <InputNumber min={1} className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
