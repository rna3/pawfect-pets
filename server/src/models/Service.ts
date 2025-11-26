import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ServiceAttributes {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  image: string;
  category: 'walking' | 'boarding' | 'training' | 'grooming' | 'other';
  createdAt?: Date;
  updatedAt?: Date;
}

interface ServiceCreationAttributes extends Optional<ServiceAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Service extends Model<ServiceAttributes, ServiceCreationAttributes> implements ServiceAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public duration!: number;
  public image!: string;
  public category!: 'walking' | 'boarding' | 'training' | 'grooming' | 'other';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Service.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 200],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'https://via.placeholder.com/300',
    },
    category: {
      type: DataTypes.ENUM('walking', 'boarding', 'training', 'grooming', 'other'),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'services',
  }
);

export default Service;

