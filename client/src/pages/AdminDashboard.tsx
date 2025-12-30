import { useEffect, useState } from 'react';
import { getProducts, getServices, createProduct, updateProduct, deleteProduct, createService, updateService, deleteService } from '../utils/api';
import { toast } from 'react-toastify';
import { adminDashboardStyles } from '../styles/AdminDashboard.styles';
import { commonStyles } from '../styles/common';
import { Product, Service, CreateProductRequest, CreateServiceRequest } from '../types';
import { handleApiError, handleApiSuccess } from '../utils/errorHandler';

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'services'>('products');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<CreateProductRequest | CreateServiceRequest | {}>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, servicesRes] = await Promise.all([
        getProducts(),
        getServices(),
      ]);
      setProducts(productsRes.data);
      setServices(servicesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        handleApiSuccess('Product updated successfully');
      } else {
        await createProduct(formData as CreateProductRequest);
        handleApiSuccess('Product created successfully');
      }
      setShowProductModal(false);
      setEditingProduct(null);
      setFormData({});
      fetchData();
    } catch (error: any) {
      handleApiError(error, 'Failed to save product');
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        await updateService(editingService.id, formData as CreateServiceRequest);
        handleApiSuccess('Service updated successfully');
      } else {
        await createService(formData as CreateServiceRequest);
        handleApiSuccess('Service created successfully');
      }
      setShowServiceModal(false);
      setEditingService(null);
      setFormData({});
      fetchData();
    } catch (error: any) {
      handleApiError(error, 'Failed to save service');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      handleApiSuccess('Product deleted successfully');
      fetchData();
    } catch (error: any) {
      handleApiError(error, 'Failed to delete product');
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await deleteService(id);
      handleApiSuccess('Service deleted successfully');
      fetchData();
    } catch (error: any) {
      handleApiError(error, 'Failed to delete service');
    }
  };

  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({});
    }
    setShowProductModal(true);
  };

  const openServiceModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData(service);
    } else {
      setEditingService(null);
      setFormData({});
    }
    setShowServiceModal(true);
  };

  return (
    <div className={adminDashboardStyles.container}>
      <h1 className={adminDashboardStyles.title}>Admin Dashboard</h1>

      {/* Tabs */}
      <div className={adminDashboardStyles.tabs}>
        <button
          onClick={() => setActiveTab('products')}
          className={adminDashboardStyles.tabButton(activeTab === 'products')}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={adminDashboardStyles.tabButton(activeTab === 'services')}
        >
          Services
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <div className={adminDashboardStyles.sectionHeader}>
            <h2 className={adminDashboardStyles.sectionTitle}>Products</h2>
            <button
              onClick={() => openProductModal()}
              className={adminDashboardStyles.addButton}
            >
              Add Product
            </button>
          </div>
          <div className={adminDashboardStyles.grid}>
            {products.map((product) => (
              <div key={product.id} className={adminDashboardStyles.itemCard}>
                <img src={product.image} alt={product.name} className={adminDashboardStyles.itemImage} />
                <h3 className={adminDashboardStyles.itemName}>{product.name}</h3>
                <p className={adminDashboardStyles.itemPrice}>${product.price}</p>
                <div className={adminDashboardStyles.itemActions}>
                  <button
                    onClick={() => openProductModal(product)}
                    className={adminDashboardStyles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className={adminDashboardStyles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div>
          <div className={adminDashboardStyles.sectionHeader}>
            <h2 className={adminDashboardStyles.sectionTitle}>Services</h2>
            <button
              onClick={() => openServiceModal()}
              className={adminDashboardStyles.addButton}
            >
              Add Service
            </button>
          </div>
          <div className={adminDashboardStyles.grid}>
            {services.map((service) => (
              <div key={service.id} className={adminDashboardStyles.itemCard}>
                <img src={service.image} alt={service.name} className={adminDashboardStyles.itemImage} />
                <h3 className={adminDashboardStyles.itemName}>{service.name}</h3>
                <p className={adminDashboardStyles.itemPrice}>${service.price}</p>
                <div className={adminDashboardStyles.itemActions}>
                  <button
                    onClick={() => openServiceModal(service)}
                    className={adminDashboardStyles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className={adminDashboardStyles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div className={adminDashboardStyles.modalOverlay}>
          <div className={adminDashboardStyles.modalContent}>
            <h2 className={adminDashboardStyles.modalTitle}>
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            <form onSubmit={handleProductSubmit} className={adminDashboardStyles.form}>
              <div>
                <label className={adminDashboardStyles.formField}>Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={adminDashboardStyles.input}
                  required
                />
              </div>
              <div>
                <label className={adminDashboardStyles.formField}>Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={adminDashboardStyles.textarea}
                  required
                />
              </div>
              <div>
                <label className={adminDashboardStyles.formField}>Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className={adminDashboardStyles.input}
                  required
                />
              </div>
              <div>
                <label className={adminDashboardStyles.formField}>Image URL</label>
                <input
                  type="text"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className={adminDashboardStyles.input}
                  required
                />
              </div>
              <div>
                <label className={adminDashboardStyles.formField}>Category</label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={adminDashboardStyles.input}
                  required
                />
              </div>
              <div>
                <label className={adminDashboardStyles.formField}>Stock</label>
                <input
                  type="number"
                  value={formData.stock || ''}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  className={adminDashboardStyles.input}
                  required
                />
              </div>
              <div className={adminDashboardStyles.formButtons}>
                <button
                  type="button"
                  onClick={() => {
                    setShowProductModal(false);
                    setEditingProduct(null);
                    setFormData({});
                  }}
                  className={adminDashboardStyles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={adminDashboardStyles.saveButton}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Modal */}
      {showServiceModal && (
        <div className={adminDashboardStyles.modalOverlay}>
          <div className={adminDashboardStyles.modalContent}>
            <h2 className={adminDashboardStyles.modalTitle}>
              {editingService ? 'Edit Service' : 'Add Service'}
            </h2>
            <form onSubmit={handleServiceSubmit} className={adminDashboardStyles.form}>
              <div>
                <label className={adminDashboardStyles.formField}>Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={adminDashboardStyles.input}
                  required
                />
              </div>
              <div>
                <label className={adminDashboardStyles.formField}>Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={adminDashboardStyles.textarea}
                  required
                />
              </div>
              <div>
                <label className={adminDashboardStyles.formField}>Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className={adminDashboardStyles.input}
                  required
                />
              </div>
              <div>
                <label className={adminDashboardStyles.formField}>Duration (minutes)</label>
                <input
                  type="number"
                  value={formData.duration || ''}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className={adminDashboardStyles.input}
                  required
                />
              </div>
              <div>
                <label className={adminDashboardStyles.formField}>Image URL</label>
                <input
                  type="text"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className={adminDashboardStyles.input}
                  required
                />
              </div>
              <div>
                <label className={adminDashboardStyles.formField}>Category</label>
                <select
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={adminDashboardStyles.select}
                  required
                >
                  <option value="">Select category</option>
                  <option value="walking">Walking</option>
                  <option value="boarding">Boarding</option>
                  <option value="training">Training</option>
                  <option value="grooming">Grooming</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className={adminDashboardStyles.formButtons}>
                <button
                  type="button"
                  onClick={() => {
                    setShowServiceModal(false);
                    setEditingService(null);
                    setFormData({});
                  }}
                  className={adminDashboardStyles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={adminDashboardStyles.saveButton}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

